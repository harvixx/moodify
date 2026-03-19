// src/pages/VerifyNotice.jsx
import { useVerifyNotice } from "../hooks/useVerifyNotice";

const VerifyNotice = () => {
  const { email, resendEmail, loading, message } = useVerifyNotice();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          📧 Verify Your Email
        </h2>

        <p className="text-gray-600 text-sm mb-2">
          We've sent a verification link to:
        </p>

        <p className="font-medium text-indigo-600 mb-4 break-all">
          {email || "No email found"}
        </p>

        <p className="text-gray-500 text-sm mb-6">
          Please check your inbox and click the link to activate your account.
        </p>

        <button
          onClick={resendEmail}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
        >
          {loading ? "Sending..." : "Resend Email"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-700">{message}</p>
        )}

      </div>
    </div>
  );
};

export default VerifyNotice;