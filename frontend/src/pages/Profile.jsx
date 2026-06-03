import React, { useState, useEffect } from "react";
import { useAuth } from "../context/Authcontext";
import { User, Mail, FileUp, ShieldCheck, AlertCircle, FileCheck, CheckCircle2 } from "lucide-react";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (password) {
        formData.append("password", password);
      }
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      await updateUserProfile(formData);
      setSuccess("Profile updated successfully!");
      setPassword(""); // Clear password field
      setResumeFile(null); // Clear selected file
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container fade-in" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Profile Settings</h1>
        <p style={styles.subtitle}>Update your professional credentials and resume</p>
      </div>

      <div style={styles.layout}>
        {/* Left Column: Form */}
        <section className="glass-card" style={styles.formCard}>
          {error && (
            <div className="alert-banner alert-banner-error" style={{ marginBottom: "1.5rem" }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert-banner alert-banner-success" style={{ marginBottom: "1.5rem" }}>
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={18} color="#64748b" style={styles.inputIcon} />
                <input
                  type="text"
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
                  className="form-input"
                  style={styles.fieldInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Change Password (leave blank to keep current)</label>
              <div style={styles.inputWrapper}>
                <input
                  type="password"
                  placeholder="New password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label className="form-label">Upload Resume (PDF, DOC, DOCX - Max 5MB)</label>
              <div style={styles.fileUploadBox}>
                <FileUp size={24} color="#6366f1" style={{ marginBottom: "0.5rem" }} />
                <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  {resumeFile ? resumeFile.name : "Click to browse file or drag here"}
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={styles.fileInputHidden}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submitting}>
              {submitting ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Right Column: Status Card */}
        <aside style={styles.sidebar}>
          <div className="glass-card" style={styles.statusCard}>
            <div style={styles.cardHeader}>
              <ShieldCheck size={28} color="#6366f1" />
              <h3 style={styles.statusTitle}>Profile Status</h3>
            </div>
            
            <div style={styles.statusItem}>
              <span style={styles.label}>Account Role:</span>
              <span className="badge badge-role" style={{ textTransform: "capitalize" }}>{user?.role}</span>
            </div>

            <div style={styles.statusItem}>
              <span style={styles.label}>Member Since:</span>
              <span style={styles.value}>
                {user ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </span>
            </div>

            <div style={styles.divider}></div>

            <h4 style={styles.resumeHeader}>Current Loaded Resume</h4>
            {user?.resume ? (
              <div style={styles.resumeContainer}>
                <div style={styles.resumeInfo}>
                  <FileCheck size={20} color="#10b981" />
                  <span style={styles.resumeName}>{user.resume.split("/").pop()}</span>
                </div>
                <a
                  href={`http://localhost:5000${user.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ width: "100%", fontSize: "0.85rem", padding: "0.5rem" }}
                >
                  Download / View Resume
                </a>
              </div>
            ) : (
              <div style={styles.noResumeBox}>
                <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  No resume loaded. Upload your resume file to begin applying to jobs.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2.5rem 1rem",
  },
  header: {
    marginBottom: "2.5rem",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "0.35rem",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "0.95rem",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "2.5rem",
    alignItems: "start",
  },
  formCard: {
    padding: "2rem",
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
  fileUploadBox: {
    border: "2px dashed rgba(99, 102, 241, 0.2)",
    borderRadius: "10px",
    padding: "2rem 1.5rem",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(15, 22, 42, 0.3)",
    position: "relative",
    transition: "all 0.2s ease",
  },
  fileInputHidden: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  statusCard: {
    padding: "1.5rem",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
  },
  statusTitle: {
    fontSize: "1.1rem",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  statusItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  label: {
    color: "#94a3b8",
    fontSize: "0.9rem",
  },
  value: {
    color: "#fff",
    fontWeight: 500,
    fontSize: "0.9rem",
  },
  divider: {
    height: "1px",
    background: "rgba(255, 255, 255, 0.05)",
    margin: "1.25rem 0",
  },
  resumeHeader: {
    color: "#cbd5e1",
    fontSize: "0.9rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
  },
  resumeContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  resumeInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.15)",
    padding: "0.6rem 0.8rem",
    borderRadius: "8px",
    color: "#a7f3d0",
  },
  resumeName: {
    fontSize: "0.85rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  noResumeBox: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    padding: "1rem",
    borderRadius: "8px",
    textAlign: "center",
  },
};

// Add responsive overrides in javascript
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 900px) {
    div[style*="layout"] {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Profile;