import React, { useState, useEffect } from "react";
// Faking the api import for demonstration purposes
import api from "./api";

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

// --- MAIN COMPONENT ---

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // State to track password validation criteria
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationState>({
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
    <div style={{...styles.requirementItem, color: met ? '#22c55e' : '#6b7280' }}>
       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', flexShrink: 0 }}>
        {met ? (
          <path d="M13.3337 4.66699L6.00033 12.0003L2.66699 8.66699" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        ) : (
          <path d="M8 14.667A6.667 6.667 0 1 0 8 1.333a6.667 6.667 0 0 0 0 13.334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        )}
      </svg>
      {text}
    </div>
  );

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Create Your Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={{ ...styles.error, color: "green" }}>{success}</p>}

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="name">Full Name</label>
          <input
            style={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">Password</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Password Strength Meter and Requirements */}
        <div style={styles.passwordFeedback}>
            <div style={styles.strengthMeterContainer}>
                <div style={{
                    ...styles.strengthMeterFill, 
                    width: `${passwordStrength * 20}%`, 
                    backgroundColor: getStrengthColor(passwordStrength)
                }}></div>
            </div>
            <div style={styles.requirementsList}>
                <Requirement met={passwordValidation.length} text="At least 12 characters long" />
                <Requirement met={passwordValidation.uppercase} text="Contains an uppercase letter" />
                <Requirement met={passwordValidation.lowercase} text="Contains a lowercase letter" />
                <Requirement met={passwordValidation.number} text="Contains a number" />
                <Requirement met={passwordValidation.special} text="Contains a special character" />
            </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
          <input
            style={styles.input}
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Sign Up
        </button>

        <p style={styles.signupText}>
          Already have an account?{" "}
          <a href="/" style={styles.link}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(to right, #6a82fb, #fc5c7d)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: "border-box",
  },
  form: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "420px",
    boxSizing: "border-box",
  },
  title: {
    marginBottom: "25px",
    color: "#333",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#555",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#fc5c7d",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
    marginTop: '10px',
  },
  error: {
    color: "#ef4444",
    marginBottom: "15px",
    textAlign: "center",
    fontSize: '14px',
  },
  signupText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#555",
  },
  link: {
    color: "#6a82fb",
    textDecoration: "none",
    fontWeight: '500',
  },
  passwordFeedback: {
    marginBottom: '20px',
    marginTop: '-10px',
  },
  strengthMeterContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  strengthMeterFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease, background-color 0.3s ease',
  },
  requirementsList: {
      display: 'grid',
      gap: '6px',
  },
  requirementItem: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '13px',
      transition: 'color 0.3s ease',
  },
};

export default SignupPage;
