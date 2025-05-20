import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteTrip from "./DeleteTrip";
import FullButton from "../button/FullButton";

function TravelInfo({ refresh, onRefreshed }) {
  const [trips, setTrips] = useState([]);

  const fetchTrips = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/trips", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Niet geautoriseerd of fout bij ophalen.");
        return res.json();
      })
      .then((data) => {
        setTrips(data);
        if (onRefreshed) onRefreshed();
      })
      .catch((err) => {
        console.error("❌ Fout bij ophalen van trips:", err);
      });
  };

  // Eerste keer laden
  useEffect(() => {
    fetchTrips();
  }, []);

  // Herladen als refresh verandert naar true
  useEffect(() => {
    if (refresh) {
      fetchTrips();
    }
  }, [refresh]);

  const handleDelete = (id) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));
  };

  return (
    <div>
      <h1 className="title">Alle reizen</h1>
      <ul>
        {trips.map((trip) => (
          <li key={trip._id} className="trip-item">
            {trip.imageUrl && <img src={trip.imageUrl} alt={`Afbeelding van ${trip.place || trip.country}`} />}
            <div className="trip-info">
              <DeleteTrip tripId={trip._id} onDelete={handleDelete} />
              <p>
                <strong>Bestemming:</strong> {trip.tripType === "roadtrip" && trip.countries && trip.countries.length > 0 ? trip.countries.join(" - ") : `${trip.place}${trip.country ? ` - ${trip.country}` : ""}`}
              </p>
              <p>
                <strong>Type:</strong> {trip.tripType}
              </p>
              <p>
                <strong>Datum:</strong> {new Date(trip.startDate).toLocaleDateString()} tot {new Date(trip.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Reizigers:</strong>
              </p>
              <ul>
                {trip.travelers.map((userId) => (
                  <li key={userId}>
                    <FetchUserInfo userId={userId} />
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <FullButton>
                  <Link to={`/trips/${trip._id}`}>Bekijk de reisdetails</Link>
                </FullButton>
              </div>
            </div>
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
    return <span>Laden...</span>;
  }

  return (
    <span>
      {user.name} ({user.screenName})
    </span>
  );
}

export default TravelInfo;
