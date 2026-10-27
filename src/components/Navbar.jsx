import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/">Code Mentor AI</Link>
      </div>

      <ul className="nav-links">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <a href="#features">Features</a>
        </li>

        <li>
          <a href="#about">About</a>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/register">Register</Link>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;