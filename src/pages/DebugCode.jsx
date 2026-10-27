
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DebugCode.css";

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
        "http://localhost:5000/api/ai/debug",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Code debugging failed."
        );
      }

      setDebug(data.debug);

const user = JSON.parse(localStorage.getItem("user"));

if (user?._id) {
  await fetch("http://localhost:5000/api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user._id,
      type: "Debug Code",
      code,
      result: data.debug,
    }),
  });
}
    } catch (err) {
      setError(err.message || "Something went wrong.");
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

      {/* Navbar */}
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

        {/* Header */}
        <section className="debug-header">

          <div className="debug-icon">
            🐞
          </div>

          <div>
            <h2>Debug Code</h2>

            <p>
              Find errors, understand why they happen,
              and get AI-powered fixes for your code.
            </p>
          </div>

        </section>

        {/* Code Input */}
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
                <>
                  🐞 Debug Code
                </>
              )}
            </button>

          </div>

        </section>

        {/* Error */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {debug && (
          <section className="debug-result-card">

            <div className="result-header">

              <div className="ai-title">

                <div className="ai-avatar">
                  🤖
                </div>

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

            <pre className="debug-result">
              {debug}
            </pre>

          </section>
        )}

        {/* Info */}
        {!debug && !loading && (

          <section className="info-card">

            <div className="info-icon">
              🐞
            </div>

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
