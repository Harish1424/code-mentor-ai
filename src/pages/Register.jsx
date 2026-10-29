
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { API_BASE_URL } from "../api";

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
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
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
    const email = formData.email.trim();

    if (!email) {
      setError("Please enter your email address.");
      return false;
    }

    if (!emailRegex.test(email)) {
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
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `The server returned an unexpected response (HTTP ${response.status}). Check the API URL and backend logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      // If the backend returns a token and user, sign in automatically.
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setSuccess("Account created successfully! Redirecting...");

        navigate("/dashboard", { replace: true });
      } else {
        // If registration does not return a token,
        // ask the user to log in after creating the account.
        setSuccess(
          "Account created successfully! Redirecting to sign in..."
        );

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      }
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message || "Registration failed. Please try again."
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
              Start Your <span>Coding Journey.</span>
            </h2>

            <p className="showcase-description">
              Join developers using Code Mentor AI to master programming,
              fix errors faster, and prepare for software engineering roles.
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
                  <span className="green">
                    "Ready to build anything"
                  </span>;
                </p>

                <p>{"}"}</p>

                <p className="comment">
                  // Your AI mentor is ready 24/7.
                </p>
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

        {/* Right Authentication Card */}
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
            {/* Full Name */}
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

            {/* Email */}
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

            {/* Password */}
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
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>

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
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
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

            {/* Submit */}
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
            🔒 Your account information is handled securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
