
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExplainCode.css";
import { API_BASE_URL } from "../api";

function ExplainCode() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Please enter some code first.");
      return;
    }

    setLoading(true);
    setExplanation("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/explain`,
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
          `The backend returned an unexpected response (HTTP ${response.status}). Check the API URL, explanation route, and backend logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Code explanation failed."
        );
      }

      if (
        typeof data.explanation !== "string" ||
        !data.explanation.trim()
      ) {
        throw new Error(
          "The AI did not return an explanation. Please try again."
        );
      }

      // Display the successful explanation.
      setExplanation(data.explanation);

      // Save history separately so history errors don't
      // cancel an otherwise successful explanation.
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
                type: "Explain Code",
                code,
                result: data.explanation,
              }),
            }
          );

          if (!historyResponse.ok) {
            console.warn(
              "Explanation succeeded, but saving history failed:",
              historyResponse.status
            );
          }
        }
      } catch (historyError) {
        console.warn(
          "Explanation succeeded, but history could not be saved:",
          historyError.message
        );
      }
    } catch (err) {
      console.error("Explain Code error:", err);
      setError(
        err.message ||
        "Unable to explain the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setExplanation("");
    setError("");
  };

  return (
    <div className="explain-page">
      <nav className="explain-nav">
        <div
          className="explain-logo"
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

      <main className="explain-container">
        <section className="explain-header">
          <div className="explain-icon">💡</div>

          <div>
            <h2>Explain Code</h2>
            <p>
              Understand complex code with simple,
              beginner-friendly explanations powered by AI.
            </p>
          </div>
        </section>

        <section className="explain-card">
          <div className="card-header">
            <div>
              <h3>📝 Your Code</h3>
              <span>
                Paste the code you want to understand
              </span>
            </div>

            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={!code && !explanation}
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

          <div className="explain-actions">
            <span className="code-status">
              {code.length} characters
            </span>

            <button
              className="explain-btn"
              onClick={handleExplain}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Explaining...
                </>
              ) : (
                <>💡 Explain Code</>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="error-message" role="alert">
            ⚠️ {error}
          </div>
        )}

        {explanation && (
          <section className="explanation-card">
            <div className="result-header">
              <div className="ai-title">
                <div className="ai-avatar">🤖</div>

                <div>
                  <h3>AI Explanation</h3>
                  <span>
                    Simple explanation generated by CodeMentor AI
                  </span>
                </div>
              </div>

              <span className="success-badge">
                ✓ Completed
              </span>
            </div>

            <div className="explanation-result">
              {explanation}
            </div>
          </section>
        )}

        {!explanation && !loading && (
          <section className="info-card">
            <div className="info-icon">💡</div>

            <div>
              <h3>What can CodeMentor AI explain?</h3>

              <div className="check-list">
                <span>✓ Code structure</span>
                <span>✓ Functions and methods</span>
                <span>✓ Variables</span>
                <span>✓ Program flow</span>
                <span>✓ Complex logic</span>
                <span>✓ Beginner-friendly concepts</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ExplainCode;
