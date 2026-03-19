// src/pages/VerifyEmail.jsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useVerify } from "../hooks/useVerify";
import { useAuth } from "../context/Auth.context";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { verifyEmail, status } = useVerify();
  const { fetchUser } = useAuth();

  useEffect(() => {
    const runVerification = async () => {
      const success = await verifyEmail(token, fetchUser);

      if (success) {
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    if (token) {
      runVerification();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center">

        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500 text-sm">
              Please wait a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              ✅ Email Verified!
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold text-red-500 mb-2">
              ❌ Verification Failed
            </h2>
            <p className="text-gray-500 text-sm">
              Link expired or invalid. Please login again.
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;