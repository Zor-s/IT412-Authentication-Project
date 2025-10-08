import React, { useEffect, useState } from "react";
import axios from "axios";

// --- Types ---
interface UserResponse {
  fullname: string;
  email: string;
}

// --- Components ---
const LoadingScreen: React.FC = () => (
  <div style={styles.centered}>
    <div style={styles.spinner}></div>
    <p style={styles.message}>Loading your dashboard...</p>
  </div>
);

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ ...styles.centered, color: "#b91c1c" }}>
    <p style={styles.errorBox}>{message}</p>
  </div>
);

const Header: React.FC<{ fullname: string; onLogout: () => void }> = ({
  fullname,
  onLogout,
}) => (
  <header style={styles.header}>
    <h1 style={styles.title}>👋 Welcome, {fullname}</h1>
    <button
      style={styles.logoutButton}
      onClick={onLogout}
      aria-label="Logout"
      onKeyDown={(e) => e.key === "Enter" && onLogout()}
    >
      Logout
    </button>
  </header>
);

const UserCard: React.FC<{ fullname: string; email: string }> = ({
  fullname,
  email,
}) => (
  <section style={styles.card}>
    <div style={styles.avatar}>{fullname.charAt(0).toUpperCase()}</div>
    <h2 style={styles.name}>{fullname}</h2>
    <p style={styles.subtitle}>{email}</p>
  </section>
);

// --- Main Page ---
const DashboardPage: React.FC = () => {
  const [fullname, setFullname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<UserResponse>(
          "http://localhost:3000/api/session-user/",
          { withCredentials: true }
        );
        setFullname(res.data.fullname);
        setEmail(res.data.email);
      } catch {
        setError("You are not authenticated. Redirecting...");
        setTimeout(() => (window.location.href = "/"), 1200);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await axios.post(
        "http://localhost:3000/api/logout/",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("fullname");
      window.location.href = "/";
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div style={styles.container}>
      {fullname && <Header fullname={fullname} onLogout={handleLogout} />}
      <main style={styles.main}>
        {fullname && email && <UserCard fullname={fullname} email={email} />}{" "}
      </main>
    </div>
  );
};

// --- Styles ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "linear-gradient(90deg, #4f46e5, #3b82f6)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    background: "linear-gradient(135deg, #ffffff, #f9fafb)",
    borderRadius: "16px",
    padding: "2.5rem",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    maxWidth: "400px",
    width: "100%",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2.5rem",
    margin: "0 auto 1rem",
    fontWeight: 700,
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  name: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#6b7280",
  },
  message: {
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "1.1rem",
    color: "#374151",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    fontWeight: 600,
  },
};

// Add keyframes for spinner
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`,
  styleSheet.cssRules.length
);

export default DashboardPage;
