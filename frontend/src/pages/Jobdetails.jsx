import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { api } from "../services/api";
import { MapPin, DollarSign, Calendar, FileText, CheckCircle, ArrowLeft, Info, FileCheck, Check, X, ShieldAlert } from "lucide-react";

const Jobdetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  
  // Recruiter applicant matching
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const fetchJobData = async () => {
    setLoading(true);
    setError("");
    try {
      const jobData = await api.jobs.getById(id);
      setJob(jobData);
      
      // If user is candidate, verify if they already applied
      if (user && user.role === "user") {
        const userApps = await api.applications.getAll();
        const applied = userApps.some((app) => app.job._id === id);
        setAlreadyApplied(applied);
      }
      
      // If user is the recruiter of this job, get the applicants
      if (user && (user.role === "admin" || (user.role === "recruiter" && jobData.recruiter?._id === user.id))) {
        setLoadingApplicants(true);
        const allApps = await api.applications.getAll();
        const matchingApps = allApps.filter((app) => app.job._id === id);
        setApplicants(matchingApps);
        setLoadingApplicants(false);
      }
    } catch (err) {
      setError(err.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "user" && !user.resume) {
      setError("Please upload your resume in Profile / Dashboard before applying.");
      return;
    }

    setError("");
    try {
      await api.applications.apply(id);
      setApplySuccess(true);
      setAlreadyApplied(true);
    } catch (err) {
      setError(err.message || "Application failed");
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.applications.updateStatus(appId, newStatus);
      // Re-fetch applications
      const allApps = await api.applications.getAll();
      const matchingApps = allApps.filter((app) => app.job._id === id);
      setApplicants(matchingApps);
    } catch (err) {
      alert("Failed to update applicant status: " + err.message);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="container" style={{ padding: "4rem 1rem" }}>
        <div className="alert-banner alert-banner-error">
          <ShieldAlert size={20} />
          <p>{error}</p>
        </div>
        <Link to="/jobs" className="btn btn-secondary" style={{ marginTop: "1rem" }}>
          <ArrowLeft size={16} /> Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: "2.5rem 1rem" }}>
      <Link to="/jobs" style={styles.backBtn}>
        <ArrowLeft size={16} /> Back to Listings
      </Link>

      <div style={styles.detailsLayout}>
        {/* Main Details */}
        <section style={styles.mainInfo}>
          <div className="glass-card" style={{ marginBottom: "2rem" }}>
            <div style={styles.headerBlock}>
              <div style={styles.companyBadge}>
                {job.company.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h1 style={styles.jobTitle}>{job.title}</h1>
                <p style={styles.jobCompany}>{job.company}</p>
              </div>
            </div>

            <div style={styles.infoMeta}>
              <div style={styles.metaRow}>
                <MapPin size={16} color="#94a3b8" />
                <span>{job.location}</span>
              </div>
              <div style={styles.metaRow}>
                <DollarSign size={16} color="#10b981" />
                <span style={{ color: "#10b981", fontWeight: 600 }}>
                  ${job.salary?.toLocaleString()} / year
                </span>
              </div>
              <div style={styles.metaRow}>
                <Calendar size={16} color="#94a3b8" />
                <span>Posted on: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.descriptionSection}>
              <h3 style={styles.sectionTitle}>Job Description</h3>
              <p style={styles.descriptionText}>{job.description}</p>
            </div>
          </div>

          {/* Applicant Portal for Recruiter */}
          {user && (user.role === "admin" || (user.role === "recruiter" && job.recruiter?._id === user.id)) && (
            <div className="glass-card">
              <h2 style={{ ...styles.sectionTitle, marginBottom: "0.25rem" }}>Applicants Portal ({applicants.length})</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Review and update status on submissions for this role.
              </p>

              {loadingApplicants ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>Loading candidates...</div>
              ) : applicants.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                  <FileText size={32} style={{ marginBottom: "0.5rem" }} />
                  <p>No candidates have applied for this listing yet.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Candidate Name</th>
                        <th>Email</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Action Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((app) => (
                        <tr key={app._id}>
                          <td style={{ fontWeight: 600 }}>{app.user?.name || "Deleted Candidate"}</td>
                          <td>{app.user?.email || "N/A"}</td>
                          <td>
                            {app.resume ? (
                              <a
                                href={`http://localhost:5000${app.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.downloadLink}
                              >
                                <FileCheck size={16} /> View Document
                              </a>
                            ) : (
                              <span style={{ color: "#64748b" }}>No file uploaded</span>
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
                          <td>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                onClick={() => handleStatusChange(app._id, "Accepted")}
                                className="btn btn-primary"
                                style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "green" }}
                                title="Accept"
                              >
                                <Check size={12} /> Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(app._id, "Rejected")}
                                className="btn btn-danger"
                                style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                                title="Reject"
                              >
                                <X size={12} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Sidebar Actions */}
        <aside style={styles.sidebarActions}>
          <div className="glass-card" style={styles.actionCard}>
            <h3 style={styles.actionCardTitle}>Application Status</h3>
            
            {error && (
              <div className="alert-banner alert-banner-error" style={{ fontSize: "0.85rem", padding: "0.75rem" }}>
                <Info size={14} />
                <span>{error}</span>
              </div>
            )}

            {applySuccess && (
              <div className="alert-banner alert-banner-success" style={{ fontSize: "0.85rem", padding: "0.75rem" }}>
                <CheckCircle size={14} />
                <span>Applied successfully!</span>
              </div>
            )}

            {!user ? (
              <div>
                <p style={styles.actionDesc}>Log in as a job seeker to submit your credentials for this role.</p>
                <Link to="/login" className="btn btn-primary" style={{ width: "100%" }}>
                  Login to Apply
                </Link>
              </div>
            ) : user.role === "user" ? (
              alreadyApplied ? (
                <div style={{ textAlign: "center" }}>
                  <div style={styles.checkIconWrapper}>
                    <CheckCircle size={32} color="#10b981" />
                  </div>
                  <p style={{ fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>Already Applied</p>
                  <p style={styles.actionDesc}>The recruiter is reviewing your submission. Monitor status in dashboard.</p>
                  <Link to="/dashboard" className="btn btn-secondary" style={{ width: "100%" }}>
                    Go to Applications
                  </Link>
                </div>
              ) : (
                <div>
                  <p style={styles.actionDesc}>
                    Submit application using your loaded candidate resume link.
                  </p>
                  {user.resume ? (
                    <div style={styles.resumeStatusBox}>
                      <FileText size={16} color="#6366f1" />
                      <span style={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis" }}>
                        Resume: {user.resume.split("/").pop()}
                      </span>
                    </div>
                  ) : (
                    <div style={styles.resumeWarningBox}>
                      <p style={{ color: "#f59e0b", fontSize: "0.8rem", fontWeight: 500 }}>
                        No resume uploaded! Click below to go to Dashboard profile to set your resume file.
                      </p>
                      <Link to="/profile" className="btn btn-secondary" style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.8rem", padding: "0.4rem" }}>
                        Upload Resume
                      </Link>
                    </div>
                  )}
                  <button
                    onClick={handleApply}
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "1rem" }}
                    disabled={!user.resume}
                  >
                    Submit Application
                  </button>
                </div>
              )
            ) : (
              <div style={{ textAlign: "center", color: "#94a3b8" }}>
                <p style={styles.actionDesc}>
                  You are logged in as a <strong>{user.role}</strong>. Applications are reserved for Candidate accounts.
                </p>
                {user.role === "recruiter" && (
                  <Link to="/recruiter" className="btn btn-secondary" style={{ width: "100%" }}>
                    Recruiter Console
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="glass-card" style={styles.aboutRecruiterCard}>
            <h4 style={{ color: "#fff", background: "none", WebkitTextFillColor: "unset", fontSize: "1rem", marginBottom: "0.75rem" }}>
              Listing Recruiter
            </h4>
            <p style={{ fontSize: "0.9rem", color: "#cbd5e1", fontWeight: 600 }}>
              {job.recruiter?.name || "Vetted Company Recruiter"}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              {job.recruiter?.email || "recruitment@careerflow.net"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginBottom: "2rem",
    fontWeight: 500,
    transition: "color 0.2s ease",
  },
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  detailsLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "2.5rem",
    alignItems: "start",
  },
  mainInfo: {
    display: "flex",
    flexDirection: "column",
  },
  headerBlock: {
    display: "flex",
    gap: "1.25rem",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  companyBadge: {
    width: "60px",
    height: "60px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "1.4rem",
    boxShadow: "0 6px 15px rgba(99, 102, 241, 0.3)",
  },
  jobTitle: {
    fontSize: "1.8rem",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  jobCompany: {
    color: "#a5b4fc",
    fontWeight: 600,
    fontSize: "1.05rem",
  },
  infoMeta: {
    display: "flex",
    gap: "2rem",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
    color: "#cbd5e1",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "1.5rem 0",
  },
  descriptionSection: {
    marginTop: "0.5rem",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#fff",
    marginBottom: "1rem",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  descriptionText: {
    color: "#cbd5e1",
    lineHeight: "1.7",
    fontSize: "0.98rem",
    whiteSpace: "pre-line",
  },
  downloadLink: {
    color: "#6366f1",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  sidebarActions: {
    position: "sticky",
    top: "90px",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  actionCard: {
    padding: "1.5rem",
  },
  actionCardTitle: {
    fontSize: "1.1rem",
    color: "#fff",
    marginBottom: "1rem",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  actionDesc: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    lineHeight: "1.5",
    marginBottom: "1.25rem",
  },
  checkIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "rgba(16, 185, 129, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  },
  resumeStatusBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    padding: "0.6rem 0.8rem",
    borderRadius: "8px",
    color: "#a5b4fc",
    marginBottom: "1rem",
  },
  resumeWarningBox: {
    background: "rgba(245, 158, 11, 0.08)",
    border: "1px solid rgba(245, 158, 11, 0.15)",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
  },
  aboutRecruiterCard: {
    padding: "1.25rem",
  },
};

// Add media queries in javascript
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 900px) {
    div[style*="detailsLayout"] {
      grid-template-columns: 1fr !important;
    }
    aside[style*="sidebarActions"] {
      position: relative !important;
      top: 0 !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Jobdetails;
