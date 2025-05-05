// TravelInfo.js
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
              {trip.place} - {trip.country}
            </p>
            {/* Gebruik de DeleteTrip component voor elke reis */}
            <DeleteTrip tripId={trip._id} onDelete={handleDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TravelInfo;
