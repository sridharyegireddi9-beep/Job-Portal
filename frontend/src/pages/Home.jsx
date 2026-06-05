import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { BASE_URL } from "../services/api";
import { Search, MapPin, TrendingUp, Users, Building, CheckCircle, ArrowRight, Code, Paintbrush, Megaphone, Laptop } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/jobs`);
        const jobs = await response.json();
        if (!response.ok) {
          throw new Error(jobs.message || "Failed to load featured jobs");
        }
        // Display only the first 3 jobs as featured
        setFeaturedJobs(jobs.slice(0, 3));
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (locationQuery) params.append("location", locationQuery);
    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { title: "Software Engineering", count: "120+ Jobs", icon: <Code size={24} color="#6366f1" /> },
    { title: "Product & UI/UX Design", count: "80+ Jobs", icon: <Paintbrush size={24} color="#ec4899" /> },
    { title: "Marketing & Growth", count: "45+ Jobs", icon: <Megaphone size={24} color="#10b981" /> },
    { title: "IT & Cloud Ops", count: "90+ Jobs", icon: <Laptop size={24} color="#f59e0b" /> },
  ];

  return (
    <div className="container fade-in" style={{ padding: "3rem 1rem" }}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.badgeBanner}>
            <span className="badge badge-role">New</span>
            <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>Explore 500+ remote opportunities added today</span>
          </div>
          <h1 style={styles.heroTitle}>
            Discover Your Next <br />
            <span style={styles.titleGradient}>Professional Milestone</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Browse validated tech, design, marketing, and sales listings posted by premium global teams. Match your skills with great salaries.
          </p>

          <form onSubmit={handleSearch} style={styles.searchBar}>
            <div style={styles.searchInputWrapper}>
              <Search size={20} color="#64748b" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Job title, keywords, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.inputField}
              />
            </div>
            <div style={styles.searchInputWrapper}>
              <MapPin size={20} color="#64748b" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="City, country, or Remote"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                style={styles.inputField}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={styles.searchBtn}>
              Find Jobs
            </button>
          </form>

          <div style={styles.popularTags}>
            <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Popular search:</span>
            <span style={styles.tag} onClick={() => setSearchQuery("React")}>React</span>
            <span style={styles.tag} onClick={() => setSearchQuery("Node")}>Node</span>
            <span style={styles.tag} onClick={() => setSearchQuery("Designer")}>Designer</span>
            <span style={styles.tag} onClick={() => setSearchQuery("Manager")}>Product Manager</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection} className="glass-card">
        <div style={styles.statItem}>
          <TrendingUp size={28} color="#6366f1" />
          <div>
            <h3 style={styles.statNumber}>12,480+</h3>
            <p style={styles.statLabel}>Active Listings</p>
          </div>
        </div>
        <div style={styles.statItem}>
          <Users size={28} color="#a855f7" />
          <div>
            <h3 style={styles.statNumber}>45,000+</h3>
            <p style={styles.statLabel}>Candidates Placed</p>
          </div>
        </div>
        <div style={styles.statItem}>
          <Building size={28} color="#10b981" />
          <div>
            <h3 style={styles.statNumber}>800+</h3>
            <p style={styles.statLabel}>Vetted Companies</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ marginBottom: "5rem" }}>
        <h2 style={styles.sectionHeader}>Explore by Industry</h2>
        <p style={styles.sectionSub}>Find the department that fits your career path</p>
        <div className="grid-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-card" style={styles.categoryCard}>
              <div style={styles.categoryIcon}>{cat.icon}</div>
              <h3 style={styles.categoryTitle}>{cat.title}</h3>
              <div style={styles.categoryFooter}>
                <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{cat.count}</span>
                <span style={styles.categoryLink}>
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={styles.jobsHeader}>
          <div>
            <h2 style={{ ...styles.sectionHeader, marginBottom: 0 }}>Featured Job Roles</h2>
            <p style={styles.sectionSub}>High priority placements accepting submissions now</p>
          </div>
          <Link to="/jobs" className="btn btn-secondary">
            View All Jobs
          </Link>
        </div>

        {loading ? (
          <div style={styles.loadingSpinner}>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="glass-card" style={{ textAlignment: "center", padding: "3rem" }}>
            <p style={{ color: "#94a3b8" }}>No job opportunities available currently.</p>
            {user?.role === "recruiter" && (
              <Link to="/recruiter" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Post a Job Now
              </Link>
            )}
          </div>
        ) : (
          <div className="grid-3">
            {featuredJobs.map((job) => (
              <div key={job._id} className="glass-card" style={styles.jobCard}>
                <div style={styles.jobCardHeader}>
                  <div style={styles.companyBadge}>
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={styles.jobCardTitle}>{job.title}</h3>
                    <p style={styles.jobCardCompany}>{job.company}</p>
                  </div>
                </div>
                <p style={styles.jobCardDesc}>
                  {job.description.length > 120 ? `${job.description.substring(0, 120)}...` : job.description}
                </p>
                <div style={styles.jobCardMeta}>
                  <span style={styles.jobCardLocation}>
                    <MapPin size={14} style={{ marginRight: 4 }} />
                    {job.location}
                  </span>
                  <span style={styles.jobCardSalary}>
                    ${job.salary?.toLocaleString()}/yr
                  </span>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn btn-primary" style={{ width: "100%" }}>
                  Details &amp; Apply
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA section */}
      <section className="glass-card" style={styles.ctaBanner}>
        <h2 style={styles.ctaTitle}>Ready to Accelerate Your Career?</h2>
        <p style={styles.ctaDesc}>
          Join thousands of vetted engineers, developers, and designers who matched with high growth teams on CareerFlow.
        </p>
        <div style={styles.ctaButtons}>
          {user ? (
            user.role === "recruiter" ? (
              <Link to="/recruiter" className="btn btn-primary">
                Go to Recruiter Dashboard
              </Link>
            ) : (
              <Link to="/jobs" className="btn btn-primary">
                Browse Vetted Jobs
              </Link>
            )
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Register Candidate Profile
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Recruiter Portal Login
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

const styles = {
  heroSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "3rem 0 4rem 0",
  },
  heroContent: {
    maxWidth: "800px",
    width: "100%",
  },
  badgeBanner: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    padding: "0.4rem 1rem",
    borderRadius: "9999px",
    marginBottom: "1.5rem",
  },
  heroTitle: {
    fontSize: "3.2rem",
    lineHeight: "1.15",
    marginBottom: "1.5rem",
    fontWeight: "800",
  },
  titleGradient: {
    background: "linear-gradient(135deg, #a5b4fc 0%, #6366f1 40%, #a855f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "1.15rem",
    lineHeight: "1.6",
    color: "#94a3b8",
    marginBottom: "2.5rem",
  },
  searchBar: {
    background: "rgba(15, 22, 42, 0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "16px",
    padding: "0.6rem",
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 120px",
    gap: "0.5rem",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
    marginBottom: "1.5rem",
  },
  searchInputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "rgba(10, 15, 30, 0.4)",
    borderRadius: "10px",
    padding: "0 1rem",
    border: "1px solid rgba(255, 255, 255, 0.03)",
  },
  searchIcon: {
    flexShrink: 0,
  },
  inputField: {
    background: "transparent",
    border: "none",
    padding: "0.8rem 0.5rem",
    color: "#fff",
    width: "100%",
    fontSize: "0.95rem",
    outline: "none",
  },
  searchBtn: {
    padding: "0.8rem",
    borderRadius: "10px",
  },
  popularTags: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
    marginTop: "1rem",
  },
  tag: {
    fontSize: "0.8rem",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    color: "#cbd5e1",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    textAlign: "center",
    margin: "0 auto 5rem auto",
    maxWidth: "900px",
    gap: "2rem",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  statNumber: {
    fontSize: "1.6rem",
    fontWeight: "800",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "0.85rem",
    marginTop: "0.1rem",
  },
  sectionHeader: {
    fontSize: "1.8rem",
    marginBottom: "0.5rem",
  },
  sectionSub: {
    color: "#94a3b8",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },
  categoryCard: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    cursor: "pointer",
  },
  categoryIcon: {
    background: "rgba(255, 255, 255, 0.03)",
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  categoryTitle: {
    fontSize: "1.1rem",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  categoryFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.5rem",
  },
  categoryLink: {
    color: "#6366f1",
    fontWeight: 600,
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  jobsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "2rem",
  },
  jobCard: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  jobCardHeader: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  companyBadge: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1.1rem",
    boxShadow: "0 4px 10px rgba(99, 102, 241, 0.3)",
  },
  jobCardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#fff",
    background: "none",
    WebkitTextFillColor: "unset",
  },
  jobCardCompany: {
    color: "#a5b4fc",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  jobCardDesc: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    lineHeight: "1.5",
    marginBottom: "1.25rem",
    flexGrow: 1,
  },
  jobCardMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "1rem",
    marginBottom: "1.25rem",
  },
  jobCardLocation: {
    color: "#64748b",
    fontSize: "0.85rem",
    display: "flex",
    alignItems: "center",
  },
  jobCardSalary: {
    color: "#10b981",
    fontSize: "0.85rem",
    fontWeight: "600",
    background: "rgba(16, 185, 129, 0.08)",
    padding: "0.25rem 0.5rem",
    borderRadius: "6px",
  },
  loadingSpinner: {
    display: "flex",
    justifyContent: "center",
    padding: "4rem 0",
  },
  ctaBanner: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "linear-gradient(135deg, rgba(15, 22, 42, 0.8) 0%, rgba(88, 28, 135, 0.2) 100%)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
  },
  ctaTitle: {
    fontSize: "2.2rem",
    marginBottom: "1rem",
  },
  ctaDesc: {
    color: "#cbd5e1",
    maxWidth: "600px",
    margin: "0 auto 2rem auto",
    lineHeight: "1.6",
    fontSize: "1.05rem",
  },
  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
};

// Add responsive stylesheet overrides for Home page,
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 768px) {
    section[style*="heroSection"] h1 {
      font-size: 2.2rem !important;
    }
    form[style*="searchBar"] {
      grid-template-columns: 1fr !important;
      padding: 1rem !important;
      gap: 0.75rem !important;
    }
    section[style*="statsSection"] {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
      padding: 1.5rem !important;
    }
    div[style*="jobsHeader"] {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 1rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Home;