import { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import Divider from "../common/Divider";
import { GRADS } from "../../theme";
import { loginUser, registerUser, verifyEmail, resendOtp } from "../../api/authApi";

export default function AuthPage({ onLogin }) {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    otp: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const set = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  const resetMessages = () => {
    setErr("");
    setSuccessMsg("");
  };

  const resetSignupState = () => {
    setStep(1);
    setOtpSent(false);
    setErr("");
    setSuccessMsg("");
    setForm((prev) => ({
      ...prev,
      otp: "",
    }));
  };

  const doLogin = async () => {
    try {
      resetMessages();

      if (!form.email || !form.password) {
        setErr("Please enter email and password");
        return;
      }

      setLoading(true);

      const data = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      localStorage.setItem("zyphor_refresh_token", data.refreshToken);
      await onLogin(data.accessToken);
    } catch (error) {
      setErr(error?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const doSignupStep1 = async () => {
    try {
      resetMessages();

      if (!form.username || !form.email || !form.password || !form.confirm) {
        setErr("Please fill all required fields");
        return;
      }

      if (form.password !== form.confirm) {
        setErr("Passwords do not match");
        return;
      }

      setLoading(true);

      await registerUser({
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phone?.trim() || "",
        password: form.password,
      });

      setStep(2);
      setOtpSent(true);
      setSuccessMsg(`OTP sent to ${form.email.trim().toLowerCase()}`);
    } catch (error) {
      setErr(error?.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const doVerifyOtpAndLogin = async () => {
    try {
      resetMessages();

      if (!form.otp) {
        setErr("Please enter OTP");
        return;
      }

      setLoading(true);

      await verifyEmail({
        email: form.email.trim().toLowerCase(),
        otp: form.otp.trim(),
      });

      const loginData = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      localStorage.setItem("zyphor_refresh_token", loginData.refreshToken);
      await onLogin(loginData.accessToken);
    } catch (error) {
      setErr(error?.response?.data || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const doSignup = async () => {
    if (step === 1) {
      await doSignupStep1();
    } else {
      await doVerifyOtpAndLogin();
    }
  };

  const handleResendOtp = async () => {
    try {
      resetMessages();

      if (!form.email) {
        setErr("Email is required");
        return;
      }

      setLoading(true);

      await resendOtp({
        email: form.email.trim().toLowerCase(),
      });

      setOtpSent(true);
      setSuccessMsg(`OTP resent to ${form.email.trim().toLowerCase()}`);
    } catch (error) {
      setErr(error?.response?.data || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const doForgot = () => {
    setErr("Forgot password flow is not connected in this page yet");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070707]">
      <div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden border-r border-zinc-900 bg-zinc-950 px-16 lg:flex">
        <div className="absolute left-[10%] top-[10%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.025)_0%,transparent_70%)]" />
        <div className="absolute bottom-[15%] right-[8%] h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.015)_0%,transparent_70%)]" />

        <div className="relative z-10 max-w-[380px]">
          <div className="mb-6 text-[52px] font-black leading-none tracking-[-0.07em] text-zinc-100">
            ZYPHOR
          </div>

          <div className="mb-10 font-serif text-sm italic leading-7 text-zinc-400">
            "a space where silence speaks louder than noise — share what matters, connect with those who feel it."
          </div>

          <div className="flex flex-col gap-4">
            {[
              ["Share photos & stories"],
              ["Real-time messaging"],
              ["Smart notifications"],
              ["Explore the community"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-[13px] text-zinc-600">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-4 gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md opacity-60"
                style={{ background: GRADS[i % GRADS.length] }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col items-center justify-center overflow-y-auto px-8 lg:w-[480px] lg:px-12">
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <div className="text-[26px] font-extrabold tracking-[-0.04em] text-zinc-100">
              {view === "login"
                ? "welcome back"
                : view === "forgot"
                  ? "reset password"
                  : "create account"}
            </div>

            <div className="mt-1.5 text-[13px] text-zinc-400">
              {view === "login"
                ? "sign in to continue"
                : view === "forgot"
                  ? "we'll get you back in"
                  : step === 1
                    ? "step 1 of 2 — credentials"
                    : "step 2 of 2 — verify email"}
            </div>
          </div>

          {view === "signup" && (
            <div className="mb-7 flex gap-1.5">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-[3px] flex-1 rounded ${step >= s ? "bg-zinc-100" : "bg-zinc-800"
                    }`}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3.5">
            {view === "login" && (
              <>
                <Input
                  label="EMAIL ADDRESS"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  autoFocus
                />

                <Input
                  label="PASSWORD"
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                />

                {err && (
                  <div className="rounded-md border border-red-950 bg-red-950/30 px-3 py-2 text-xs text-red-400">
                    {err}
                  </div>
                )}

                <Button onClick={doLogin} v="primary" full>
                  {loading ? "authenticating..." : "SIGN IN"}
                </Button>

                <Divider text="OR" />

                <Button
                  onClick={() => {
                    setView("signup");
                    resetSignupState();
                  }}
                  v="outline"
                  full
                >
                  CREATE ACCOUNT
                </Button>

                <button
                  onClick={() => {
                    setView("forgot");
                    resetMessages();
                  }}
                  className="mt-1 text-center text-xs text-zinc-500 hover:text-zinc-100"
                >
                  forgot password?
                </button>
              </>
            )}

            {view === "signup" && (
              <>
                {step === 1 && (
                  <>
                    <Input
                      label="USERNAME"
                      value={form.username}
                      onChange={set("username")}
                      placeholder="your.handle"
                      autoFocus
                    />

                    <Input
                      label="EMAIL ADDRESS"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@example.com"
                    />

                    <Input
                      label="PHONE NUMBER (optional)"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="+91 9876543210"
                    />

                    <Input
                      label="PASSWORD"
                      type="password"
                      value={form.password}
                      onChange={set("password")}
                      placeholder="min 8 characters"
                    />

                    <Input
                      label="CONFIRM PASSWORD"
                      type="password"
                      value={form.confirm}
                      onChange={set("confirm")}
                      placeholder="repeat password"
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-xs leading-6 text-zinc-400">
                      A 6-digit verification code has been sent to your email address.
                    </div>

                    {otpSent && (
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <Check size={14} />
                        {successMsg || `OTP sent to ${form.email}`}
                      </div>
                    )}

                    <Input
                      label="VERIFICATION CODE"
                      value={form.otp}
                      onChange={set("otp")}
                      placeholder="000000"
                      autoFocus
                    />

                    <button
                      onClick={handleResendOtp}
                      className="text-left text-xs text-zinc-500 hover:text-zinc-100"
                    >
                      resend OTP
                    </button>
                  </>
                )}

                {err && (
                  <div className="rounded-md border border-red-950 bg-red-950/30 px-3 py-2 text-xs text-red-400">
                    {err}
                  </div>
                )}

                <div className="flex gap-2.5">
                  {step > 1 ? (
                    <Button
                      onClick={() => {
                        setStep(1);
                        setErr("");
                        setSuccessMsg("");
                      }}
                      v="outline"
                      style={{ flex: 1 }}
                    >
                      ← BACK
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setView("login");
                        resetMessages();
                      }}
                      v="ghost"
                      style={{ flex: 1 }}
                    >
                      SIGN IN
                    </Button>
                  )}

                  <Button onClick={doSignup} v="primary" style={{ flex: 2 }}>
                    {loading
                      ? "please wait..."
                      : step === 1
                        ? "CONTINUE →"
                        : "VERIFY & LOGIN"}
                  </Button>
                </div>
              </>
            )}

            {view === "forgot" && (
              <>
                <button
                  onClick={() => {
                    setView("login");
                    resetMessages();
                  }}
                  className="flex items-center gap-2 py-1 text-left text-xs text-zinc-400 hover:text-zinc-100"
                >
                  <ArrowLeft size={14} />
                  back to sign in
                </button>

                <Input
                  label="EMAIL ADDRESS"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  autoFocus
                />

                {err && (
                  <div className="text-xs text-red-400">
                    {err}
                  </div>
                )}

                <Button onClick={doForgot} v="primary" full>
                  SEND RESET CODE
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}