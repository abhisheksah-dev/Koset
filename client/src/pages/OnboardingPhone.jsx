import React, { useState } from "react";
import PhoneInput from "../components/PhoneInput.jsx";
import { put } from "../api.js";

export default function OnboardingPhone() {
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function savePhone() {
    setErr("");
    setMsg("");
    setSaving(true);

    const res = await put("/me/phone", { phone });
    setSaving(false);

    if (res?.ok) {
      setMsg("Phone saved. OTP sent to your number.");
      const qp = new URLSearchParams({
        phone: phone,
        nonce: res.nonce || "",
      }).toString();
      window.location.href = `/otp?${qp}`;
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
          We&apos;ll use this for OTP authentication.
        </p>

        <div className="mt-6">
          <label className="text-sm text-gray-600 mb-1 block">
            Phone Number
          </label>
          <PhoneInput value={phone} onChange={setPhone} />
        </div>

        <button
          onClick={savePhone}
          disabled={saving || !phone || phone.length < 5}
          className={`mt-6 w-full py-2 rounded-lg font-medium transition
            ${
              saving || !phone || phone.length < 5
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
        >
          {saving ? "Sending OTP..." : "Continue"}
        </button>

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
