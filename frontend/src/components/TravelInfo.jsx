import { useEffect, useState } from "react";
import DeleteTrip from "./DeleteTrip"; // Import de DeleteTrip component

function TravelInfo() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/trips")
      .then((res) => res.json())
      .then((data) => {
        setTrips(data);
      })
      .catch((err) => {
        console.error("Fout bij ophalen van trips:", err);
      });
  }, []);

  // Functie voor het verwijderen van een reis uit de lijst
  const handleDelete = (id) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));
  };

  return (
    <div>
      <h2>Alle reizen</h2>
      <ul>
        {trips.map((trip) => (
          <li key={trip._id}>
            <p>
              <strong>Bestemming:</strong> {trip.place} - {trip.country}
            </p>
            <p>
              <strong>Datum:</strong> {new Date(trip.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Deelnemende gebruikers:</strong>
            </p>
            <ul>
              {trip.travelers.map((userId) => {
                return (
                  <li key={userId}>
                    <FetchUserInfo userId={userId} />
                  </li>
                );
              })}
            </ul>
            {/* Gebruik de DeleteTrip component voor elke reis */}
            <DeleteTrip tripId={trip._id} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FetchUserInfo({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Fout bij ophalen van gebruiker:", err);
      });
  }, [userId]);

  if (!user) {
    return <span>Laden...</span>; // Toon een laadbericht terwijl de gebruiker wordt opgehaald
  }

  return (
    <span>
      {user.name} ({user.screenName})
    </span>
  );
}

export default TravelInfo;
