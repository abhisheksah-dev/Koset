export default function PhoneInput({ value, onChange }) {
  const handleChange = (e) => {
    let num = e.target.value.replace(/\D/g, "");
    if (!num.startsWith("91")) num = "91" + num;
    onChange("+" + num);
  };

  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
        +91
      </span>
      <input
        type="tel"
        inputMode="numeric"
        placeholder="12345 67890"
        value={value.replace("+91", "")}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition placeholder-gray-400"
      />
    </div>
  );
}
