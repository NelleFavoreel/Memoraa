import { Link } from "react-router-dom";

export default function Navbar() {
  const navStyle = {
    padding: "1rem",
    display: "flex",
    justifyContent: "flex-end",
  };

  const linkStyle = {
    color: "black",
    fontFamily: "Arial, sans-serif",
    margin: "0 1rem",
    textDecoration: "none",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <Link to="/trips" style={linkStyle}>
        Reizen
      </Link>
      <Link to="/calendar" style={linkStyle}>
        Kalender
      </Link>
      <Link to="/users" style={linkStyle}>
        Account
      </Link>
    </nav>
  );
}
