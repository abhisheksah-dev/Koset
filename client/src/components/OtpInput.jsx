import React from "react";

export default function OtpInput({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={6}
      placeholder="Enter OTP"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      className="w-44 px-4 py-2 text-center tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition placeholder-gray-400 text-lg"
    />
  );
}
