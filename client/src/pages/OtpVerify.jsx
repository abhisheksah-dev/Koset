import React, { useMemo, useState } from "react";
import OtpInput from "../components/OtpInput.jsx";
import { post } from "../api.js";

export default function OtpVerify() {
  const params = new URLSearchParams(window.location.search);
  const phone = useMemo(() => params.get("phone") || "", []);
  const nonce = useMemo(() => params.get("nonce") || "", []);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function verify() {
    setError("");
    const res = await post("/otp/verify", { phone, code, nonce });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(res?.error?.message || "Verification failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1">
          Sent to <span className="font-medium text-gray-700">{phone}</span>
        </p>

        <div className="mt-6 flex justify-center">
          <OtpInput value={code} onChange={setCode} />
        </div>

        <button
          disabled={code.length !== 6}
          onClick={verify}
          className={`mt-6 w-full py-2 rounded-lg font-medium text-white transition
          ${
            code.length === 6
              ? "bg-black hover:bg-gray-900"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Verify
        </button>

        {error && (
          <div className="text-red-600 text-sm mt-3 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
