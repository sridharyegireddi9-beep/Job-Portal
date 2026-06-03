import React from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.branding}>
          <div style={styles.logo}>
            <Briefcase size={22} color="#6366f1" />
            <span style={styles.logoText}>Career<span style={{ color: "#6366f1" }}>Flow</span></span>
          </div>
          <p style={styles.desc}>
            Empowering professionals to discover matching opportunities and recruiters to hire top talent worldwide.
          </p>
        </div>

        <div style={styles.linksSection}>
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>For Candidates</h4>
            <Link to="/jobs" style={styles.link}>Browse Jobs</Link>
            <Link to="/dashboard" style={styles.link}>Candidate Dashboard</Link>
            <Link to="/profile" style={styles.link}>Upload Resume</Link>
          </div>
          
          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>For Employers</h4>
            <Link to="/recruiter" style={styles.link}>Recruiter Portal</Link>
            <Link to="/recruiter" style={styles.link}>Post a Job</Link>
            <Link to="/recruiter" style={styles.link}>Talent Search</Link>
          </div>

          <div style={styles.linksCol}>
            <h4 style={styles.colTitle}>Company</h4>
            <a href="#about" style={styles.link}>About Us</a>
            <a href="#contact" style={styles.link}>Contact Support</a>
            <a href="#privacy" style={styles.link}>Privacy Policy</a>
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <div className="container" style={styles.bottomBarContainer}>
          <p style={styles.copy}>
            &copy; {new Date().getFullYear()} CareerFlow Job Portal. All rights reserved.
          </p>
          <p style={styles.meta}>
            Built with MERN Stack &amp; Native Fetch API.
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: "rgba(10, 15, 30, 0.8)",
    borderTop: "1px solid rgba(99, 102, 241, 0.1)",
    padding: "4rem 0 0 0",
    color: "#94a3b8",
    fontSize: "0.9rem",
    marginTop: "auto",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "3rem",
    paddingBottom: "3rem",
  },
  branding: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "350px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoText: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#fff",
  },
  desc: {
    lineHeight: "1.6",
    color: "#64748b",
  },
  linksSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
  },
  linksCol: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  colTitle: {
    color: "#f8fafc",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
  },
  link: {
    color: "#94a3b8",
    transition: "color 0.2s ease",
  },
  bottomBar: {
    background: "rgba(5, 7, 15, 0.9)",
    padding: "1.5rem 0",
    borderTop: "1px solid rgba(255, 255, 255, 0.03)",
  },
  bottomBarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  copy: {
    color: "#475569",
    fontSize: "0.85rem",
  },
  meta: {
    color: "#475569",
    fontSize: "0.85rem",
  },
};

// Add responsive adjustments for footer to index.css
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @media (max-width: 768px) {
    footer div[style*="container"] {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }
    footer div[style*="linksSection"] {
      grid-template-columns: 1fr 1fr !important;
      gap: 1.5rem !important;
    }
  }
  @media (max-width: 480px) {
    footer div[style*="linksSection"] {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Footer;
