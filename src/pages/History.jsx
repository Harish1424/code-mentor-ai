
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";
import { API_BASE_URL } from "../api";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let user = null;

      try {
        const storedUser = localStorage.getItem("user");
        user = storedUser ? JSON.parse(storedUser) : null;
      } catch {
        throw new Error(
          "Saved user information is invalid. Please log in again."
        );
      }

      // Support both MongoDB _id and normal id
      const userId = user?._id || user?.id;

      if (!userId) {
        throw new Error(
          "User information not found. Please log in again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/history/${encodeURIComponent(userId)}`
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `The backend returned an unexpected response (HTTP ${response.status}). Check your API URL, history route, and backend logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch history."
        );
      }

      if (!Array.isArray(data.history)) {
        throw new Error(
          "The server returned an unexpected history response."
        );
      }

      setHistory(data.history);
    } catch (err) {
      console.error("History Error:", err);
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="history-page">
      {/* Navbar */}
      <nav className="history-nav">
        <div
          className="history-logo"
          onClick={() => navigate("/dashboard")}
        >
          <span>🤖</span>
          <h1>Code Mentor AI</h1>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <main className="history-content">
        {/* Header */}
        <div className="history-header">
          <h2>📜 History</h2>
          <p>View your previous AI coding activities.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="empty-history">
            <div className="empty-icon">⏳</div>
            <h3>Loading History...</h3>
            <p>Fetching your previous AI activities.</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="empty-history">
            <div className="empty-icon">⚠️</div>
            <h3>Unable to Load History</h3>
            <p>{error}</p>

            <button onClick={fetchHistory}>
              Try Again
            </button>
          </div>
        )}

        {/* No History */}
        {!loading && !error && history.length === 0 && (
          <div className="empty-history">
            <div className="empty-icon">📂</div>
            <h3>No History Yet</h3>
            <p>
              Your AI code reviews, explanations,
              debugging results, and improvements
              will appear here.
            </p>

            <button onClick={() => navigate("/code-review")}>
              Start Coding
            </button>
          </div>
        )}

        {/* History List */}
        {!loading && !error && history.length > 0 && (
          <div className="history-list">
            {history.map((item, index) => (
              <div
                className="history-card"
                key={item._id || `${item.type}-${index}`}
              >
                {/* Card Header */}
                <div className="history-card-header">
                  <div>
                    <span className="history-type">
                      {item.type === "Code Review" && "🔍"}
                      {item.type === "Explain Code" && "💡"}
                      {item.type === "Debug Code" && "🐞"}
                      {item.type === "Improve Code" && "✨"}
                      {item.type === "Generate Code" && "⚡"}
                      {" "}
                      {item.type}
                    </span>

                    <p className="history-date">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "Unknown date"}
                    </p>
                  </div>
                </div>

                {/* Code */}
                <div className="history-section">
                  <h4>📝 Code</h4>
                  <pre>{item.code}</pre>
                </div>

                {/* AI Result */}
                <div className="history-section">
                  <h4>🤖 AI Result</h4>
                  <div className="history-result">
                    {item.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default History;
