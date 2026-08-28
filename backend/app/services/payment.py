import hashlib
import hmac
from typing import Any

import requests
from fastapi import HTTPException

from app.config import settings

RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"


def _credentials() -> tuple[str, str]:
    key_id = settings.RAZORPAY_KEY_ID
    key_secret = settings.RAZORPAY_KEY_SECRET
    if not key_id or not key_secret:
        raise HTTPException(503, "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env.")
    return key_id, key_secret


def _request(method: str, path: str, **kwargs: Any) -> dict:
    key_id, key_secret = _credentials()
    try:
        response = requests.request(
            method,
            f"{RAZORPAY_BASE_URL}{path}",
            auth=(key_id, key_secret),
            timeout=15,
            **kwargs,
        )
    except requests.RequestException as exc:
        raise HTTPException(502, f"Unable to reach Razorpay: {exc}") from exc

    try:
        payload = response.json()
    except ValueError:
        payload = {"error": {"description": response.text[:300]}}

    if not response.ok:
        detail = payload.get("error", {}).get("description") or "Razorpay request failed"
        raise HTTPException(response.status_code if 400 <= response.status_code < 500 else 502, detail)

    return payload


def create_order(invoice_id: str, amount_rupees: float, customer_name: str) -> dict:
    amount_paise = int(round(float(amount_rupees) * 100))
    if amount_paise <= 0:
        raise HTTPException(400, "Invoice amount must be greater than zero for online payment.")

    return _request(
        "POST",
        "/orders",
        json={
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"vyapar_{invoice_id}"[:40],
            "notes": {
                "invoice_id": invoice_id,
                "customer": customer_name[:200],
            },
        },
    )


def verify_signature(order_id: str, payment_id: str, signature: str) -> bool:
    _, key_secret = _credentials()
    expected = hmac.new(
        key_secret.encode("utf-8"),
        f"{order_id}|{payment_id}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


def fetch_payment(payment_id: str) -> dict:
    return _request("GET", f"/payments/{payment_id}")


def capture_payment(payment_id: str, amount_paise: int) -> dict:
    return _request(
        "POST",
        f"/payments/{payment_id}/capture",
        json={"amount": amount_paise, "currency": "INR"},
    )
