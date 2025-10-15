import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import "./styles/Signup.css";
import Prism from "../components/Prism";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await API.post("/auth/signup", formData);
      setMessage(res.data.message || "Signup successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="signup-container">
      <Prism
        animationType="rotate"
        timeScale={0.6}
        height={3.5}
        baseWidth={5.5}
        scale={3}
        hueShift={0}
        colorFrequency={1}
        noise={0}
        glow={1}
      />

      <div className="signup-card">
        <h2>Create Account ✨</h2>
        <p>Join us and start your journey</p>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            required
          />

          <label>Role</label>
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="applicant">Applicant</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
