import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Jobdetails from "./pages/Jobdetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Userdashboard from "./pages/Userdashboard";
import Recruiterdashboard from "./pages/Recruiterdashboard";
import Adminpanel from "./pages/Adminpanel";
import ProtectedRoute from "./components/Protectedroute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="main-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<Jobdetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Candidate Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Userdashboard />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Routes */}
              <Route
                path="/recruiter"
                element={
                  <ProtectedRoute allowedRoles={["recruiter"]}>
                    <Recruiterdashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Adminpanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
