import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardPage: React.FC = () => {
  const [fullname, setFullname] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/session-user/", {
          withCredentials: true,
        });
        setFullname(res.data.fullname);
      } catch {
        // Not authenticated
        window.location.href = "/";
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:3000/api/logout/",
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("fullname");
    window.location.href = "/";
  };

  if (!fullname) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome, {fullname}</h1>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.avatar}>{fullname.charAt(0).toUpperCase()}</div>
          <h2 style={styles.name}>{fullname}</h2>
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#1f2937",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    margin: "0 auto 1rem",
  },
  name: {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
};

export default DashboardPage;
