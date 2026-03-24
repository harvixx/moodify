// src/features/auth/pages/verify.jsx
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useVerify } from "../hooks/useVerify";
import { useAuth } from "../context/Auth.context";
import { useTheme } from "../../Home/context/Theme.context";

const VerifyEmail = () => {
  const { token }   = useParams();
  const navigate    = useNavigate();
  const { verifyEmail, status } = useVerify();
  const { fetchUser } = useAuth();
  const { theme, isWhite } = useTheme();

  useEffect(() => {
    const run = async () => {
      const success = await verifyEmail(token);
      if (success) {
        const user = await fetchUser(true);
        if (user) navigate("/dashboard", { replace: true });
      }
    };
    if (token) run();
  }, [token]);

  // ── Theme-aware ──
  const pageBg      = theme.bg;
  const cardBg      = isWhite ? "#ffffff"              : "#141414";
  const cardBorder  = isWhite ? "rgba(0,0,0,0.08)"    : "rgba(255,255,255,0.08)";
  const cardShadow  = isWhite ? "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)" : "0 20px 60px rgba(0,0,0,0.5)";
  const textColor   = isWhite ? "#111827"              : "rgba(255,255,255,0.85)";
  const subText     = isWhite ? "#6b7280"              : "rgba(255,255,255,0.4)";
  const logoTextColor = isWhite ? "#fff"               : "#000";
  const spinnerBorder = isWhite ? "rgba(0,0,0,0.1)"   : "rgba(255,255,255,0.1)";

  const pillBg     = isWhite ? "#eef2ff"              : "rgba(99,102,241,0.1)";
  const pillBorder = isWhite ? "#c7d2fe"              : "rgba(99,102,241,0.2)";
  const pillText   = isWhite ? "#4f46e5"              : "#818cf8";

  const ghostBg     = isWhite ? "#f9fafb"             : "transparent";
  const ghostBorder = isWhite ? "rgba(0,0,0,0.1)"    : "rgba(255,255,255,0.1)";
  const ghostText   = isWhite ? "#374151"             : "rgba(255,255,255,0.5)";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: pageBg, padding: "24px",
      fontFamily: "'Syne', sans-serif",
      transition: "background 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { 0% { opacity:0; transform:scale(0.5); } 70% { transform:scale(1.1); } 100% { opacity:1; transform:scale(1); } }
      `}</style>

      <div style={{
        background: cardBg, border: `1px solid ${cardBorder}`,
        borderRadius: 20, padding: "40px 36px",
        width: "100%", maxWidth: 380,
        boxShadow: cardShadow, textAlign: "center",
        animation: "fadeUp 0.4s ease both",
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: theme.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: logoTextColor, fontSize: 13, fontWeight: 800,
          }}>M</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: textColor }}>
            Moodify <span style={{ color: subText, fontWeight: 400 }}>AI</span>
          </span>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, border: `3px solid ${spinnerBorder}`, borderTopColor: theme.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: textColor, margin: 0 }}>Verifying your email...</h2>
            <p style={{ fontSize: 13, color: subText, margin: 0 }}>This will only take a second.</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
              animation: "popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both",
            }}>
              <span style={{ color: "#fff", fontSize: 28, fontWeight: 700 }}>✓</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#16a34a", margin: 0 }}>Email Verified!</h2>
            <p style={{ fontSize: 13, color: subText, margin: 0 }}>Redirecting you to dashboard...</p>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: pillBg, border: `1px solid ${pillBorder}`,
              borderRadius: 99, padding: "8px 16px",
            }}>
              <span style={{ width: 14, height: 14, border: `2px solid ${pillBorder}`, borderTopColor: pillText, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              <span style={{ fontSize: 13, color: pillText, fontWeight: 500 }}>Taking you in...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(239,68,68,0.3)",
              animation: "popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both",
            }}>
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>✕</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#dc2626", margin: 0 }}>Verification Failed</h2>
            <p style={{ fontSize: 13, color: subText, lineHeight: 1.6, margin: 0 }}>
              This link has expired or is invalid. Links are valid for <strong>1 hour</strong> only.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 4 }}>
              <Link to="/verify-notice" style={{
                background: `linear-gradient(135deg, ${theme.accent}cc, ${theme.accent})`,
                color: isWhite ? "#fff" : "#000",
                borderRadius: 10, padding: "12px",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                display: "block", boxShadow: `0 4px 16px ${theme.accent}40`,
              }}>
                Request a new link
              </Link>
              <Link to="/login" style={{
                background: ghostBg,
                border: `1px solid ${ghostBorder}`,
                color: ghostText,
                borderRadius: 10, padding: "12px",
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                display: "block",
              }}>
                Back to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;