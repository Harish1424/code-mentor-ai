import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));

      // Support both MongoDB _id and normal id
      const userId = user?._id || user?.id;

      if (!userId) {
        setError("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/history/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch history."
        );
      }

      setHistory(data.history || []);
    } catch (err) {
      console.error("History Error:", err);
      setError(err.message || "Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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

          <p>
            View your previous AI coding activities.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="empty-history">

            <div className="empty-icon">⏳</div>

            <h3>Loading History...</h3>

            <p>
              Fetching your previous AI activities.
            </p>

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

            <div className="empty-icon">
              📂
            </div>

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

            {history.map((item) => (

              <div
                className="history-card"
                key={item._id}
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
                        ? new Date(
                            item.createdAt
                          ).toLocaleString()
                        : "Unknown date"}
                    </p>

                  </div>

                </div>

                {/* Code */}
                <div className="history-section">

                  <h4>📝 Code</h4>

                  <pre>
                    {item.code}
                  </pre>

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