// src/features/auth/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useTheme } from "../../Home/context/Theme.context";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const { theme, isWhite } = useTheme();

  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]           = useState("");

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (res.success) navigate("/dashboard");
    if (res.needsVerification) navigate("/verify-notice");
  };

  // ── Theme-aware colors ──
  const pageBg      = theme.bg;
  const cardBg      = isWhite ? "#ffffff"              : "#141414";
  const cardBorder  = isWhite ? "rgba(0,0,0,0.08)"    : "rgba(255,255,255,0.08)";
  const cardShadow  = isWhite
    ? "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)"
    : "0 20px 60px rgba(0,0,0,0.5)";
  const textColor   = isWhite ? "#111827"              : "rgba(255,255,255,0.85)";
  const subText     = isWhite ? "#6b7280"              : "rgba(255,255,255,0.4)";
  const labelColor  = isWhite ? "#374151"              : "rgba(255,255,255,0.6)";
  const inputBg     = isWhite ? "#f9fafb"              : "rgba(255,255,255,0.04)";
  const inputBgFoc  = isWhite ? "#ffffff"              : "#1a1a1a";
  const inputBorder = isWhite ? "rgba(0,0,0,0.1)"     : "rgba(255,255,255,0.08)";
  const iconColor   = isWhite ? "rgba(0,0,0,0.35)"    : "rgba(255,255,255,0.35)";
  const btnTextColor = isWhite ? "#ffffff"             : "#000000";
  const logoTextColor = isWhite ? "#fff"               : "#000";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: pageBg,
      padding: "24px",
      fontFamily: "'Syne', sans-serif",
      transition: "background 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: ${isWhite ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)"}; }
        input:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>

      <div style={{
        background: cardBg, border: `1px solid ${cardBorder}`,
        borderRadius: 20, padding: "40px 36px",
        width: "100%", maxWidth: 420,
        boxShadow: cardShadow,
        animation: "fadeUp 0.4s ease both",
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: theme.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: logoTextColor, fontSize: 13, fontWeight: 800,
          }}>M</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: textColor, letterSpacing: "-0.3px" }}>
            Moodify <span style={{ color: subText, fontWeight: 400 }}>AI</span>
          </span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: textColor, marginBottom: 6, letterSpacing: "-0.5px" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: subText, marginBottom: 26 }}>
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: labelColor }}>Email address</label>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              border: `1.5px solid ${focused === "email" ? theme.accent : inputBorder}`,
              borderRadius: 10, padding: "0 12px",
              background: focused === "email" ? inputBgFoc : inputBg,
              boxShadow: focused === "email" ? `0 0 0 3px ${theme.accent}20` : "none",
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 13, color: iconColor, flexShrink: 0 }}>✉</span>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                style={{ flex: 1, border: "none", background: "transparent", padding: "11px 0", fontSize: 13, color: textColor, fontFamily: "'Syne', sans-serif" }}
                required autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: labelColor }}>Password</label>
              <span style={{ fontSize: 11, color: theme.accent, cursor: "pointer", fontWeight: 500 }}>
                Forgot password?
              </span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              border: `1.5px solid ${focused === "password" ? theme.accent : inputBorder}`,
              borderRadius: 10, padding: "0 12px",
              background: focused === "password" ? inputBgFoc : inputBg,
              boxShadow: focused === "password" ? `0 0 0 3px ${theme.accent}20` : "none",
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 13, color: iconColor, flexShrink: 0 }}>🔒</span>
              <input
                type={showPassword ? "text" : "password"} name="password"
                placeholder="Enter your password"
                value={formData.password} onChange={handleChange}
                onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                style={{ flex: 1, border: "none", background: "transparent", padding: "11px 0", fontSize: 13, color: textColor, fontFamily: "'Syne', sans-serif" }}
                required autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: iconColor, padding: 4 }}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10, padding: "10px 14px",
            }}>
              <span style={{ color: "#ef4444", fontSize: 13 }}>⚠ {error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              background: `linear-gradient(135deg, ${theme.accent}cc, ${theme.accent})`,
              color: btnTextColor,
              border: "none", borderRadius: 10, padding: "12px",
              fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Syne', sans-serif",
              opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 4,
              boxShadow: `0 4px 16px ${theme.accent}40`,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Signing in...
              </>
            ) : "Sign in"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: subText, marginTop: 20 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: theme.accent, fontWeight: 600, textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;