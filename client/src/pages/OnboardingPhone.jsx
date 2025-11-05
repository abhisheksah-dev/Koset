import React, { useState } from "react";
import PhoneInput from "../components/PhoneInput.jsx";
import { post } from "../api.js";

export default function OnboardingPhone() {
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function savePhone() {
    setErr("");
    setMsg("");
    const res = await post("/me/phone", { phone });

    if (res.ok) {
      setMsg("Phone saved. OTP sent.");
      window.location.href = `/otp?phone=${encodeURIComponent(phone)}&nonce=${
        res.nonce
      }`;
    } else {
      setErr(res?.error?.message || "Failed to save phone");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Add your phone number
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          We'll use this for OTP authentication.
        </p>

        <div className="mt-6">
          <label className="text-sm text-gray-600 mb-1 block">
            Phone Number
          </label>
          <PhoneInput value={phone} onChange={setPhone} />
        </div>

        <button
          onClick={savePhone}
          className="mt-6 w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-900 transition"
        >
          Continue
        </button>

        {/* Success & Error Messages */}
        {msg && (
          <div className="text-green-600 text-sm mt-3 text-center">{msg}</div>
        )}
        {err && (
          <div className="text-red-600 text-sm mt-3 text-center">{err}</div>
        )}
      </div>
    </div>
  );
}
