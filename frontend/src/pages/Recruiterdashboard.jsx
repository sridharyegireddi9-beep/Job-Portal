import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL, BACKEND_URL } from "../services/api";
import { Briefcase, FileText, Send, UserCheck, Trash2, Edit3, Calendar, MapPin, DollarSign, PlusCircle, CheckCircle, Check, X, AlertCircle } from "lucide-react";

const Recruiterdashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "post" | "applications"
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Job creation form fields
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [submittingJob, setSubmittingJob] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const appsRes = await fetch(`${BASE_URL}/applications`, { headers });
      const appsData = await appsRes.json();
      if (!appsRes.ok) {
        throw new Error(appsData.message || "Failed to load applications");
      }
      setApplications(appsData);

      const jobsRes = await fetch(`${BASE_URL}/jobs`, { headers });
      const allJobs = await jobsRes.json();
      if (!jobsRes.ok) {
        throw new Error(allJobs.message || "Failed to load jobs");
      }

      const cachedUser = JSON.parse(localStorage.getItem("user"));
      const recruiterId = cachedUser?._id;

      const recruiterJobs = allJobs.filter((job) => {
        const rId = job.recruiter?._id || job.recruiter;
        return rId === recruiterId;
      });
      setJobs(recruiterJobs);
    } catch (err) {
      setError(err.message || "Failed to load recruiter data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!title || !company || !location || !salary || !description) {
      setError("Please fill in all fields");
      return;
    }

    setSubmittingJob(true);
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title,
          company,
          location,
          salary: Number(salary),
          description,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to post job");
      }

      setSuccess("Job listing created successfully!");
      // Reset form
      setTitle("");
      setCompany("");
      setLocation("");
      setSalary("");
      setDescription("");

      // Re-fetch data and switch to jobs tab
      await fetchData();
      setTimeout(() => {
        setActiveTab("jobs");
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to post job");
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const response = await fetch(`${BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job");
      }
      setSuccess("Job listing deleted successfully!");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete job: " + err.message);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(`${BASE_URL}/applications/${appId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }
      setSuccess(`Application marked as ${newStatus}`);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update status: " + err.message);
    }
  };

  const metrics = {
    jobsCount: jobs.length,
    applicantsCount: applications.length,
    acceptedOffers: applications.filter(a => a.status === "Accepted").length,
  };

  return (
    <div className="container fade-in" style={{ padding: "2.5rem 1rem" }}>
      <div style={styles.header}>
        <h1 style={styles.title}>Recruiter Management Console</h1>
        <p style={styles.subtitle}>Track job postings, receive resumes, and update application pipelines</p>
      </div>

      {/* Metrics Cards */}
      <section style={styles.metricsGrid}>
        <div className="glass-card" style={styles.metricCard}>
          <Briefcase size={24} color="#6366f1" />
          <div>
            <h3 style={styles.metricNumber}>{metrics.jobsCount}</h3>
            <p style={styles.metricLabel}>Jobs Posted</p>
          </div>
        </div>
        
        <div className="glass-card" style={styles.metricCard}>
          <FileText size={24} color="#a855f7" />
          <div>
            <h3 style={styles.metricNumber}>{metrics.applicantsCount}</h3>
            <p style={styles.metricLabel}>Total Applications</p>
          </div>
        </div>

        <div className="glass-card" style={styles.metricCard}>
          <UserCheck size={24} color="#10b981" />
          <div>
            <h3 style={styles.metricNumber}>{metrics.acceptedOffers}</h3>
            <p style={styles.metricLabel}>Offers Extended</p>
          </div>
        </div>
      </section>

      {/* Action Messages */}
      {success && (
        <div className="alert-banner alert-banner-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert-banner alert-banner-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Dashboard Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          My Posted Jobs
        </button>
        <button
          className={`tab-btn ${activeTab === "post" ? "active" : ""}`}
          onClick={() => setActiveTab("post")}
        >
          Post a New Job
        </button>
        <button
          className={`tab-btn ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          Review Submissions ({applications.length})
        </button>
      </div>

      {/* Tab Panels */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          {/* My Posted Jobs */}
          {activeTab === "jobs" && (
            <div>
              {jobs.length === 0 ? (
                <div className="glass-card" style={styles.emptyState}>
                  <Briefcase size={40} color="#64748b" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>No jobs posted yet</h3>
                  <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Publish job opportunities to gather candidate profiles.</p>
                  <button onClick={() => setActiveTab("post")} className="btn btn-primary">
                    <PlusCircle size={16} /> Post First Job
                  </button>
                </div>
              ) : (
                <div style={styles.jobsListGrid}>
                  {jobs.map((job) => {
                    const jobApps = applications.filter((app) => app.job?._id === job._id);
                    return (
                      <div key={job._id} className="glass-card" style={styles.jobListItem}>
                        <div style={styles.jobItemDetails}>
                          <h3 style={styles.jobItemTitle}>{job.title}</h3>
                          <div style={styles.jobItemMeta}>
                            <span style={styles.metaRow}>
                              <MapPin size={14} color="#64748b" /> {job.location}
                            </span>
                            <span style={styles.metaRow}>
                              <DollarSign size={14} color="#10b981" /> ${job.salary?.toLocaleString()}/yr
                            </span>
                            <span style={styles.metaRow}>
                              <Calendar size={14} color="#64748b" /> {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div style={styles.jobItemActions}>
                          <Link to={`/jobs/${job._id}`} className="btn btn-secondary" style={styles.actionBtn}>
                            Applicants Portal ({jobApps.length})
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="btn btn-danger"
                            style={{ ...styles.actionBtn, padding: "0.6rem 1rem" }}
                            title="Delete listing"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Post a New Job */}
          {activeTab === "post" && (
            <div className="glass-card" style={{ maxWidth: "700px", margin: "0 auto" }}>
              <h2 style={styles.formTitle}>Job Posting Form</h2>
              <form onSubmit={handlePostJob}>
                <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Senior React Developer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Stripe"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salary (USD / year)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 120000"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "2rem" }}>
                  <label className="form-label">Detailed Job Description</label>
                  <textarea
                    className="form-input"
                    placeholder="Provide details about requirements, benefits, tech stack, and day-to-day responsibilities..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    style={{ resize: "vertical" }}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={submittingJob}>
                  <Send size={16} /> {submittingJob ? "Publishing listing..." : "Publish Job Listing"}
                </button>
              </form>
            </div>
          )}

          {/* Review Submissions */}
          {activeTab === "applications" && (
            <div>
              {applications.length === 0 ? (
                <div className="glass-card" style={styles.emptyState}>
                  <FileText size={40} color="#64748b" style={{ marginBottom: "1rem" }} />
                  <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>No submissions yet</h3>
                  <p style={{ color: "#94a3b8" }}>Applications will appear here when candidates submit to your listings.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Applied Role</th>
                        <th>Resume</th>
                        <th>Submitted On</th>
                        <th>Status</th>
                        <th>Pipeline Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id}>
                          <td>
                            <div style={{ fontWeight: 600, color: "#fff" }}>{app.user?.name || "Deleted Candidate"}</div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{app.user?.email || "N/A"}</div>
                          </td>
                          <td>
                            <Link to={`/jobs/${app.job?._id}`} style={styles.jobLink}>
                              {app.job?.title || "Deleted Job Listing"}
                            </Link>
                          </td>
                          <td>
                            {app.resume ? (
                              <a
                                href={`${BACKEND_URL}${app.resume}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.downloadLink}
                              >
                                <FileCheck size={16} style={{ marginRight: 4 }} /> View Document
                              </a>
                            ) : (
                              <span style={{ color: "#64748b" }}>No file loaded</span>
                            )}
                          </td>
                          <td style={{ color: "#94a3b8" }}>
                            {new Date(app.createdAt).toLocaleDateString()}
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
                                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", background: "green" }}
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                onClick={() => handleStatusChange(app._id, "Rejected")}
                                className="btn btn-danger"
                                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                              >
                                <X size={14} /> Reject
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
        </div>
      )}
    </div>
  );
};

// Simple icon representation wrapper for compiler safety
const FileCheck = ({ size, style }) => <FileText size={size} style={style} />;

const styles = {
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
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  jobsListGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  jobListItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.5rem",
    flexWrap: "wrap",
    gap: "1.5rem",
  },
  jobItemDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  jobItemTitle: {
    fontSize: "1.2rem",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  jobItemMeta: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  metaRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    fontSize: "0.85rem",
    color: "#94a3b8",
  },
  jobItemActions: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  actionBtn: {
    padding: "0.5rem 1rem",
    fontSize: "0.85rem",
  },
  formTitle: {
    fontSize: "1.3rem",
    color: "#fff",
    marginBottom: "1.5rem",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  downloadLink: {
    color: "#6366f1",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    fontSize: "0.9rem",
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
    div[style*="jobListItem"] {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 1rem !important;
    }
    div[style*="jobListItem"] div[style*="jobItemActions"] {
      width: 100% !important;
      justify-content: space-between !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Recruiterdashboard;
