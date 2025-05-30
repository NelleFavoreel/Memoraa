import React, { useEffect, useState } from "react";

function GetNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [trips, setTrips] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [senders, setSenders] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentUserId = localStorage.getItem("userId");
        if (!token || !currentUserId) throw new Error("Niet ingelogd.");

        const resNotif = await fetch("http://localhost:3001/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resNotif.ok) throw new Error("Fout bij laden notificaties");
        const notifData = await resNotif.json();

        const filteredNotifs = notifData.filter((n) => {
          const userIdMatch = n.userId === currentUserId;
          const recipientsMatch = Array.isArray(n.recipients) && n.recipients.includes(currentUserId);
          return userIdMatch || recipientsMatch;
        });

        setNotifications(filteredNotifs);

        const unreadNotifIds = filteredNotifs.filter((n) => !(n.readBy || []).includes(currentUserId)).map((n) => n._id);

        if (unreadNotifIds.length > 0) {
          await fetch("http://localhost:3001/notifications/mark-as-read", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ notificationIds: unreadNotifIds }),
          });
        }

        const tripIds = [...new Set(filteredNotifs.map((n) => n.tripId).filter(Boolean))];
        const tripsData = {};
        for (const id of tripIds) {
          try {
            const resTrip = await fetch(`http://localhost:3001/trips/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (resTrip.ok) {
              const trip = await resTrip.json();
              tripsData[id] = trip;
            } else if (resTrip.status === 404) {
              tripsData[id] = null;
            }
          } catch (error) {
            console.error(error);
          }
        }
        setTrips(tripsData);

        const senderIds = [...new Set(filteredNotifs.map((n) => n.sender))];
        const sendersData = {};
        for (const senderId of senderIds) {
          try {
            const resUser = await fetch(`http://localhost:3001/users/${senderId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (resUser.ok) {
              const user = await resUser.json();
              sendersData[senderId] = user.name || "Iemand";
            } else {
              sendersData[senderId] = "Iemand";
            }
          } catch {
            sendersData[senderId] = "Iemand";
          }
        }
        setSenders(sendersData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Laden...</p>;
  if (error) return <p>Fout: {error}</p>;

  if (notifications.length === 0) return <p>Geen nieuwe notificaties.</p>;

  return (
    <div className="get-notifications-container">
      <ul>
        {notifications.map((notif) => {
          const isUnread = !(notif.readBy || []).includes(localStorage.getItem("userId"));
          const senderName = senders[notif.sender] || "Iemand";
          const trip = trips[notif.tripId?.toString()];
          const place = trip?.place || notif.tripPlace || "";

          let message = "";
          switch (notif.type) {
            case "tripAdded":
              message = `heeft je toegevoegd aan een reis${place ? ` naar ${place}` : ""}`;
              break;
            case "tripDeleted":
              message = `heeft een reis verwijderd${place ? ` naar ${place}` : ""}`;
              break;
            case "tripUpdated":
              message = `heeft de reis${place ? ` naar ${place}` : ""} bijgewerkt`;
              break;
            case "familyRequest":
              message = `wil je toevoegen als familielid`;
              break;
            case "friendRequestReceived":
              message = `heeft je een vriendschapsverzoek gestuurd`;
              break;
            case "friendRequestAccepted":
              message = `heeft je vriendschapsverzoek geaccepteerd`;
              break;
            case "familyRequestAccepted":
            case "familyAccepted":
              message = notif.sender?.toString() === localStorage.getItem("userId") ? `Je hebt een familielid toegevoegd.` : `heeft je familievriend-verzoek geaccepteerd`;
              break;
            default:
              message = `Onbekende notificatie: ${notif.type}`;
          }

          return (
            <li key={notif._id} className={`notification-item ${isUnread ? "unread" : ""}`}>
              <span className="notification-sender">{senderName}</span>
              {message}
              <div style={{ fontSize: "0.85em", color: "#666", marginTop: "4px" }}>
                {new Date(notif.date).toLocaleDateString("nl-BE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default GetNotifications;
