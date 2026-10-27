
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
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
            Your AI-powered coding companion
          </p>

          <div className="code-preview">
            <div className="code-header">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="code-body">
              <p>
                <span className="purple">const</span>{" "}
                <span className="blue">mentor</span> ={" "}
                <span className="green">CodeMentorAI</span>;
              </p>

              <p>
                <span className="purple">await</span>{" "}
                <span className="blue">mentor</span>.
                <span className="yellow">review</span>(code);
              </p>

              <p className="comment">
                // Learn. Improve. Build better.
              </p>
            </div>
          </div>

          <div className="feature-list">
            <div>
              <span>✓</span>
              AI-powered code review
            </div>

            <div>
              <span>✓</span>
              Instant code explanations
            </div>

            <div>
              <span>✓</span>
              Smart debugging assistance
            </div>
          </div>
        </div>

        {/* LOGIN CARD */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to CodeMentor AI</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>

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
              <div className="password-label">
                <label>Password</label>
                <span className="forgot">Forgot password?</span>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
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

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="divider">
            <span>New to CodeMentor?</span>
          </div>

          <Link to="/register" className="register-button">
            Create an account
          </Link>

          <p className="auth-footer">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
