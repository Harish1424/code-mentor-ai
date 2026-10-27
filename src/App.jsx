import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CodeReview from "./pages/CodeReview";
import ExplainCode from "./pages/ExplainCode";
import DebugCode from "./pages/DebugCode";
import ImproveCode from "./pages/ImproveCode";
import History from "./pages/History";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Main page */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          token ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Code Review */}
      <Route
        path="/code-review"
        element={
          <ProtectedRoute>
            <CodeReview />
          </ProtectedRoute>
        }
      />

      {/* Explain Code */}
      <Route
        path="/explain-code"
        element={
          <ProtectedRoute>
            <ExplainCode />
          </ProtectedRoute>
        }
      />

      {/* Debug Code */}
      <Route
        path="/debug-code"
        element={
          <ProtectedRoute>
            <DebugCode />
          </ProtectedRoute>
        }
      />
      {/* Improve Code */}
      <Route
  path="/improve-code"
  element={
    <ProtectedRoute>
      <ImproveCode />
    </ProtectedRoute>
  }
/>
<Route
  path="/history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>
    </Routes>
    
  );
  
}

export default App;