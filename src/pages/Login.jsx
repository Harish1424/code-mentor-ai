import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    if (!emailRegex.test(formData.email.trim())) {
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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setSuccess("Login successful! Redirecting to dashboard...");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="auth-wrapper">
        {/* LEFT SHOWCASE */}
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
              Accelerate your programming skills with real-time AI code reviews,
              beginner-friendly explanations, automated debugging, and personalized learning roadmaps.
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
                <p className="comment">// Instant feedback. Zero friction.</p>
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

        {/* RIGHT AUTH CARD */}
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
            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="login-email">Email Address</label>
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

            {/* PASSWORD */}
            <div className="input-group">
              <div className="label-row">
                <label htmlFor="login-password">Password</label>
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
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
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
            🔒 Safe & secure local authentication with JWT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
