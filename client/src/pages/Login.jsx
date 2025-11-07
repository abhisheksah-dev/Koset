import React, { useState } from "react";
import PhoneInput from "../components/PhoneInput.jsx";
import { post, endpoints } from "../api.js";
import { Link } from "react-router-dom";

export default function Login() {
  const [method, setMethod] = useState("email"); // 'email' or 'phone'
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function sendOtp() {
    setSending(true);
    setError("");

    const isEmail = method === "email";
    const endpoint = isEmail ? "/otp/send-email" : "/otp/send";
    const payload = isEmail
      ? { email, context: "signin" }
      : { phone, context: "signin" };

    const res = await post(endpoint, payload);
    setSending(false);

    if (res.ok) {
      const params = isEmail
        ? `email=${encodeURIComponent(email)}`
        : `phone=${encodeURIComponent(phone)}`;
      const url = `/otp?${params}&nonce=${res.nonce}`;
      window.location.href = url;
    } else {
      setError(res?.error?.message || "Failed to send OTP");
    }
  }

  function googleLogin() {
    window.location.href = endpoints.googleStart();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Login to Koset
          </h2>
          <p className="text-center text-gray-500 mt-2">Welcome back!</p>

          <button
            onClick={googleLogin}
            className="mt-8 w-full flex items-center justify-center gap-3 border rounded-lg px-4 py-2.5 hover:bg-gray-100 transition duration-200"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
            <span className="text-gray-700 font-semibold">
              Continue with Google
            </span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 uppercase">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div>
            <div className="flex border border-gray-200 rounded-lg p-1 mb-4">
              <button
                onClick={() => setMethod("email")}
                className={`w-1/2 py-2 rounded-md transition ${
                  method === "email" ? "bg-black text-white" : "text-gray-600"
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setMethod("phone")}
                className={`w-1/2 py-2 rounded-md transition ${
                  method === "phone" ? "bg-black text-white" : "text-gray-600"
                }`}
              >
                Phone
              </button>
            </div>

            {method === "email" ? (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Phone Number
                </label>
                <PhoneInput value={phone} onChange={setPhone} />
              </div>
            )}
          </div>

          <button
            disabled={sending}
            onClick={sendOtp}
            className={`mt-6 w-full py-3 rounded-lg text-white font-semibold transition
            ${
              sending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {sending ? "Sending..." : "Send OTP"}
          </button>

          {error && (
            <div className="text-red-600 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-black hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
