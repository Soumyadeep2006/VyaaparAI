import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { forgotPassword } from "../../api/auth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword(
        email.trim()
      );

      // Testing version:
      // Backend returns the reset token directly.
      if (response.token) {
        navigate(
          `/reset-password?token=${encodeURIComponent(
            response.token
          )}`
        );
        return;
      }

      setMessage(
        response.message ||
          "If an account exists with this email, a password reset link has been generated."
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center gap-2 text-sm text-text-secondary hover:text-primary"
        >
          <ArrowLeft size={18} />
          Back to login
        </button>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Mail
              className="text-primary"
              size={28}
            />
          </div>

          <h1 className="text-3xl font-bold">
            Forgot password?
          </h1>

          <p className="mt-2 text-text-secondary">
            Enter your registered email address and
            we'll help you reset your password.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
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
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Checking..."
                : "Continue"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}