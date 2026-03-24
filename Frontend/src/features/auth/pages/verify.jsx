// src/features/auth/pages/verify.jsx
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useVerify } from "../hooks/useVerify";
import { useAuth } from "../context/Auth.context";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail, status } = useVerify();
  const { fetchUser } = useAuth();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-gray-200/80 p-8 text-center">

        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
            ✦
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">Yourapp</span>
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-[3px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Verifying your email...</h2>
            <p className="text-sm text-gray-500">This will only take a second.</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-200 animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_both]">
              <span className="text-white text-3xl font-bold">✓</span>
            </div>
            <h2 className="text-xl font-bold text-green-700 tracking-tight">Email Verified!</h2>
            <p className="text-sm text-gray-500">Redirecting you to dashboard...</p>
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-2">
              <span className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
              <span className="text-sm text-indigo-600 font-medium">Taking you in...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
              <span className="text-white text-2xl font-bold">✕</span>
            </div>
            <h2 className="text-xl font-bold text-red-600 tracking-tight">Verification Failed</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              This link has expired or is invalid. Verification links are valid for <strong>1 hour</strong> only.
            </p>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Link
                to="/verify-notice"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl text-sm hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200"
              >
                Request a new link
              </Link>
              <Link
                to="/login"
                className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
