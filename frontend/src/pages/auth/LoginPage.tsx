import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  Globe,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

type LoginMode = "email" | "phone";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] =
    useState<LoginMode>("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      login(
        response.access_token,
        response.user
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        "Invalid email or password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setError("");

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    // Real SMS provider will be connected here.
    setOtpSent(true);
  };

  const handleVerifyOTP = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    // Real OTP verification will be connected
    // after the SMS backend is implemented.

    setError(
      "Phone OTP backend is not connected yet."
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-white">

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

            {/* Mobile Logo */}

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

            {/* Login Mode */}

            <div className="mt-8 grid grid-cols-2 rounded-xl bg-surface-2 p-1">

              <button
                type="button"
                onClick={() => {
                  setMode("email");
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

            <button
              type="button"
              onClick={() =>
                setError(
                  "Google login will be connected after OAuth setup."
                )
              }
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface py-3 font-medium transition hover:bg-surface-2"
            >
              <Globe size={19} />
              Continue with Google
            </button>

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

            {/* EMAIL */}

            {mode === "email" && (
              <form
                onSubmit={handleEmailLogin}
                className="space-y-5"
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
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>

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
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-11 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
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
                  {loading
                    ? "Signing in..."
                    : "Sign in"}

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
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder="+91 9876543210"
                      className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white hover:bg-primary-dark"
                  >
                    Send OTP
                  </button>
                ) : (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Enter OTP
                      </label>

                      <input
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value)
                        }
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="6-digit OTP"
                        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-center tracking-[0.5em] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white hover:bg-primary-dark"
                    >
                      Verify OTP
                    </button>
                  </>
                )}

              </form>
            )}

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