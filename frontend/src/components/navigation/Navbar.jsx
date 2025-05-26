import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ hidden }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`navbar ${hidden ? "hidden" : ""}`}>
      <div className="navbar-content">
        <div className="navbar-content-inner">
          <div className="logo">
            <Link to="/">FamilyTrips</Link>
          </div>
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/trips" className="nav-link" onClick={() => setMenuOpen(false)}>
            Reizen
          </Link>
          <Link to="/calendar" className="nav-link" onClick={() => setMenuOpen(false)}>
            Kalender
          </Link>
          <Link to="/notifications" className="nav-link" onClick={() => setMenuOpen(false)}>
            Meldingen
          </Link>
          <Link to="/users" className="nav-link" onClick={() => setMenuOpen(false)}>
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
