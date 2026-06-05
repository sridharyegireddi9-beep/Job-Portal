import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { BASE_URL } from "../services/api";
import { Briefcase, Calendar, CheckSquare, Clock, AlertCircle, FileText, ArrowRight, User } from "lucide-react";

const Userdashboard = () => {
  const { user } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const response = await fetch(`${BASE_URL}/applications`, { headers });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load applications");
        }
        setApplications(data);
      } catch (err) {
        setError(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === "Pending").length,
    accepted: applications.filter(app => app.status === "Accepted").length,
    rejected: applications.filter(app => app.status === "Rejected").length,
  };

  return (
    <div className="container fade-in" style={{ padding: "2.5rem 1rem" }}>
      {/* Welcome Banner */}
      <div style={styles.welcomeBanner} className="glass-card">
        <div style={styles.welcomeLeft}>
          <div style={styles.avatar}>
            <User size={24} color="#6366f1" />
          </div>
          <div>
            <h1 style={styles.welcomeTitle}>Welcome back, {user?.name}!</h1>
            <p style={styles.welcomeSubtitle}>Track your job applications and check recruiters response status</p>
          </div>
        </div>
        <Link to="/profile" className="btn btn-secondary" style={styles.profileBtn}>
          Edit Profile Settings
        </Link>
      </div>

      {/* Metrics Cards */}
      <section style={styles.metricsGrid}>
        <div className="glass-card" style={styles.metricCard}>
          <Briefcase size={24} color="#6366f1" />
          <div>
            <h3 style={styles.metricNumber}>{stats.total}</h3>
            <p style={styles.metricLabel}>Total Applications</p>
          </div>
        </div>
        
        <div className="glass-card" style={styles.metricCard}>
          <Clock size={24} color="#f59e0b" />
          <div>
            <h3 style={styles.metricNumber}>{stats.pending}</h3>
            <p style={styles.metricLabel}>Pending Review</p>
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard}>
          <CheckSquare size={24} color="#10b981" />
          <div>
            <h3 style={styles.metricNumber}>{stats.accepted}</h3>
            <p style={styles.metricLabel}>Accepted / Offered</p>
          </div>
        </div>
      </section>

      {/* Applications List */}
      <section className="glass-card" style={{ padding: "2rem" }}>
        <h2 style={styles.sectionTitle}>Applications Tracking Pipeline</h2>
        <div style={styles.divider}></div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="alert-banner alert-banner-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : applications.length === 0 ? (
          <div style={styles.emptyState}>
            <FileText size={48} color="#64748b" style={{ marginBottom: "1rem" }} />
            <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>No applications submitted yet</h3>
            <p style={{ color: "#94a3b8" }}>Start searching for job listings and matches.</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Search Vetted Jobs <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Date Applied</th>
                  <th>Resume Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <Link to={`/jobs/${app.job?._id}`} style={styles.jobLink}>
                        {app.job?.title || "Deleted Job Listing"}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 500, color: "#fff" }}>
                      {app.job?.company || "N/A"}
                    </td>
                    <td style={{ color: "#94a3b8" }}>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {app.resume ? (
                        <span style={styles.resumeInfo}>
                          {app.resume.split("/").pop()}
                        </span>
                      ) : (
                        <span style={{ color: "#64748b" }}>No Resume link</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          app.status === "Accepted"
                            ? "badge-accepted"
                            : app.status === "Rejected"
                            ? "badge-rejected"
                            : "badge-pending"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  welcomeBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1.5rem",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(15, 22, 42, 0.6) 100%)",
  },
  welcomeLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    background: "rgba(99, 102, 241, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(99, 102, 241, 0.3)",
  },
  welcomeTitle: {
    fontSize: "1.6rem",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
    marginBottom: "0.25rem",
  },
  welcomeSubtitle: {
    color: "#cbd5e1",
    fontSize: "0.9rem",
  },
  profileBtn: {
    padding: "0.6rem 1.2rem",
    fontSize: "0.88rem",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
    marginBottom: "2.5rem",
  },
  metricCard: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    padding: "1.5rem",
  },
  metricNumber: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: "0.85rem",
    marginTop: "0.1rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.05)",
    margin: "1.25rem 0",
  },
  emptyState: {
    textAlign: "center",
    padding: "3.5rem",
  },
  jobLink: {
    color: "#a5b4fc",
    fontWeight: 600,
    transition: "color 0.2s ease",
  },
  resumeInfo: {
    color: "#64748b",
    fontSize: "0.85rem",
    maxWidth: "180px",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

// Add responsive overrides in javascript
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 768px) {
    section[style*="metricsGrid"] {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Userdashboard;
