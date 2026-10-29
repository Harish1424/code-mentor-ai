
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { API_BASE_URL } from "../api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Please enter your email address.");
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `The server returned an unexpected response (HTTP ${response.status}). Check the backend URL and deployment logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token || !data.user) {
        throw new Error(
          "The server response is missing login information. Please check the backend login API."
        );
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting to dashboard...");

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="auth-wrapper">
        {/* Left Showcase */}
        <div className="auth-showcase">
          <div className="brand">
            <div className="brand-icon">🤖</div>

            <div>
              <h1>Code Mentor AI</h1>
              <span>Intelligent Programming Assistant</span>
            </div>
          </div>

          <div className="showcase-content">
            <h2>
              Learn Faster. <span>Build Better.</span>
            </h2>

            <p className="showcase-description">
              Accelerate your programming skills with real-time AI
              code reviews, beginner-friendly explanations,
              automated debugging, and personalized learning roadmaps.
            </p>

            <div className="code-window">
              <div className="window-header">
                <span></span>
                <span></span>
                <span></span>
                <p>mentor.js</p>
              </div>

              <div className="code-content">
                <p>
                  <span className="purple">const</span>{" "}
                  <span className="blue">mentor</span> ={" "}
                  <span className="green">CodeMentorAI</span>;
                </p>

                <p>
                  <span className="purple">await</span>{" "}
                  <span className="blue">mentor</span>.
                  <span className="purple">review</span>(yourCode);
                </p>

                <p className="comment">
                  // Instant feedback. Zero friction.
                </p>
              </div>
            </div>

            <div className="feature-mini-list">
              <div>
                <span>✓</span> AI Code Review
              </div>

              <div>
                <span>✓</span> Code Explanation
              </div>

              <div>
                <span>✓</span> Smart Debugging
              </div>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="welcome-icon">🔑</div>
            <h2>Welcome back</h2>
            <p>Sign in to continue to CodeMentor AI</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="auth-success" role="status">
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="input-group">
              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="label-row">
                <label htmlFor="login-password">
                  Password
                </label>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
              id="login-submit-button"
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to CodeMentor?</span>
          </div>

          <p className="switch-auth">
            Don't have an account?{" "}
            <Link to="/register" id="to-register-link">
              Create an account
            </Link>
          </p>

          <p className="secure-note">
            🔒 Secure authentication with JWT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
