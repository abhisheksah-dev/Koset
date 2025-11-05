import React, { useState } from "react";
import PhoneInput from "../components/PhoneInput.jsx";
import { post, endpoints } from "../api.js";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function sendPhoneOtp() {
    setSending(true);
    setError("");
    const res = await post("/otp/send", { phone, context: "signin" });
    setSending(false);

    if (res.ok) {
      const url = `/otp?phone=${encodeURIComponent(phone)}&nonce=${res.nonce}`;
      window.location.href = url;
    } else {
      setError(res?.error?.message || "Failed to send OTP");
    }
  }

  function googleLogin() {
    window.location.href = endpoints.googleStart();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 border">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login to Koset
        </h2>

        {/* Google Login */}
        <button
          onClick={googleLogin}
          className="mt-6 w-full flex items-center justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Phone Login */}
        <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
        <PhoneInput value={phone} onChange={setPhone} />

        <button
          disabled={sending}
          onClick={sendPhoneOtp}
          className={`mt-4 w-full py-2 rounded-lg text-white font-medium transition
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
