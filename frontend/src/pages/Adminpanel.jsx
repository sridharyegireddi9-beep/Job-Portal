import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Users, Briefcase, Trash2, ShieldCheck, Mail, ShieldAlert, Award } from "lucide-react";

const Adminpanel = () => {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "jobs"
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const usersData = await api.admin.getUsers();
      setUsers(usersData);
      
      const jobsData = await api.jobs.getAll();
      setJobs(jobsData);
    } catch (err) {
      setError(err.message || "Failed to load administrative details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? All applications will be orphaned.")) return;
    try {
      await api.admin.deleteUser(userId);
      setSuccess("User account deleted successfully");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete user: " + err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await api.admin.deleteJob(jobId);
      setSuccess("Job listing deleted successfully");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete job: " + err.message);
    }
  };

  const metrics = {
    totalUsers: users.length,
    totalJobs: jobs.length,
    recruitersCount: users.filter((u) => u.role === "recruiter").length,
    candidatesCount: users.filter((u) => u.role === "user").length,
  };

  return (
    <div className="container fade-in" style={{ padding: "2.5rem 1rem" }}>
      <div style={styles.header}>
        <div style={styles.headerTitleRow}>
          <Award size={28} color="#6366f1" />
          <h1 style={styles.title}>System Administration</h1>
        </div>
        <p style={styles.subtitle}>Oversee candidate profiles, recruiter accounts, and global job listings</p>
      </div>

      {/* Metrics Row */}
      <section style={styles.metricsGrid}>
        <div className="glass-card" style={styles.metricCard}>
          <Users size={24} color="#6366f1" />
          <div>
            <h3 style={styles.metricNumber}>{metrics.totalUsers}</h3>
            <p style={styles.metricLabel}>Total Users Registered</p>
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard}>
          <Briefcase size={24} color="#a855f7" />
          <div>
            <h3 style={styles.metricNumber}>{metrics.totalJobs}</h3>
            <p style={styles.metricLabel}>Total Posted Jobs</p>
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard}>
          <ShieldCheck size={24} color="#10b981" />
          <div>
            <h3 style={styles.metricNumber}>{metrics.recruitersCount}</h3>
            <p style={styles.metricLabel}>Recruiters / Seekers: {metrics.recruitersCount} / {metrics.candidatesCount}</p>
          </div>
        </div>
      </section>

      {/* Action Messages */}
      {success && (
        <div className="alert-banner alert-banner-success">
          <ShieldCheck size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert-banner alert-banner-error">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Manage Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          Manage Job Listings ({jobs.length})
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          {/* Manage Users */}
          {activeTab === "users" && (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User Details</th>
                    <th>Email Address</th>
                    <th>System Role</th>
                    <th>Registered Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600, color: "#fff" }}>{u.name}</td>
                      <td>
                        <span style={styles.emailRow}>
                          <Mail size={14} style={{ marginRight: 4 }} /> {u.email}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            u.role === "admin"
                              ? "badge-accepted"
                              : u.role === "recruiter"
                              ? "badge-pending"
                              : "badge-role"
                          }`}
                          style={{ textTransform: "uppercase" }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: "#94a3b8" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="btn btn-danger"
                          style={styles.deleteBtn}
                          disabled={u.role === "admin"} // Prevent deleting self / other admins easily
                          title={u.role === "admin" ? "Admins cannot be deleted" : "Delete User"}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Manage Job Listings */}
          {activeTab === "jobs" && (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Recruiter Account</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j._id}>
                      <td>
                        <Link to={`/jobs/${j._id}`} style={styles.jobLink}>
                          {j.title}
                        </Link>
                      </td>
                      <td style={{ fontWeight: 500, color: "#fff" }}>{j.company}</td>
                      <td>{j.location}</td>
                      <td>
                        <div style={{ fontWeight: 500, color: "#cbd5e1" }}>{j.recruiter?.name || "Deleted Recruiter"}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{j.recruiter?.email || "N/A"}</div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteJob(j._id)}
                          className="btn btn-danger"
                          style={styles.deleteBtn}
                          title="Delete Listing"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    marginBottom: "2.5rem",
  },
  headerTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "0.35rem",
  },
  title: {
    fontSize: "2rem",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.95rem",
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
  emailRow: {
    display: "inline-flex",
    alignItems: "center",
  },
  deleteBtn: {
    padding: "0.4rem 0.8rem",
    fontSize: "0.8rem",
  },
  jobLink: {
    color: "#a5b4fc",
    fontWeight: 600,
  },
};

// Add responsive stylesheet overrides in javascript
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

export default Adminpanel;
