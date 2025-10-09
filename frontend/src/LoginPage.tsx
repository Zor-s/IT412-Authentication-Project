import React, { useState } from "react";
import api from "./api"; // adjust path if needed
import bgImg from "./assets/images/bgImg.png";
import logoImg from "/public/autproj.png"; // adjust path if needed

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await api.post("/login/", { email, password });

      if (response.status === 200) {
        // Save fullname for frontend rendering convenience
        localStorage.setItem("fullname", response.data.fullname);
        // Redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[linear-gradient(to_right,_#00b3ff,_#ae00ff)]">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-lg overflow-hidden max-w-6xl w-full">
        {/* LEFFT COLUMN */}
        <div
          className="flex flex-col p-10 items-center justify-center space-y-4 text-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgImg}` }}
        >
          <p className="text-4xl text-white font-bold drop-shadow-lg">
            Welcome to Auth!
          </p>
          <p className="text-white drop-shadow-lg">
            You can sign in to access with your existing acccount!
          </p>
          <img className="w-50 h-auto" src={logoImg} alt="" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col items-center justify-center bg-gray-100 p-8 md:p-12 w-full">
          <form
            onSubmit={handleSubmit}
            className="p-8 w-full max-w-md space-y-6"
          >
            <h2 className="text-center text-2xl font-bold text-gray-800">
              USER LOGIN
            </h2>

            {error && (
              <p className="text-red-500 text-center bg-red-100 p-2 rounded-md">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-gray-700 font-medium tracking-wide"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6f47ff] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-gray-700 font-medium tracking-wide"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ee00ff] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6f47ff] to-[#ee00ff] text-white py-2.5 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all duration-200"
            >
              Submit
            </button>

            <p className="text-center text-gray-600 text-sm">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-[#6f47ff] font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
