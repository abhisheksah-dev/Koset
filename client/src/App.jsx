import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import OnboardingPhone from "./pages/OnboardingPhone.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OtpVerify />} />
          <Route path="/onboarding/phone" element={<OnboardingPhone />} />
        </Routes>
      </div>
    </>
  );
}
