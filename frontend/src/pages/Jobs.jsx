import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { BASE_URL } from "../services/api";
import { Search, MapPin, DollarSign, Briefcase, Filter, RefreshCw } from "lucide-react";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minSalary, setMinSalary] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (location) queryParams.append("location", location);
      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";

      const response = await fetch(`${BASE_URL}/jobs${query}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load jobs");
      }
      setJobs(data);
      setFilteredJobs(data);
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  // Apply salary filter locally
  useEffect(() => {
    let result = jobs;
    if (minSalary) {
      result = jobs.filter((job) => job.salary >= Number(minSalary));
    }
    setFilteredJobs(result);
  }, [minSalary, jobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (location) params.location = location;
    setSearchParams(params);
  };

  const handleReset = () => {
    setSearch("");
    setLocation("");
    setMinSalary("");
    setSearchParams({});
  };

  return (
    <div className="container fade-in" style={{ padding: "2.5rem 1rem" }}>
      <div style={styles.header}>
        <h1 style={styles.title}>Available Job Openings</h1>
        <p style={styles.subtitle}>Discover open careers matching your background</p>
      </div>

      <div style={styles.layout}>
        {/* Sidebar Filters */}
        <aside className="glass-card" style={styles.filterSidebar}>
          <div style={styles.sidebarHeader}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#fff" }}>
              <Filter size={18} color="#6366f1" /> Filters
            </span>
            <button onClick={handleReset} style={styles.resetBtn}>
              <RefreshCw size={12} /> Reset
            </button>
          </div>

          <form onSubmit={handleSearchSubmit}>
            <div className="form-group">
              <label className="form-label">Search Query</label>
              <div style={styles.inputWrapper}>
                <Search size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="Title, company..."
                  className="form-input"
                  style={styles.fieldInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <div style={styles.inputWrapper}>
                <MapPin size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  type="text"
                  placeholder="City or Remote"
                  className="form-input"
                  style={styles.fieldInput}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">Minimum Salary ($/yr)</label>
              <div style={styles.inputWrapper}>
                <DollarSign size={16} color="#64748b" style={styles.inputIcon} />
                <input
                  type="number"
                  placeholder="e.g. 80000"
                  className="form-input"
                  style={styles.fieldInput}
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Jobs Listing */}
        <section style={styles.jobsList}>
          {loading ? (
            <div style={styles.loadingSpinner}>
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="alert-banner alert-banner-error">
              <p>{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-card" style={styles.emptyState}>
              <Briefcase size={40} color="#64748b" style={{ marginBottom: "1rem" }} />
              <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>No matching jobs found</h3>
              <p style={{ color: "#94a3b8" }}>Try adjusting your filters or query parameter.</p>
              <button onClick={handleReset} className="btn btn-secondary" style={{ marginTop: "1rem" }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={styles.jobsGrid}>
              {filteredJobs.map((job) => (
                <div key={job._id} className="glass-card" style={styles.jobCard}>
                  <div style={styles.jobCardTop}>
                    <div style={styles.companyBadge}>
                      {job.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <p style={styles.jobCompany}>{job.company}</p>
                    </div>
                  </div>

                  <p style={styles.jobDesc}>
                    {job.description.length > 180 ? `${job.description.substring(0, 180)}...` : job.description}
                  </p>

                  <div style={styles.jobFooter}>
                    <div style={styles.footerMeta}>
                      <span style={styles.metaItem}>
                        <MapPin size={14} style={{ marginRight: 4 }} />
                        {job.location}
                      </span>
                      <span style={styles.metaItemSalary}>
                        ${job.salary?.toLocaleString()}/yr
                      </span>
                    </div>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm" style={styles.viewBtn}>
                      Details &amp; Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

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
  layout: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "2rem",
    alignItems: "start",
  },
  filterSidebar: {
    position: "sticky",
    top: "90px",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "0.75rem",
  },
  resetBtn: {
    background: "none",
    border: "none",
    color: "#6366f1",
    fontSize: "0.8rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    fontWeight: 600,
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
    paddingLeft: "36px",
    paddingTop: "0.6rem",
    paddingBottom: "0.6rem",
    fontSize: "0.9rem",
  },
  jobsList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    padding: "6rem 0",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  jobsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  jobCard: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  jobCardTop: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  companyBadge: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1.2rem",
    boxShadow: "0 4px 10px rgba(99, 102, 241, 0.2)",
  },
  jobTitle: {
    fontSize: "1.25rem",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  jobCompany: {
    color: "#a5b4fc",
    fontWeight: 500,
    fontSize: "0.95rem",
  },
  jobDesc: {
    color: "#cbd5e1",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
  jobFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "1rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  footerMeta: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  metaItem: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
  },
  metaItemSalary: {
    color: "#10b981",
    fontSize: "0.85rem",
    fontWeight: "600",
    background: "rgba(16, 185, 129, 0.08)",
    padding: "0.2rem 0.5rem",
    borderRadius: "6px",
  },
  viewBtn: {
    padding: "0.5rem 1.2rem",
    fontSize: "0.85rem",
  },
};

// Add responsive overrides to index.css
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 900px) {
    div[style*="layout"] {
      grid-template-columns: 1fr !important;
    }
    aside[style*="filterSidebar"] {
      position: relative !important;
      top: 0 !important;
      margin-bottom: 2rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Jobs;
