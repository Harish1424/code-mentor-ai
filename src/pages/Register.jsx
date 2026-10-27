
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="auth-container">

        {/* LEFT SIDE */}
        <div className="auth-brand">

          <div className="brand-logo">
            <span>&lt;/&gt;</span>
          </div>

          <h1>
            Code<span>Mentor</span>
          </h1>

          <p className="brand-tagline">
            Build smarter. Code better.
          </p>

          <div className="code-preview">
            <div className="code-header">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="code-body">
              <p>
                <span className="purple">function</span>{" "}
                <span className="blue">learn</span>() {"{"}
              </p>

              <p className="indent">
                <span className="purple">return</span>{" "}
                <span className="green">"Keep coding!"</span>;
              </p>

              <p>{"}"}</p>

              <p className="comment">
                // Your AI mentor is always ready.
              </p>
            </div>
          </div>

          <div className="feature-list">
            <div>
              <span>✦</span>
              Learn from your code
            </div>

            <div>
              <span>✦</span>
              Find and fix bugs faster
            </div>

            <div>
              <span>✦</span>
              Improve your coding skills
            </div>
          </div>
        </div>

        {/* REGISTER CARD */}
        <div className="auth-card register-card">

          <div className="auth-card-header">
            <h2>Create your account</h2>
            <p>Start your journey with CodeMentor AI</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="password-info">
              Use at least 6 characters for your password.
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>

          </form>

          <div className="divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="register-button">
            Sign in instead
          </Link>

          <p className="auth-footer">
            By creating an account, you agree to our Terms and Privacy Policy.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;

