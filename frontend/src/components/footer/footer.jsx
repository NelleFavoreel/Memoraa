import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer({ hidden }) {
  const navRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3001/notifications/unread-count", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer ref={navRef} className={`footer ${hidden ? "hidden" : ""}`}>
      <div className="footer-content">
        <div className="footer-logo">
          <Link to="/">Tripli</Link>
        </div>

        <div className="footer-links">
          <Link to="/" className="footer-link">
            Home
          </Link>
          <Link to="/trips" className="footer-link">
            Reizen
          </Link>
          <Link to="/notifications" className="footer-link">
            Meldingen
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </Link>
          <Link to="/users" className="footer-link">
            Account
          </Link>
        </div>
      </div>
      <div className="footer-copy">&copy; {new Date().getFullYear()} Tripli. Alle rechten voorbehouden.</div>
    </footer>
  );
}
