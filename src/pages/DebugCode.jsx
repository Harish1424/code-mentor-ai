
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DebugCode.css";
import { API_BASE_URL } from "../api";

function DebugCode() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [debug, setDebug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDebug = async () => {
    if (!code.trim()) {
      setError("Please enter some code first.");
      return;
    }

    setLoading(true);
    setDebug("");
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai/debug`,
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
          `The backend returned an unexpected response (HTTP ${response.status}). Check the API URL, debug route, and backend logs.`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Code debugging failed."
        );
      }

      if (typeof data.debug !== "string" || !data.debug.trim()) {
        throw new Error(
          "The AI did not return a debugging result. Please try again."
        );
      }

      // Display the successful debugging result.
      setDebug(data.debug);

      // Save history separately so a history failure
      // does not cancel the debugging result.
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
                type: "Debug Code",
                code,
                result: data.debug,
              }),
            }
          );

          if (!historyResponse.ok) {
            console.warn(
              "Debugging succeeded, but saving history failed:",
              historyResponse.status
            );
          }
        }
      } catch (historyError) {
        console.warn(
          "Debugging succeeded, but history could not be saved:",
          historyError.message
        );
      }
    } catch (err) {
      console.error("Debug Code error:", err);
      setError(
        err.message || "Unable to debug the code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setDebug("");
    setError("");
  };

  return (
    <div className="debug-page">
      <nav className="debug-nav">
        <div
          className="debug-logo"
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

      <main className="debug-container">
        <section className="debug-header">
          <div className="debug-icon">🐞</div>

          <div>
            <h2>Debug Code</h2>
            <p>
              Find errors, understand why they happen,
              and get AI-powered fixes for your code.
            </p>
          </div>
        </section>

        <section className="debug-card">
          <div className="card-header">
            <div>
              <h3>💻 Your Code</h3>
              <span>
                Paste the code you want CodeMentor AI to debug
              </span>
            </div>

            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={!code && !debug}
            >
              Clear
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`// Paste your problematic code here...

Example:

function divide(a, b) {
    return a / c;
}

console.log(divide(10, 2));`}
            spellCheck="false"
          />

          <div className="debug-actions">
            <span className="code-status">
              {code.length} characters
            </span>

            <button
              className="debug-btn"
              onClick={handleDebug}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Debugging...
                </>
              ) : (
                <>🐞 Debug Code</>
              )}
            </button>
          </div>
        </section>

        {error && (
          <div className="error-message" role="alert">
            ⚠️ {error}
          </div>
        )}

        {debug && (
          <section className="debug-result-card">
            <div className="result-header">
              <div className="ai-title">
                <div className="ai-avatar">🤖</div>

                <div>
                  <h3>AI Debug Result</h3>
                  <span>
                    Problems and solutions identified by CodeMentor AI
                  </span>
                </div>
              </div>

              <span className="success-badge">
                ✓ Completed
              </span>
            </div>

            <pre className="debug-result">{debug}</pre>
          </section>
        )}

        {!debug && !loading && (
          <section className="info-card">
            <div className="info-icon">🐞</div>

            <div>
              <h3>What can CodeMentor AI debug?</h3>

              <div className="check-list">
                <span>✓ Syntax errors</span>
                <span>✓ Logical errors</span>
                <span>✓ Runtime problems</span>
                <span>✓ Incorrect variables</span>
                <span>✓ Function problems</span>
                <span>✓ Beginner coding mistakes</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default DebugCode;
