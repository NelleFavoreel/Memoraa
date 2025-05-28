import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ hidden }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav ref={navRef} className={`navbar ${hidden ? "hidden" : ""}`}>
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
