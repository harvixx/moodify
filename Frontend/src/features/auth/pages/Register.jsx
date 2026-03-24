// src/features/auth/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { useTheme } from "../../Home/context/Theme.context";

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter",  test: (p) => /[A-Z]/.test(p) },
  { label: "One number",            test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (password) => {
  const passed = passwordRules.filter(r => r.test(password)).length;
  if (passed <= 1) return { level: passed, label: passed === 0 ? "" : "Weak",   barColor: "#ef4444", textColor: "#ef4444" };
  if (passed === 2) return { level: 2,      label: "Fair",   barColor: "#f97316", textColor: "#f97316" };
  if (passed === 3) return { level: 3,      label: "Good",   barColor: "#eab308", textColor: "#ca8a04" };
  return               { level: 4,      label: "Strong", barColor: "#22c55e", textColor: "#16a34a" };
};

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();
  const { theme, isWhite } = useTheme();

  const [formData, setFormData]           = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword]   = useState(false);
  const [touched, setTouched]             = useState({});
  const [passwordFocused, setPasswordFocused] = useState(false);

  const strength = getStrength(formData.password);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleBlur = (name) =>
    setTouched(prev => ({ ...prev, [name]: true }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    const res = await register(formData);
    if (res.success) navigate("/verify-notice", { state: { email: formData.email } });
  };

  const emailError = touched.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ? "Enter a valid email address" : "";
  const isGmailTypo = touched.email && formData.email.includes("@gamil.com");
  const fixedEmail  = isGmailTypo ? formData.email.replace("@gamil.com", "@gmail.com") : "";

  // ── Theme-aware colors ──
  const pageBg       = theme.bg;
  const cardBg       = isWhite ? "#ffffff"              : "#141414";
  const cardBorder   = isWhite ? "rgba(0,0,0,0.08)"    : "rgba(255,255,255,0.08)";
  const cardShadow   = isWhite ? "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)" : "0 20px 60px rgba(0,0,0,0.5)";
  const textColor    = isWhite ? "#111827"              : "rgba(255,255,255,0.85)";
  const subText      = isWhite ? "#6b7280"              : "rgba(255,255,255,0.4)";
  const labelColor   = isWhite ? "#374151"              : "rgba(255,255,255,0.6)";
  const inputBg      = isWhite ? "#f9fafb"              : "rgba(255,255,255,0.04)";
  const inputBgFoc   = isWhite ? "#ffffff"              : "#1a1a1a";
  const inputBorder  = isWhite ? "rgba(0,0,0,0.1)"     : "rgba(255,255,255,0.08)";
  const iconColor    = isWhite ? "rgba(0,0,0,0.35)"    : "rgba(255,255,255,0.35)";
  const trackBg      = isWhite ? "rgba(0,0,0,0.07)"    : "rgba(255,255,255,0.07)";
  const rulePassText = isWhite ? "#374151"              : "rgba(255,255,255,0.7)";
  const ruleFailText = isWhite ? "#9ca3af"              : "rgba(255,255,255,0.25)";
  const btnTextColor = isWhite ? "#ffffff"              : "#000000";
  const logoTextColor = isWhite ? "#fff"                : "#000";

  const inputStyle = (fieldName, hasError = false) => ({
    display: "flex", alignItems: "center", gap: 10,
    border: `1.5px solid ${hasError ? "#ef4444" : (inputBorder)}`,
    borderRadius: 10, padding: "0 12px",
    background: inputBg,
    transition: "all 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: pageBg, padding: "24px 24px 48px",
      fontFamily: "'Syne', sans-serif",
      transition: "background 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
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
            width: 32, height: 32, borderRadius: 8, background: theme.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: logoTextColor, fontSize: 13, fontWeight: 800,
          }}>M</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: textColor, letterSpacing: "-0.3px" }}>
            Moodify <span style={{ color: subText, fontWeight: 400 }}>AI</span>
          </span>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: textColor, marginBottom: 6, letterSpacing: "-0.5px" }}>
          Create your account
        </h1>
        <p style={{ fontSize: 13, color: subText, marginBottom: 26 }}>
          Free forever — no credit card needed
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>

          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: labelColor }}>Full name</label>
            <div style={inputStyle("name")}>
              <span style={{ fontSize: 13, color: iconColor }}>👤</span>
              <input
                type="text" name="name" placeholder="Rahul Sharma"
                value={formData.name} onChange={handleChange} onBlur={() => handleBlur("name")}
                style={{ flex: 1, border: "none", background: "transparent", padding: "11px 0", fontSize: 13, color: textColor, fontFamily: "'Syne', sans-serif" }}
                autoComplete="name"
              />
              {touched.name && formData.name.trim() && (
                <span style={{ color: "#22c55e", fontSize: 14, fontWeight: 700 }}>✓</span>
              )}
            </div>
            {touched.name && !formData.name.trim() && (
              <p style={{ fontSize: 11, color: "#ef4444", animation: "slideDown 0.2s ease" }}>Name is required</p>
            )}
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: labelColor }}>Email address</label>
            <div style={inputStyle("email", !!emailError)}>
              <span style={{ fontSize: 13, color: iconColor }}>✉</span>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} onBlur={() => handleBlur("email")}
                style={{ flex: 1, border: "none", background: "transparent", padding: "11px 0", fontSize: 13, color: textColor, fontFamily: "'Syne', sans-serif" }}
                autoComplete="email"
              />
              {touched.email && !emailError && formData.email && (
                <span style={{ color: "#22c55e", fontSize: 14, fontWeight: 700 }}>✓</span>
              )}
            </div>
            {emailError && (
              <p style={{ fontSize: 11, color: "#ef4444", animation: "slideDown 0.2s ease" }}>{emailError}</p>
            )}
            {/* Typo hint */}
            {isGmailTypo && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: isWhite ? "#eff6ff" : "rgba(59,130,246,0.1)",
                border: `1px solid ${isWhite ? "#bfdbfe" : "rgba(59,130,246,0.2)"}`,
                borderRadius: 8, padding: "8px 12px",
                animation: "slideDown 0.2s ease",
              }}>
                <span style={{ fontSize: 12, color: isWhite ? "#1d4ed8" : "#60a5fa" }}>
                  Did you mean{" "}
                  <strong style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => setFormData(p => ({ ...p, email: fixedEmail }))}>
                    {fixedEmail}
                  </strong>
                  ?
                </span>
              </div>
            )}
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: labelColor }}>Password</label>
            <div style={inputStyle("password")}>
              <span style={{ fontSize: 13, color: iconColor }}>🔒</span>
              <input
                type={showPassword ? "text" : "password"} name="password"
                placeholder="Create a strong password"
                value={formData.password} onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => { setPasswordFocused(false); handleBlur("password"); }}
                style={{ flex: 1, border: "none", background: "transparent", padding: "11px 0", fontSize: 13, color: textColor, fontFamily: "'Syne', sans-serif" }}
                autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(p => !p)} tabIndex={-1}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: iconColor, padding: 4 }}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Strength bar */}
            {formData.password && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <div style={{ display: "flex", gap: 4, flex: 1 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      height: 3, flex: 1, borderRadius: 99,
                      background: i <= strength.level ? strength.barColor : trackBg,
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
                {strength.label && (
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: strength.textColor, minWidth: 40, textAlign: "right" }}>
                    {strength.label}
                  </span>
                )}
              </div>
            )}

            {/* Rules checklist */}
            {(passwordFocused || touched.password) && formData.password && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", marginTop: 6, animation: "slideDown 0.2s ease" }}>
                {passwordRules.map(rule => {
                  const pass = rule.test(formData.password);
                  return (
                    <div key={rule.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 11, color: pass ? "#22c55e" : (isWhite ? "#d1d5db" : "rgba(255,255,255,0.2)") }}>
                        {pass ? "✓" : "○"}
                      </span>
                      <span style={{ fontSize: 11, color: pass ? rulePassText : ruleFailText, textDecoration: pass ? "line-through" : "none" }}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Server error */}
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
          <button type="submit" disabled={loading}
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
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Creating account...
              </>
            ) : "Create account →"}
          </button>

          <p style={{ textAlign: "center", fontSize: 11, color: isWhite ? "#9ca3af" : "rgba(255,255,255,0.2)", marginTop: 4 }}>
            By signing up you agree to our{" "}
            <span style={{ color: theme.accent, cursor: "pointer" }}>Terms</span> &{" "}
            <span style={{ color: theme.accent, cursor: "pointer" }}>Privacy Policy</span>
          </p>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: subText, marginTop: 20 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: theme.accent, fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;