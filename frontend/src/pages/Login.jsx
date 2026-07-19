import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await API.post("/users/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      localStorage.setItem("token", res.data.access_token);

      navigate("/chat");
    } catch (err) {
      console.error(err);
      alert("Invalid Email or Password");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>🤖 DevPilot AI</h1>
        <p>Your Intelligent Coding Assistant</p>

        <form onSubmit={login}>

          <input
            className="login-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈 Hide Password" : "👁 Show Password"}
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="register-link">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}