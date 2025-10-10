import React, { useState, useEffect } from "react";
// Faking the api import for demonstration purposes
import api from "./api";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "/autproj.png";
// import { div } from "framer-motion/client";

// --- TYPE DEFINITIONS ---

// Define the structure for password validation state
interface PasswordValidationState {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

// Define props for the Requirement sub-component
interface RequirementProps {
  met: boolean;
  text: string;
}

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Auto-hide error after 3 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // State to track password validation criteria
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationState>({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    });

  // State to track overall password strength for the meter
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  // This effect runs whenever the password changes to validate it
  useEffect(() => {
    const length = password.length >= 12;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[\W_]/.test(password);

    setPasswordValidation({ length, uppercase, lowercase, number, special });

    const strength = [length, uppercase, lowercase, number, special].filter(
      Boolean
    ).length;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordStrength < 5) {
      setError("Your password does not meet all the requirements.");
      return;
    }

    // --- MOCK API CALL FOR DEMONSTRATION ---
    // console.log("Submitting:", { fullname: name, email, password });
    // setSuccess("Signup successful! You can now login.");
    // setName("");
    // setEmail("");
    // setPassword("");
    // setConfirmPassword("");
    // --- END MOCK ---

    // --- REAL API CALL (example with basic error handling) ---
    try {
      const response = await api.post("/signup/", {
        fullname: name,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Signup successful! You can now login.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        localStorage.setItem("fullname", response.data.fullname);
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.data.email) {
          setError("Email already exists.");
        } else if (err.response.data.password) {
          setError(err.response.data.password[0]);
        } else {
          setError("Signup failed. Please check your input.");
        }
      } else {
        setError("Network error. Please try again later.");
      }
    }
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 2) return "#ef4444"; // red
    if (strength < 4) return "#f97316"; // orange
    if (strength < 5) return "#f59e0b"; // amber
    return "#22c55e"; // green
  };

  // A small, typed component to render each validation requirement
  const Requirement: React.FC<RequirementProps> = ({ met, text }) => (
    <div
      style={{ ...styles.requirementItem, color: met ? "#22c55e" : "#6b7280" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: "8px", flexShrink: 0 }}
      >
        {met ? (
          <path
            d="M13.3337 4.66699L6.00033 12.0003L2.66699 8.66699"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {text}
    </div>
  );

  return (
    <div className="flex items-center justify-center h-screen bg-[linear-gradient(to_right,_#00b3ff,_#ae00ff)]">
      {/* LEFT COLUMN */}
      <div className="flex flex-col justify-center items-center p-10 bg-white w-[600px] text-left h-full">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-5 text-gray-700"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Create Your Account
          </h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {success && (
            <p className="text-center text-green-600 text-sm">{success}</p>
          )}

          {/* FULL NAME */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* PASSWORD STRENGTH */}
          <div className="mt-[-8px] space-y-3">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${passwordStrength * 20}%`,
                  backgroundColor: getStrengthColor(passwordStrength),
                }}
              ></div>
            </div>

            <div className="grid gap-1.5 text-sm">
              <Requirement
                met={passwordValidation.length}
                text="At least 12 characters long"
              />
              <Requirement
                met={passwordValidation.uppercase}
                text="Contains an uppercase letter"
              />
              <Requirement
                met={passwordValidation.lowercase}
                text="Contains a lowercase letter"
              />
              <Requirement
                met={passwordValidation.number}
                text="Contains a number"
              />
              <Requirement
                met={passwordValidation.special}
                text="Contains a special character"
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 mt-2 text-white font-semibold bg-pink-500 rounded-md hover:bg-pink-600 active:scale-[0.98] transition-transform"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 font-medium hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden md:block flex-1">
        <div className="grid h-full place-items-center text-center gap-10">
          <p className="text-3xl text-white font-bold text-shadow-lg mb-10">
            AUTH Project
          </p>
          <img src={logoImg} className="drop-shadow-2xl w-60 h-auto" />
          <p className="text-2xl text-white font-bold text-shadow-lg">
            “Secure your learning. Empower your future.”
          </p>
          <p className="text-white text-shadow-lg italic">
            Empowering learning through trusted authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  requirementsList: {
    display: "grid",
    gap: "6px",
  },
  requirementItem: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    transition: "color 0.3s ease",
  },
};

export default SignupPage;
