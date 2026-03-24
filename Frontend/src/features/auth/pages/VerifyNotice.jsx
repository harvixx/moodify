// src/features/auth/pages/VerifyNotice.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useVerifyNotice } from "../hooks/useVerifyNotice";

const VerifyNotice = () => {
  const { email, resendEmail, loading, message } = useVerifyNotice();
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (email) setNewEmail(email);
  }, [email]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = async () => {
    await resendEmail(newEmail);
    setEmailSent(true);
    setEditingEmail(false);
    setCountdown(30);
  };

  const displayEmail = newEmail || email || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/80 p-8 text-center">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
            ✦
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">Yourapp</span>
        </div>

        {/* Envelope illustration */}
        <div className="flex justify-center mb-6">
          <div className="relative animate-bounce">
            <div className="w-16 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex flex-col justify-end p-2 shadow-lg shadow-indigo-200 relative overflow-hidden">
              {/* flap */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-white/20"
                style={{ clipPath: "polygon(0 0, 50% 70%, 100% 0)" }} />
              <div className="w-full h-0.5 bg-white/60 rounded-full mb-1" />
              <div className="w-3/5 h-0.5 bg-white/60 rounded-full" />
            </div>
            <span className="absolute -top-2 -right-2 text-yellow-400 text-xs animate-pulse">✦</span>
            <span className="absolute -bottom-1 -left-2 text-indigo-400 text-xs animate-pulse">✦</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Check your inbox</h1>
        <p className="text-sm text-gray-500 mb-4">We sent a verification link to:</p>

        {/* Email display / edit */}
        {editingEmail ? (
          <div className="text-left mb-5 space-y-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border border-indigo-400 ring-2 ring-indigo-500/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none"
              placeholder="Enter correct email"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingEmail(false)}
                className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResend}
                disabled={loading || !newEmail}
                className="flex-2 flex-grow-[2] bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold py-2 px-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Sending..." : "Send to this email"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
            <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              {displayEmail || "No email found"}
            </span>
            <button
              onClick={() => setEditingEmail(true)}
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              ✏ Wrong email?
            </button>
          </div>
        )}

        {/* Steps */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5 text-left space-y-3">
          {[
            { icon: "📨", text: "Open the email we sent you" },
            { icon: "🔗", text: "Click the verification link" },
            { icon: "🎉", text: "You'll be redirected to dashboard" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-base">{s.icon}</span>
              <span className="text-sm text-gray-600">{s.text}</span>
            </div>
          ))}
        </div>

        {/* Success message */}
        {(emailSent || message) && (
          <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm font-medium rounded-xl px-4 py-2.5 mb-4">
            <span>✓</span>
            <span>{message || "Verification email sent!"}</span>
          </div>
        )}

        {/* Resend */}
        {!editingEmail && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm text-gray-400">Didn't receive it?</span>
            {countdown > 0 ? (
              <span className="text-sm text-gray-400 font-medium">Resend in {countdown}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-indigo-600 font-semibold hover:underline disabled:opacity-50"
              >
                {loading ? "Sending..." : "Resend email"}
              </button>
            )}
          </div>
        )}

        {/* Spam tip */}
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-left mb-5">
          <span className="text-sm">💡</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            Can't find it? Check your <strong>spam</strong> or <strong>promotions</strong> folder.
          </p>
        </div>

        {/* Back to register */}
        <p className="text-xs text-gray-400">
          Made a mistake?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Go back & re-register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default VerifyNotice;
