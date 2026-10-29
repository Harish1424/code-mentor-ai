
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodeReview.css";
import { API_BASE_URL } from "../api";

function CodeReview() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (!code.trim()) {
      setError("Please enter some code first.");
      return;
    }

    setLoading(true);
    setReview("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      // Check whether the server returned JSON before parsing it.
      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.toLowerCase().includes("application/json")) {
        throw new Error(
          `The backend returned an unexpected response (HTTP ${response.status}). Check your API URL, backend route, and deployment logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code review failed.");
      }

      if (typeof data.review !== "string" || !data.review.trim()) {
        throw new Error("The AI did not return a review. Please try again.");
      }

      // Display the successful AI review.
      setReview(data.review);

      // Save history separately so a history error
      // does not cancel the successful review.
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
                type: "Code Review",
                code,
                result: data.review,
              }),
            }
          );

          if (!historyResponse.ok) {
            console.warn(
              "The review succeeded, but saving history failed:",
              historyResponse.status
            );
          }
        }
      } catch (historyError) {
        console.warn(
          "The review succeeded, but history could not be saved:",
          historyError.message
        );
      }
    } catch (err) {
      console.error("Code review error:", err);
      setError(err.message || "Unable to review the code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setReview("");
    setError("");
  };

  return (
    <div className="code-review-page">
      <nav className="review-nav">
        <div
          className="review-logo"
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

      <main className="review-container">
        <section className="review-header">
          <div className="review-icon">🔍</div>

          <div>
            <h2>AI Code Review</h2>
            <p>
              Paste your code below and let CodeMentor AI
              analyze it for quality, bugs, readability and improvements.
            </p>
          </div>
        </section>

        <section className="review-card">
          <div className="card-header">
            <div>
              <h3>📝 Your Code</h3>
              <span>Paste your source code below</span>
            </div>

            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={!code && !review}
            >
              Clear
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Paste your code here...

Example:

function add(a, b) {
    return a + b;
}`}
            spellCheck="false"
          />

          <div className="review-actions">
            <span className="code-status">
              {code.length} characters
            </span>

            <button
              className="review-btn"
              onClick={handleReview}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Reviewing...
                </>
              ) : (
                <>🔍 Review Code</>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="error-message" role="alert">
            ⚠️ {error}
          </div>
        )}

        {review && (
          <section className="result-card">
            <div className="result-header">
              <div className="ai-title">
                <div className="ai-avatar">🤖</div>

                <div>
                  <h3>AI Code Review</h3>
                  <span>Analysis generated by CodeMentor AI</span>
                </div>
              </div>

              <span className="success-badge">
                ✓ Completed
              </span>
            </div>

            <div className="review-result">
              {review}
            </div>
          </section>
        )}

        {!review && !loading && (
          <section className="info-card">
            <div className="info-icon">💡</div>

            <div>
              <h3>What will CodeMentor AI check?</h3>

              <div className="check-list">
                <span>✓ Code quality</span>
                <span>✓ Bugs and errors</span>
                <span>✓ Performance</span>
                <span>✓ Readability</span>
                <span>✓ Best practices</span>
                <span>✓ Improvement suggestions</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CodeReview;
