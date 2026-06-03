const BASE_URL = "http://localhost:5000/api";

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If the body is FormData (for uploads), do NOT set Content-Type header.
  // The browser will automatically set it with the correct boundary.
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  // Auth API
  auth: {
    login: (email, password) => 
      apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      }),
      
    register: (name, email, password, role) =>
      apiFetch("/auth/register", {
        method: "POST",
        body: { name, email, password, role },
      }),
      
    updateProfile: (formData) =>
      apiFetch("/auth/profile", {
        method: "PUT",
        body: formData, // This is a FormData object containing file + other fields
      }),
  },

  // Jobs API
  jobs: {
    getAll: (search = "", location = "") => {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (location) queryParams.append("location", location);
      const query = queryParams.toString() ? `?${queryParams.toString()}` : "";
      return apiFetch(`/jobs${query}`, { method: "GET" });
    },
    
    getById: (id) => 
      apiFetch(`/jobs/${id}`, { method: "GET" }),
      
    create: (jobData) =>
      apiFetch("/jobs", {
        method: "POST",
        body: jobData,
      }),
      
    update: (id, jobData) =>
      apiFetch(`/jobs/${id}`, {
        method: "PUT",
        body: jobData,
      }),
      
    delete: (id) =>
      apiFetch(`/jobs/${id}`, { method: "DELETE" }),
  },

  // Applications API
  applications: {
    apply: (jobId) =>
      apiFetch("/applications", {
        method: "POST",
        body: { jobId },
      }),
      
    getAll: () => 
      apiFetch("/applications", { method: "GET" }),
      
    updateStatus: (id, status) =>
      apiFetch(`/applications/${id}`, {
        method: "PUT",
        body: { status },
      }),
  },

  // Admin API
  admin: {
    getUsers: () => 
      apiFetch("/admin/users", { method: "GET" }),
      
    deleteUser: (id) =>
      apiFetch(`/admin/user/${id}`, { method: "DELETE" }),
      
    deleteJob: (id) =>
      apiFetch(`/admin/job/${id}`, { method: "DELETE" }),
  },
};
