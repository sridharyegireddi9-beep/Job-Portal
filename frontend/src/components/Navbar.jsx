import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { Briefcase, User, LogOut, LogIn, Menu, X, Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="nav-bar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <Briefcase size={28} color="#6366f1" />
          <span className="nav-logo-text">CareerFlow</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-desktop-menu">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Jobs
          </NavLink>

          {user ? (
            <>
              {user.role === "user" && (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    My Applications
                  </NavLink>
                  <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                    Profile
                  </NavLink>
                </>
              )}
              {user.role === "recruiter" && (
                <NavLink to="/recruiter" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  Recruiter Console
                </NavLink>
              )}
              {user.role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Shield size={16} style={{ marginRight: 4, verticalAlign: "middle" }} />
                  Admin Panel
                </NavLink>
              )}
              
              <div className="nav-user-info">
                <span className="nav-username">Hi, {user.name.split(" ")[0]}</span>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
                <LogIn size={14} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="nav-mobile-drawer fade-in">
          <Link to="/" className="nav-mobile-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/jobs" className="nav-mobile-link" onClick={() => setIsOpen(false)}>Jobs</Link>

          {user ? (
            <>
              {user.role === "user" && (
                <>
                  <Link to="/dashboard" className="nav-mobile-link" onClick={() => setIsOpen(false)}>My Applications</Link>
                  <Link to="/profile" className="nav-mobile-link" onClick={() => setIsOpen(false)}>Profile</Link>
                </>
              )}
              {user.role === "recruiter" && (
                <Link to="/recruiter" className="nav-mobile-link" onClick={() => setIsOpen(false)}>Recruiter Console</Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin" className="nav-mobile-link" onClick={() => setIsOpen(false)}>Admin Panel</Link>
              )}
              
              <div className="nav-mobile-user-info">
                <span className="nav-mobile-username">Logged in as: {user.name}</span>
                <button onClick={handleLogout} className="btn btn-danger" style={{ width: "100%", marginTop: "0.5rem" }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
              <Link to="/login" className="btn btn-secondary" style={{ width: "100%" }} onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ width: "100%" }} onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
