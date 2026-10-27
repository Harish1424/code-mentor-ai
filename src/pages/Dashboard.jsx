
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">

      <nav className="dashboard-nav">
        <div className="dashboard-logo">
          <span>🤖</span>
          <h1>Code Mentor AI</h1>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-content">

        <div className="welcome-section">
          <h2>
            Welcome, {user?.name || "User"} 👋
          </h2>

          <p>
            Your AI-powered coding assistant
          </p>
        </div>

        <div className="feature-grid">

          {/* Code Review */}
          <div className="feature-card">
            <div className="feature-icon">🔍</div>

            <h3>Code Review</h3>

            <p>
              Analyze your code and get AI-powered suggestions
              to improve quality and readability.
            </p>

            <button onClick={() => navigate("/code-review")}>
              Start Review
            </button>
          </div>

          {/* Explain Code */}
          <div className="feature-card">
            <div className="feature-icon">💡</div>

            <h3>Explain Code</h3>

            <p>
              Understand complex code with simple,
              beginner-friendly explanations.
            </p>

            <button onClick={() => navigate("/explain-code")}>
              Explain Code
            </button>
          </div>

          {/* Debug Code */}
          <div className="feature-card">
            <div className="feature-icon">🐞</div>

            <h3>Debug Code</h3>

            <p>
              Find coding errors and get AI-powered
              solutions and improvements.
            </p>

            <button onClick={() => navigate("/debug-code")}>
              Debug Code
            </button>
          </div>

          {/* Improve Code */}
          <div className="feature-card">
            <div className="feature-icon">✨</div>

            <h3>Improve Code</h3>

            <p>
              Refactor your code and make it cleaner,
              more readable, and efficient with AI.
            </p>

            <button onClick={() => navigate("/improve-code")}>
              Improve Code
            </button>
          </div>

          {/* Generate Code */}
          <div className="feature-card">
            <div className="feature-icon">⚡</div>

            <h3>Generate Code</h3>

            <p>
              Describe what you need and let AI
              generate the code for you.
            </p>

            <button onClick={() => navigate("/generate-code")}>
              Generate Code
            </button>
          </div>

          {/* History */}
          <div className="feature-card">
            <div className="feature-icon">📜</div>

            <h3>History</h3>

            <p>
              View your previous AI code reviews,
              explanations, debugging results, and improvements.
            </p>

            <button onClick={() => navigate("/history")}>
              View History
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;

