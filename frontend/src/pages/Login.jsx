import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      
      // Redirect based on role
      if (loggedUser.role === "recruiter") {
        navigate("/recruiter");
      } else if (loggedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer} className="fade-in">
      <div className="glass-card" style={styles.loginCard}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <LogIn size={24} color="#6366f1" />
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your details to log in to your account</p>
        </div>

        {error && (
          <div className="alert-banner alert-banner-error" style={{ fontSize: "0.9rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@example.com"
                className="form-input"
                style={styles.fieldInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <a href="#forgot" style={{ fontSize: "0.8rem", color: "#6366f1", fontWeight: 500 }}>
                Forgot?
              </a>
            </div>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#64748b" style={styles.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                className="form-input"
                style={styles.fieldInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div style={styles.footer}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6366f1", fontWeight: "600" }}>
              Sign Up
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
  loginCard: {
    width: "100%",
    maxWidth: "420px",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
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

export default Login;
