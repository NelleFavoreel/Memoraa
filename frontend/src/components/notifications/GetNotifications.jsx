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

        // 1. Haal alle notificaties op
        const resNotif = await fetch("http://localhost:3001/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resNotif.ok) throw new Error("Fout bij laden notificaties");
        const notifData = await resNotif.json();
        notifData.forEach((n) => {
          console.log("Notif", n._id, "userId:", n.userId, "recipients:", n.recipients);
        });
        const filteredNotifs = notifData.filter((n) => {
          const userIdMatch = n.userId && n.userId.toString() === currentUserId.toString();
          const recipientsMatch = Array.isArray(n.recipients) && n.recipients.some((r) => r.toString() === currentUserId.toString());
          console.log(`Notificatie ${n._id}: userIdMatch=${userIdMatch}, recipientsMatch=${recipientsMatch}`);
          return userIdMatch || recipientsMatch;
        });

        const tripIds = [...new Set(filteredNotifs.map((n) => n.tripId && n.tripId.toString()).filter(Boolean))];

        setNotifications(filteredNotifs);

        // 4. Haal reizen op per tripId
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

        // 5. Verzamel unieke sender IDs uit gefilterde notificaties
        const senderIds = [...new Set(filteredNotifs.map((n) => n.sender))];

        // 6. Haal naam op per sender
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

  const renderNotificationText = (notif) => {
    const sender = senders[notif.sender] || "Iemand";
    const trip = trips[notif.tripId?.toString()];
    const place = trip?.place || notif.tripPlace || "";

    switch (notif.type) {
      case "tripAdded":
        return `${sender} heeft je toegevoegd aan een reis${place ? ` naar ${place}` : ""}`;
      case "tripDeleted":
        return `${sender} heeft een reis verwijderd${place ? ` naar ${place}` : ""}`;
      case "tripUpdated":
        return `${sender} heeft de reis${place ? ` naar ${place}` : ""} bijgewerkt`;
      case "familyRequest":
        return `${sender} wil je toevoegen als familielid`;
      case "friendRequestReceived":
        return `${sender} heeft je een vriendschapsverzoek gestuurd`;
      case "friendRequestAccepted":
        return `${sender} heeft je vriendschapsverzoek geaccepteerd`;
      case "familyRequestAccepted":
      case "familyAccepted":
        if (notif.sender?.toString() === localStorage.getItem("userId")) {
          return `Je hebt een familielid toegevoegd.`;
        } else {
          return `${sender} heeft je familievriend-verzoek geaccepteerd`;
        }
      default:
        return `Onbekende notificatie: ${notif.type}`;
    }
  };

  return (
    <div>
      <h1 className="title">Notificaties</h1>
      <ul>
        {notifications.map((notif) => (
          <li key={notif._id}>
            {renderNotificationText(notif)} (
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
