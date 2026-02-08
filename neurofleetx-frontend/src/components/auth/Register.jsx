
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ChevronRight, User, Phone, BadgeCheck } from "lucide-react";
import { apiRequest } from "../../api/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "CUSTOMER", // Default to Customer (Fixed key to match backend)
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: "ADMIN", label: "Admin" }, // Added Admin as requested
    { value: "MANAGER", label: "Fleet Manager" },
    { value: "DRIVER", label: "Driver" },
    { value: "CUSTOMER", label: "Customer" }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Valudation
    if (!formData.full_name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      await apiRequest("/api/auth/register", "POST", {
        name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      alert("Registration successful! Please login.");
      navigate("/");

    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-900 overflow-hidden py-10">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 mb-4 shadow-lg shadow-indigo-500/30">
              <span className="text-2xl font-bold text-white">N</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 mt-2">Join NeuroFleetX today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selector */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">I am a...</label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-gray-800/80"
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

            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                name="full_name"
                type="text"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                name="phone"
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                name="password"
                type="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
