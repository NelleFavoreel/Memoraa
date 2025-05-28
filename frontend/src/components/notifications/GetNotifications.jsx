import React, { useEffect, useState } from "react";

function GetNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Fout bij laden notificaties");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <p>Laden...</p>;
  if (error) return <p>Fout: {error}</p>;

  return (
    <div>
      <h1 className="title">Notificaties</h1>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id}>
            {notif.type === "tripAdded" ? `${notif.senderName} heeft je toegevoegd aan een reis` : notif.type === "familyRequest" ? `${notif.senderName} wil je toevoegen als familielid` : "Onbekende notificatie"} (
            {new Date(notif.date).toLocaleDateString("nl-BE", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            )
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GetNotifications;
