import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Login.css";
import Prism from "../components/Prism";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("before api call");

    axios
      .post(`${import.meta.env.VITE_BACKENDURL}/auth/login`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("after api call");
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", user);

        // navigate based on role
        if (user.role === "admin") navigate("/admin/dashboard");
        else navigate("/applicant/home");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.response?.data?.message || "Invalid credentials");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-container">
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

      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to access your account</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
