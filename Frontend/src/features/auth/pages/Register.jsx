// src/features/auth/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

const passwordRules = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (password) => {
  const passed = passwordRules.filter((r) => r.test(password)).length;
  if (passed <= 1) return { level: passed, label: passed === 0 ? "" : "Weak", color: "bg-red-400", text: "text-red-500" };
  if (passed === 2) return { level: 2, label: "Fair", color: "bg-orange-400", text: "text-orange-500" };
  if (passed === 3) return { level: 3, label: "Good", color: "bg-yellow-400", text: "text-yellow-600" };
  return { level: 4, label: "Strong", color: "bg-green-500", text: "text-green-600" };
};

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [passwordFocused, setPasswordFocused] = useState(false);

  const strength = getStrength(formData.password);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (name) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    const res = await register(formData);
    if (res.success) navigate("/verify-notice", { state: { email: formData.email } });
  };

  const emailError = touched.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ? "Enter a valid email address" : "";

  const isGmailTypo = touched.email && formData.email.includes("@gamil.com");
  const fixedEmail = isGmailTypo ? formData.email.replace("@gamil.com", "@gmail.com") : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/80 p-8">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
            ✦
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">Yourapp</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Create your account</h1>
        <p className="text-sm text-gray-500 mb-7">Free forever — no credit card needed</p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 bg-gray-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white transition-all">
              <span className="text-gray-400 text-sm">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                className="flex-1 py-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                autoComplete="name"
              />
              {touched.name && formData.name.trim() && (
                <span className="text-green-500 text-sm font-bold">✓</span>
              )}
            </div>
            {touched.name && !formData.name.trim() && (
              <p className="text-xs text-red-500">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <div className={`flex items-center gap-2.5 border rounded-xl px-3.5 bg-gray-50 focus-within:ring-2 transition-all focus-within:bg-white ${emailError ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-500/10" : "border-gray-200 focus-within:border-indigo-500 focus-within:ring-indigo-500/10"}`}>
              <span className="text-gray-400 text-sm">✉</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className="flex-1 py-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                autoComplete="email"
              />
              {touched.email && !emailError && formData.email && (
                <span className="text-green-500 text-sm font-bold">✓</span>
              )}
            </div>
            {emailError && <p className="text-xs text-red-500">{emailError}</p>}
            {/* Typo hint */}
            {isGmailTypo && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <span className="text-xs text-blue-700">
                  Did you mean{" "}
                  <strong
                    className="cursor-pointer underline"
                    onClick={() => setFormData((p) => ({ ...p, email: fixedEmail }))}
                  >
                    {fixedEmail}
                  </strong>
                  ?
                </span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 bg-gray-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white transition-all">
              <span className="text-gray-400 text-sm">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => { setPasswordFocused(false); handleBlur("password"); }}
                className="flex-1 py-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-gray-400 hover:text-gray-600 text-sm p-1 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            {/* Strength bar */}
            {formData.password && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-gray-200"}`}
                    />
                  ))}
                </div>
                {strength.label && (
                  <span className={`text-xs font-semibold uppercase tracking-wide ${strength.text}`}>
                    {strength.label}
                  </span>
                )}
              </div>
            )}

            {/* Rules */}
            {(passwordFocused || touched.password) && formData.password && (
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {passwordRules.map((rule) => {
                  const pass = rule.test(formData.password);
                  return (
                    <div key={rule.label} className="flex items-center gap-1.5">
                      <span className={`text-xs ${pass ? "text-green-500" : "text-gray-300"}`}>
                        {pass ? "✓" : "○"}
                      </span>
                      <span className={`text-xs ${pass ? "text-gray-600 line-through" : "text-gray-400"}`}>
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
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <span className="text-red-500 text-sm">⚠</span>
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : "Create account →"}
          </button>

          <p className="text-center text-xs text-gray-400">
            By signing up you agree to our{" "}
            <span className="text-indigo-500 cursor-pointer">Terms</span> &{" "}
            <span className="text-indigo-500 cursor-pointer">Privacy Policy</span>
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
