import React from "react";

interface User {
  fullname: string;
  email: string;
  password: string;
}

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  return (
    <div style={styles.container}>
      {" "}
      <header style={styles.header}>
        {" "}
        <h1 style={styles.title}>Dashboard</h1>{" "}
        <button style={styles.logoutButton} onClick={onLogout}>
          Log Out{" "}
        </button>{" "}
      </header>
      ```
      <main style={styles.main}>
        <div style={styles.card}>
          <div style={styles.avatarPlaceholder}>
            {user.fullname.charAt(0).toUpperCase()}
          </div>
          <h2 style={styles.name}>{user.fullname}</h2>
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
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 600,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px",
  },
  avatarPlaceholder: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    fontSize: "2.5rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
  },
  name: {
    margin: "0.5rem 0",
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#111827",
  },
};

export default DashboardPage;
