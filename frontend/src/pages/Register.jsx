import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { User, Briefcase, Mail, Lock, UserCheck, AlertCircle } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" or "recruiter"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const registeredUser = await register(name, email, password, role);
      
      // Redirect based on role
      if (registeredUser.role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer} className="fade-in">
      <div className="glass-card" style={styles.registerCard}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <UserCheck size={24} color="#6366f1" />
          </div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Get started to matching with premium career tracks</p>
        </div>

        {error && (
          <div className="alert-banner alert-banner-error" style={{ fontSize: "0.9rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div style={styles.roleContainer}>
            <div
              style={{
                ...styles.roleCard,
                borderColor: role === "user" ? "#6366f1" : "rgba(255, 255, 255, 0.05)",
                background: role === "user" ? "rgba(99, 102, 241, 0.08)" : "rgba(15, 22, 42, 0.4)",
              }}
              onClick={() => setRole("user")}
            >
              <User size={20} color={role === "user" ? "#6366f1" : "#94a3b8"} />
              <div>
                <p style={styles.roleTitle}>Job Seeker</p>
                <p style={styles.roleDesc}>Find work &amp; submit resume</p>
              </div>
            </div>

            <div
              style={{
                ...styles.roleCard,
                borderColor: role === "recruiter" ? "#6366f1" : "rgba(255, 255, 255, 0.05)",
                background: role === "recruiter" ? "rgba(99, 102, 241, 0.08)" : "rgba(15, 22, 42, 0.4)",
              }}
              onClick={() => setRole("recruiter")}
            >
              <Briefcase size={20} color={role === "recruiter" ? "#6366f1" : "#94a3b8"} />
              <div>
                <p style={styles.roleTitle}>Recruiter</p>
                <p style={styles.roleDesc}>Post roles &amp; hire talent</p>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="text"
                placeholder="John Doe"
                className="form-input"
                style={styles.fieldInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="email"
                placeholder="john@example.com"
                className="form-input"
                style={styles.fieldInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="password"
                placeholder="At least 6 characters"
                className="form-input"
                style={styles.fieldInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#6366f1", fontWeight: "600" }}>
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 140px)",
    padding: "2rem 1rem",
  },
  registerCard: {
    width: "100%",
    maxWidth: "460px",
  },
  header: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  iconCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(99, 102, 241, 0.08)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.6rem",
    marginBottom: "0.25rem",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  roleContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  roleCard: {
    border: "1px solid",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  roleTitle: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#fff",
  },
  roleDesc: {
    fontSize: "0.7rem",
    color: "#64748b",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    pointerEvents: "none",
  },
  fieldInput: {
    paddingLeft: "40px",
  },
  footer: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.88rem",
    color: "#64748b",
  },
};

export default Register;
