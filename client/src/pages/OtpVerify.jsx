import React, { useState } from "react";
import OtpInput from "../components/OtpInput.jsx";
import { post } from "../api.js";

export default function OtpVerify() {
  const params = new URLSearchParams(window.location.search);
  const phone = params.get("phone");
  const email = params.get("email");
  const nonce = params.get("nonce");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function verify() {
    setVerifying(true);
    setError("");

    const endpoint = phone ? "/otp/verify" : "/otp/verify-email";
    const payload = phone ? { phone, code, nonce } : { email, code, nonce };

    const res = await post(endpoint, payload);
    setVerifying(false);

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(res?.error?.message || "Verification failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border text-center">
        <h2 className="text-3xl font-bold text-gray-800">Verify OTP</h2>
        <p className="text-gray-500 mt-2">
          An OTP has been sent to{" "}
          <span className="font-semibold text-gray-700">{phone || email}</span>
        </p>

        <div className="my-8">
          <OtpInput value={code} onChange={setCode} />
        </div>

        <button
          disabled={code.length !== 6 || verifying}
          onClick={verify}
          className={`w-full py-3 rounded-lg font-semibold text-white transition ${
            code.length === 6 && !verifying
              ? "bg-black hover:bg-gray-800"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>

        {error && (
          <div className="text-red-600 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
