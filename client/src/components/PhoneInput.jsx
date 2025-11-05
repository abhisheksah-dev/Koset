import React from "react";

export default function PhoneInput({ value, onChange }) {
  const handleChange = (e) => {
    let num = e.target.value.replace(/\D/g, ""); // keep only digits

    // Ensure country code "91" stays at the front
    if (!num.startsWith("91")) {
      num = "91" + num;
    }

    onChange("+" + num);
  };

  return (
    <input
      type="tel"
      inputMode="numeric"
      placeholder="+91 1234567890"
      value={value}
      onChange={handleChange}
      className="w-64 px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition placeholder-gray-400"
    />
  );
}
