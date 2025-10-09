import React, { useState } from "react";
import api from "./api";

const SignupPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

        // Automatically store fullname for UI rendering
        localStorage.setItem("fullname", response.data.fullname);
        // Redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      if (err.response) {
        // Django validation errors
        if (err.response.data.email) {
          setError("Email already exists.");
        } else {
          setError("Signup failed. Please check your input.");
        }
      } else {
        setError("Network error. Please try again later.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Sign Up</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <p style={{ ...styles.error, color: "green" }}>{success}</p>
        )}

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="name">
            Full Name
          </label>
          <input
            style={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            style={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            style={styles.input}
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, #ff7e5f, #feb47b)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ff7e5f",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    textAlign: "center",
  },
  signupText: {
    textAlign: "center",
    marginTop: "15px",
  },
  link: {
    color: "#ff7e5f",
    textDecoration: "none",
  },
};

export default SignupPage;
