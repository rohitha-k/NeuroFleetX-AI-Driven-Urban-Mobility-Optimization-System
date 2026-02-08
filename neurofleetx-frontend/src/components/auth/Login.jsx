
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ChevronRight, User } from "lucide-react";
import { apiRequest } from "../../api/api";
import { saveAuth } from "../../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "ADMIN" // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);



  const roles = [
    { value: "ADMIN", label: "Admin" },
    { value: "MANAGER", label: "Fleet Manager" }, // Fixed value
    { value: "DRIVER", label: "Driver" },
    { value: "CUSTOMER", label: "Customer" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Real API Call
      const data = await apiRequest("/api/auth/login", "POST", {
        email: formData.email,
        password: formData.password
      });

      const role = data.role.toUpperCase(); // Normalize role to Uppercase
      const token = data.token;

      // Create a user object to store
      const user = {
        id: data.userId || data.id,
        name: data.name,
        role: role
      };

      saveAuth(token, user);
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_role", role);

      // Navigate based on normalized role
      if (role === "ADMIN") navigate("/admin");
      else if (role === "MANAGER") navigate("/manager");
      else if (role === "DRIVER") navigate("/driver");
      else navigate("/customer");

    } catch (err) {
      setError(err?.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[100%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-[50%] -right-[20%] w-[100%] h-[100%] rounded-full bg-purple-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-bold text-white">N</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to access your fleet dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selector */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Select Role</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-800/80"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value} className="bg-gray-800 text-white">
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8">
          &copy; 2026 NeuroFleetX AI. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
