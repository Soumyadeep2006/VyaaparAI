import { useCallback, useEffect, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,
  loginWithGoogle,
  sendPhoneOTP,
  verifyPhoneOTP,
} from "../../api/auth";
import { useAuth } from "../../context/AuthContext";


type LoginMode = "email" | "phone";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleLoginButton({
  onSuccess,
  onError,
}: {
  onSuccess: (credential: string) => Promise<void>;
  onError: (message: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !containerRef.current) {
      return;
    }

    let cancelled = false;

    const renderGoogleButton = () => {
      if (
        cancelled ||
        !containerRef.current ||
        !window.google
      ) {
        return;
      }

      containerRef.current.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          void onSuccess(response.credential);
        },
      });

      window.google.accounts.id.renderButton(
        containerRef.current,
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: 420,
        }
      );
    };

    if (window.google) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        renderGoogleButton,
        { once: true }
      );
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      script.onerror = () => {
        onError("Unable to load Google Sign-In.");
      };
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [onError, onSuccess]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        onClick={() =>
          onError(
            "Google login is not configured yet. Add VITE_GOOGLE_CLIENT_ID to frontend/.env.local."
          )
        }
        className="mt-5 flex w-full items-center justify-center rounded-xl border border-border bg-surface py-3 font-medium transition hover:bg-surface-2"
      >
        Continue with Google
      </button>
    );
  }

  return (
    <div className="mt-5 flex min-h-11 w-full justify-center overflow-hidden rounded-xl">
      <div ref={containerRef} />
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<LoginMode>("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finishLogin = (
    accessToken: string,
    user: Parameters<typeof login>[1]
  ) => {
    login(accessToken, user);
    navigate("/dashboard", { replace: true });
  };

  const handleEmailLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email: cleanEmail,
        password,
      });

      finishLogin(
        response.access_token,
        response.user
      );
    } catch (err: any) {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.detail;

      if (status === 401) {
        setError("Invalid email or password.");
      } else if (status === 404) {
        setError("Authentication service is not available.");
      } else if (status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          backendMessage ||
            "Unable to sign in. Please check your details."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useCallback(async (credential: string) => {
    setError("");

    try {
      setLoading(true);

      const response = await loginWithGoogle(
        credential
      );

      finishLogin(
        response.access_token,
        response.user
      );
    } catch (err: any) {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.detail;

      if (status === 503) {
        setError(
          "Google login is not configured on the backend yet."
        );
      } else if (status === 401) {
        setError("Google verification failed. Please try again.");
      } else {
        setError(
          backendMessage ||
            "Unable to sign in with Google. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  const handleSendOTP = async () => {
    setError("");

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      setLoading(true);

      await sendPhoneOTP(phone);
      setOtpSent(true);
      setOtp("");
    } catch (err: any) {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.detail;

      if (status === 503) {
        setError(
          "Phone OTP is not configured on the backend yet."
        );
      } else {
        setError(
          backendMessage ||
            "Unable to send OTP. Please check the phone number and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyPhoneOTP(
        phone,
        otp.trim()
      );

      finishLogin(
        response.access_token,
        response.user
      );
    } catch (err: any) {
      const status = err?.response?.status;
      const backendMessage = err?.response?.data?.detail;

      if (status === 401) {
        setError("Invalid or expired OTP.");
      } else if (status === 503) {
        setError(
          "Phone OTP is not configured on the backend yet."
        );
      } else {
        setError(
          backendMessage ||
            "Unable to verify OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden flex-col justify-between bg-primary p-12 text-white lg:flex">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-xl font-bold">
                V
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  VyaparAI
                </h1>

                <p className="text-sm text-white/70">
                  Business Operating System
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-lg">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck size={30} />
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Run your business smarter with AI.
            </h2>

            <p className="mt-5 text-lg leading-8 text-white/75">
              Manage inventory, billing, customers,
              suppliers and business insights from one
              intelligent platform.
            </p>
          </div>

          <p className="text-sm text-white/60">
            © 2026 VyaparAI
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-bold text-white">
                  V
                </div>

                <div>
                  <h1 className="text-xl font-bold text-primary">
                    VyaparAI
                  </h1>

                  <p className="text-xs text-text-secondary">
                    Business Operating System
                  </p>
                </div>

              </div>
            </div>

            <h1 className="text-3xl font-bold">
              Welcome back
            </h1>

            <p className="mt-2 text-text-secondary">
              Login to your VyaparAI account.
            </p>

            {/* LOGIN MODE */}
            <div className="mt-8 grid grid-cols-2 rounded-xl bg-surface-2 p-1">

              <button
                type="button"
                onClick={() => {
                  setMode("email");
                  setOtpSent(false);
                  setError("");
                }}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${
                  mode === "email"
                    ? "bg-surface text-primary shadow"
                    : "text-text-secondary"
                }`}
              >
                Email
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("phone");
                  setError("");
                }}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${
                  mode === "phone"
                    ? "bg-surface text-primary shadow"
                    : "text-text-secondary"
                }`}
              >
                Phone OTP
              </button>

            </div>

            {/* GOOGLE */}
            <GoogleLoginButton
              onSuccess={handleGoogleLogin}
              onError={setError}
            />

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs text-text-secondary">
                OR
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="mb-5 text-center text-sm text-text-secondary">
                Please wait...
              </div>
            )}

            {/* EMAIL LOGIN */}
            {mode === "email" && (
              <form
                onSubmit={handleEmailLogin}
                className="space-y-5"
              >

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/forgot-password")
                      }
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-11 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Login"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>

              </form>
            )}

            {/* PHONE OTP */}
            {mode === "phone" && (
              <form
                onSubmit={handleVerifyOTP}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError("");
                      }}
                      placeholder="+91 9876543210"
                      autoComplete="tel"
                      disabled={loading}
                      className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <p className="mt-2 text-xs text-text-secondary">
                    Use +country code, or a 10-digit Indian mobile number.
                  </p>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Enter OTP
                        </label>

                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={loading}
                          className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                        >
                          Resend OTP
                        </button>
                      </div>

                      <input
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="Enter OTP"
                        disabled={loading}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-center tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </>
                )}

              </form>
            )}

            {/* REGISTER */}
            <p className="mt-8 text-center text-sm text-text-secondary">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-primary hover:underline"
              >
                Create account
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
