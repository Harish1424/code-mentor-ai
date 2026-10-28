import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return false;
    }

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
      setError("Please create a password.");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }

    if (!formData.confirmPassword) {
      setError("Please confirm your password.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
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
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Account created successfully! Redirecting to dashboard...");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 600);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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
              Start Your <span>Coding Journey.</span>
            </h2>

            <p className="showcase-description">
              Join thousands of developers using Code Mentor AI to master programming,
              fix errors faster, and prepare for high-impact software engineering roles.
            </p>

            <div className="code-window">
              <div className="window-header">
                <span></span>
                <span></span>
                <span></span>
                <p>student.js</p>
              </div>

              <div className="code-content">
                <p>
                  <span className="purple">function</span>{" "}
                  <span className="blue">levelUp</span>() {"{"}
                </p>
                <p style={{ paddingLeft: "20px" }}>
                  <span className="purple">return</span>{" "}
                  <span className="green">"Ready to build anything"</span>;
                </p>
                <p>{"}"}</p>
                <p className="comment">// Your AI mentor is ready 24/7.</p>
              </div>
            </div>

            <div className="feature-mini-list">
              <div>
                <span>✦</span> Instant Code Feedback
              </div>
              <div>
                <span>✦</span> Structured Learning Paths
              </div>
              <div>
                <span>✦</span> Practice Interview Questions
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AUTH CARD */}
        <div className="auth-card">
          <div className="auth-header">
            <div className="welcome-icon">✨</div>
            <h2>Create Account</h2>
            <p>Start your learning journey with CodeMentor AI</p>
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
            {/* FULL NAME */}
            <div className="input-group">
              <label htmlFor="register-name">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="register-email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="register-email"
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
              <label htmlFor="register-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
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

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label htmlFor="register-confirm-password">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
              id="register-submit-button"
            >
              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already registered?</span>
          </div>

          <p className="switch-auth">
            Already have an account?{" "}
            <Link to="/login" id="to-login-link">
              Sign in instead
            </Link>
          </p>

          <p className="secure-note">
            🔒 By creating an account, your data stays local and private.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
