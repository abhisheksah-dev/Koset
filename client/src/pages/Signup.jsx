import React, { useState } from "react";
import PhoneInput from "../components/PhoneInput.jsx";
import { post } from "../api.js";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function sendSignupOtp() {
    setSending(true);
    setError("");

    const res = await post("/otp/send", { phone, context: "signup" });
    setSending(false);

    if (res.ok) {
      window.location.href = `/otp?phone=${encodeURIComponent(phone)}&nonce=${
        res.nonce
      }`;
    } else {
      setError(res?.error?.message || "Failed to send OTP");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create your account
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1">
          Continue with your phone number
        </p>

        <div className="mt-6">
          <label className="text-sm text-gray-600 mb-1 block">
            Phone Number
          </label>
          <PhoneInput value={phone} onChange={setPhone} />
        </div>

        <button
          disabled={sending}
          onClick={sendSignupOtp}
          className={`mt-6 w-full py-2 rounded-lg font-medium text-white transition
          ${sending ? "bg-gray-400" : "bg-black hover:bg-gray-900"}`}
        >
          {sending ? "Sending..." : "Send OTP"}
        </button>

        {error && (
          <div className="text-red-600 text-sm mt-3 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
