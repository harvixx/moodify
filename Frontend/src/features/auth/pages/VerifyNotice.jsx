// src/features/auth/pages/VerifyNotice.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useVerifyNotice } from "../hooks/useVerifyNotice";
import { useTheme } from "../../Home/context/Theme.context";

const VerifyNotice = () => {
  const { email, resendEmail, loading, message } = useVerifyNotice();
  const { theme, isWhite } = useTheme();

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail]         = useState("");
  const [countdown, setCountdown]       = useState(0);
  const [emailSent, setEmailSent]       = useState(false);

  useEffect(() => { if (email) setNewEmail(email); }, [email]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = async () => {
    await resendEmail(newEmail);
    setEmailSent(true);
    setEditingEmail(false);
    setCountdown(30);
  };

  const displayEmail = newEmail || email || "";

  // ── Theme-aware ──
  const pageBg        = theme.bg;
  const cardBg        = isWhite ? "#ffffff"              : "#141414";
  const cardBorder    = isWhite ? "rgba(0,0,0,0.08)"    : "rgba(255,255,255,0.08)";
  const cardShadow    = isWhite ? "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)" : "0 20px 60px rgba(0,0,0,0.5)";
  const textColor     = isWhite ? "#111827"              : "rgba(255,255,255,0.85)";
  const subText       = isWhite ? "#6b7280"              : "rgba(255,255,255,0.4)";
  const labelColor    = isWhite ? "#374151"              : "rgba(255,255,255,0.6)";
  const logoTextColor = isWhite ? "#fff"                 : "#000";

  // Chip
  const chipBg        = isWhite ? "#eef2ff"              : `${theme.accent}15`;
  const chipBorder    = isWhite ? "#c7d2fe"              : `${theme.accent}30`;
  const chipText      = isWhite ? "#4f46e5"              : theme.accent;

  // Steps box
  const stepsBg       = isWhite ? "#f9fafb"              : "rgba(255,255,255,0.03)";
  const stepsBorder   = isWhite ? "rgba(0,0,0,0.06)"    : "rgba(255,255,255,0.06)";
  const stepsText     = isWhite ? "#374151"              : "rgba(255,255,255,0.6)";

  // Input
  const inputBg       = isWhite ? "#f9fafb"              : "rgba(255,255,255,0.04)";
  const inputBorder   = isWhite ? "rgba(0,0,0,0.1)"     : "rgba(255,255,255,0.08)";
  const inputText     = isWhite ? "#111827"              : "rgba(255,255,255,0.85)";

  // Tip box
  const tipBg         = isWhite ? "#fffbeb"              : "rgba(251,191,36,0.08)";
  const tipBorder     = isWhite ? "#fde68a"              : "rgba(251,191,36,0.15)";
  const tipText       = isWhite ? "#92400e"              : "rgba(251,191,36,0.8)";

  // Buttons
  const cancelBg      = isWhite ? "#ffffff"              : "transparent";
  const cancelBorder  = isWhite ? "rgba(0,0,0,0.1)"     : "rgba(255,255,255,0.1)";
  const cancelText    = isWhite ? "#374151"              : "rgba(255,255,255,0.5)";

  const resendColor   = isWhite ? "#4f46e5"              : theme.accent;
  const mutedText     = isWhite ? "#9ca3af"              : "rgba(255,255,255,0.25)";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: pageBg, padding: "24px",
      fontFamily: "'Syne', sans-serif",
      transition: "background 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        input::placeholder { color: ${isWhite ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)"}; }
        input:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>

      <div style={{
        background: cardBg, border: `1px solid ${cardBorder}`,
        borderRadius: 20, padding: "40px 36px",
        width: "100%", maxWidth: 420,
        boxShadow: cardShadow, textAlign: "center",
        animation: "fadeUp 0.4s ease both",
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: theme.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: logoTextColor, fontSize: 13, fontWeight: 800,
          }}>M</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: textColor }}>
            Moodify <span style={{ color: subText, fontWeight: 400 }}>AI</span>
          </span>
        </div>

        {/* Envelope */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", animation: "float 3s ease-in-out infinite" }}>
            <div style={{
              width: 64, height: 48, borderRadius: 10,
              background: `linear-gradient(135deg, ${theme.accent}cc, ${theme.accent})`,
              position: "relative", display: "flex", flexDirection: "column",
              justifyContent: "flex-end", padding: 8, overflow: "hidden",
              boxShadow: `0 8px 24px ${theme.accent}40`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 24, background: "rgba(255,255,255,0.2)", clipPath: "polygon(0 0, 50% 70%, 100% 0)" }} />
              <div style={{ height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 99, marginBottom: 4 }} />
              <div style={{ height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 99, width: "60%" }} />
            </div>
            <span style={{ position: "absolute", top: -8, right: -10, fontSize: 10, color: "#f59e0b", animation: "pulse 2s ease infinite" }}>✦</span>
            <span style={{ position: "absolute", bottom: -4, left: -10, fontSize: 8, color: theme.accent, animation: "pulse 2s ease infinite 0.5s" }}>✦</span>
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: textColor, marginBottom: 8, letterSpacing: "-0.5px" }}>
          Check your inbox
        </h1>
        <p style={{ fontSize: 13, color: subText, marginBottom: 14 }}>
          We sent a verification link to:
        </p>

        {/* Email chip / edit */}
        {editingEmail ? (
          <div style={{ textAlign: "left", marginBottom: 20 }}>
            <input
              type="email" value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="Enter correct email" autoFocus
              style={{
                width: "100%", border: `1.5px solid ${theme.accent}`,
                borderRadius: 10, padding: "10px 14px", fontSize: 13,
                fontFamily: "'Syne', sans-serif", color: inputText,
                background: inputBg, boxSizing: "border-box",
                boxShadow: `0 0 0 3px ${theme.accent}20`, marginBottom: 8,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEditingEmail(false)}
                style={{ flex: 1, border: `1px solid ${cancelBorder}`, background: cancelBg, borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 500, cursor: "pointer", color: cancelText, fontFamily: "'Syne', sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleResend} disabled={loading || !newEmail}
                style={{ flex: 2, background: `linear-gradient(135deg, ${theme.accent}cc, ${theme.accent})`, color: isWhite ? "#fff" : "#000", border: "none", borderRadius: 8, padding: "9px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif", opacity: (loading || !newEmail) ? 0.6 : 1 }}>
                {loading ? "Sending..." : "Send to this email"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: chipBg, border: `1px solid ${chipBorder}`, color: chipText, fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 99 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: chipText, animation: "pulse 2s ease infinite", flexShrink: 0 }} />
              {displayEmail || "No email found"}
            </span>
            <button onClick={() => setEditingEmail(true)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: mutedText, textDecoration: "underline", fontFamily: "'Syne', sans-serif" }}>
              ✏ Wrong email?
            </button>
          </div>
        )}

        {/* Steps */}
        <div style={{ background: stepsBg, border: `1px solid ${stepsBorder}`, borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
          {[
            { icon: "📨", text: "Open the email we sent you" },
            { icon: "🔗", text: "Click the verification link" },
            { icon: "🎉", text: "You'll be redirected to dashboard" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span style={{ fontSize: 13, color: stepsText }}>{s.text}</span>
            </div>
          ))}
        </div>

        {/* Success */}
        {(emailSent || message) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#22c55e", fontWeight: 500, marginBottom: 14 }}>
            <span>✓</span><span>{message || "Verification email sent!"}</span>
          </div>
        )}

        {/* Resend */}
        {!editingEmail && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: mutedText }}>Didn't receive it?</span>
            {countdown > 0 ? (
              <span style={{ fontSize: 13, color: mutedText, fontWeight: 500 }}>Resend in {countdown}s</span>
            ) : (
              <button onClick={handleResend} disabled={loading}
                style={{ background: "none", border: "none", cursor: "pointer", color: resendColor, fontWeight: 600, fontSize: 13, textDecoration: "underline", fontFamily: "'Syne', sans-serif", opacity: loading ? 0.5 : 1 }}>
                {loading ? "Sending..." : "Resend email"}
              </button>
            )}
          </div>
        )}

        {/* Spam tip */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: tipBg, border: `1px solid ${tipBorder}`, borderRadius: 10, padding: "10px 14px", textAlign: "left", marginBottom: 16 }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: 12, color: tipText, lineHeight: 1.5, margin: 0 }}>
            Can't find it? Check your <strong>spam</strong> or <strong>promotions</strong> folder.
          </p>
        </div>

        {/* Back */}
        <p style={{ fontSize: 12, color: mutedText }}>
          Made a mistake?{" "}
          <Link to="/register" style={{ color: theme.accent, fontWeight: 600, textDecoration: "none" }}>
            Go back & re-register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyNotice;