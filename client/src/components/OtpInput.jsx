import React, { useRef, useState } from "react";

export default function OtpInput({ value, onChange }) {
  const inputsRef = useRef([]);
  const [internalValue, setInternalValue] = useState(new Array(6).fill(""));

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val) {
      const newOtp = [...internalValue];
      newOtp[index] = val;
      setInternalValue(newOtp);
      onChange(newOtp.join(""));
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !internalValue[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = new Array(6).fill("");
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setInternalValue(newOtp);
    onChange(newOtp.join(""));
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={internalValue[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
        />
      ))}
    </div>
  );
}