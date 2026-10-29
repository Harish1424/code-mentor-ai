
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImproveCode.css";
import { API_BASE_URL } from "../api";

function ImproveCode() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [improvement, setImprovement] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImprove = async () => {
    if (!code.trim()) {
      setError("Please enter some code first.");
      return;
    }

    setLoading(true);
    setImprovement("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/improve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `The backend returned an unexpected response (HTTP ${response.status}). Check the API URL, improve route, and backend logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Code improvement failed."
        );
      }

      if (
        typeof data.improvedCode !== "string" ||
        !data.improvedCode.trim()
      ) {
        throw new Error(
          "The AI did not return improved code. Please try again."
        );
      }

      // Display the successful improvement.
      setImprovement(data.improvedCode);

      // Save history separately so a history failure
      // does not cancel the successful improvement.
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?._id || user?.id;

        if (userId) {
          const historyResponse = await fetch(
            `${API_BASE_URL}/api/history`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                type: "Improve Code",
                code,
                result: data.improvedCode,
              }),
            }
          );

          if (!historyResponse.ok) {
            console.warn(
              "Improvement succeeded, but saving history failed:",
              historyResponse.status
            );
          }
        }
      } catch (historyError) {
        console.warn(
          "Improvement succeeded, but history could not be saved:",
          historyError.message
        );
      }
    } catch (err) {
      console.error("Improve Code error:", err);
      setError(
        err.message ||
          "Unable to improve the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setImprovement("");
    setError("");
  };

  return (
    <div className="improve-page">
      <nav className="improve-nav">
        <div
          className="improve-logo"
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

      <main className="improve-container">
        <section className="improve-header">
          <div className="improve-icon">✨</div>

          <div>
            <h2>Improve Code</h2>
            <p>
              Make your code cleaner, more readable, and efficient
              with AI-powered suggestions.
            </p>
          </div>
        </section>

        <section className="improve-card">
          <div className="card-header">
            <div>
              <h3>💻 Your Code</h3>
              <span>
                Paste the code you want CodeMentor AI to improve
              </span>
            </div>

            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={!code && !improvement}
            >
              Clear
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Paste your code here...

Example:

function calculateTotal(price, quantity) {
    let total = price * quantity;
    return total;
}

console.log(calculateTotal(100, 5));`}
            spellCheck="false"
          />

          <div className="improve-actions">
            <span className="code-status">
              {code.length} characters
            </span>

            <button
              className="improve-btn"
              onClick={handleImprove}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Improving...
                </>
              ) : (
                <>✨ Improve Code</>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="error-message" role="alert">
            ⚠️ {error}
          </div>
        )}

        {improvement && (
          <section className="improve-result-card">
            <div className="result-header">
              <div className="ai-title">
                <div className="ai-avatar">🤖</div>

                <div>
                  <h3>AI Code Improvement</h3>
                  <span>
                    Improved code and suggestions from CodeMentor AI
                  </span>
                </div>
              </div>

              <span className="success-badge">
                ✓ Completed
              </span>
            </div>

            <pre className="improve-result">
              {improvement}
            </pre>
          </section>
        )}

        {!improvement && !loading && (
          <section className="info-card">
            <div className="info-icon">✨</div>

            <div>
              <h3>What can CodeMentor AI improve?</h3>

              <div className="check-list">
                <span>✓ Code readability</span>
                <span>✓ Code structure</span>
                <span>✓ Performance</span>
                <span>✓ Best practices</span>
                <span>✓ Maintainability</span>
                <span>✓ Beginner-friendly improvements</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ImproveCode;
