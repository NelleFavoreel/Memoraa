import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navStyle = {
    padding: "1rem",
    display: "flex",
    justifyContent: "flex-end",
  };

  return (
    <nav style={navStyle} className="navbar">
      <Link to="/" className="nav-link">
        Home
      </Link>
      <Link to="/trips" className="nav-link">
        Reizen
      </Link>
      <Link to="/calendar" className="nav-link">
        Kalender
      </Link>
      <Link to="/notifications" className="nav-link">
        Meldingen
      </Link>
      <Link to="/users" className="nav-link">
        Account
      </Link>
    </nav>
  );
}
