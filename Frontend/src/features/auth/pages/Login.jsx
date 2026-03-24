// src/features/auth/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useTheme } from "../../Home/context/Theme.context";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();
  const { theme } = useTheme();

  const [formData, setFormData]       = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]         = useState("");

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
    if (res.success) navigate("/dashboard");
    if (res.needsVerification) navigate("/verify-notice");
  };

  const isLight = theme.isLight;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--app-bg)",
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.5s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        input::placeholder { color: ${isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.2)"}; }
        input:focus { outline: none; }
        button:focus { outline: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{
        background: isLight ? "#ffffff" : "#141414",
        border: `1px solid var(--app-border)`,
        borderRadius: 20,
        padding: "40px 36px",
        width: "100%",
        maxWidth: 420,
        boxShadow: isLight ? "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)" : "0 20px 60px rgba(0,0,0,0.5)",
        animation: "fadeUp 0.4s ease both",
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--app-accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isLight ? "#fff" : "#000", fontSize: 14, fontWeight: 800,
          }}>M</div>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--app-text)" }}>Moodify</span>
        </div>

        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 28, fontWeight: 400,
          color: "var(--app-text)",
          marginBottom: 6, letterSpacing: "-0.5px",
        }}>Welcome back</h1>
        <p style={{ fontSize: 14, color: "var(--app-subtext)", marginBottom: 28 }}>
          Sign in to continue to your account
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--app-text)" }}>Email address</label>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              border: `1.5px solid ${focused === "email" ? "var(--app-accent)" : "var(--app-border)"}`,
              borderRadius: 10, padding: "0 12px",
              background: focused === "email" ? (isLight ? "#fff" : "#1a1a1a") : "var(--app-surface)",
              transition: "all 0.2s",
              boxShadow: focused === "email" ? `0 0 0 3px ${theme.accent}20` : "none",
            }}>
              <span style={{ fontSize: 14, opacity: 0.4, color: "var(--app-text)" }}>✉</span>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                style={{ flex: 1, border: "none", background: "transparent", padding: "12px 0", fontSize: 14, color: "var(--app-text)", fontFamily: "'DM Sans', sans-serif" }}
                required autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--app-text)" }}>Password</label>
              <span style={{ fontSize: 12, color: "var(--app-accent)", cursor: "pointer", fontWeight: 500 }}>
                Forgot password?
              </span>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              border: `1.5px solid ${focused === "password" ? "var(--app-accent)" : "var(--app-border)"}`,
              borderRadius: 10, padding: "0 12px",
              background: focused === "password" ? (isLight ? "#fff" : "#1a1a1a") : "var(--app-surface)",
              transition: "all 0.2s",
              boxShadow: focused === "password" ? `0 0 0 3px ${theme.accent}20` : "none",
            }}>
              <span style={{ fontSize: 14, opacity: 0.4, color: "var(--app-text)" }}>🔒</span>
              <input
                type={showPassword ? "text" : "password"} name="password"
                placeholder="Enter your password"
                value={formData.password} onChange={handleChange}
                onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
                style={{ flex: 1, border: "none", background: "transparent", padding: "12px 0", fontSize: 14, color: "var(--app-text)", fontFamily: "'DM Sans', sans-serif" }}
                required autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 4, opacity: 0.5, color: "var(--app-text)" }}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#fef2f2", border: "1px solid #fee2e2",
              borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626",
            }}>
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              background: `linear-gradient(135deg, ${theme.accent}cc, ${theme.accent})`,
              color: isLight ? "#fff" : "#000",
              border: "none", borderRadius: 10, padding: "13px",
              fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 4, boxShadow: `0 4px 16px ${theme.accent}40`,
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

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--app-subtext)", marginTop: 20 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--app-accent)", fontWeight: 600, textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;