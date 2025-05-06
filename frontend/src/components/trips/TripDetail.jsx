import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TravelDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [tripDays, setTripDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/trips/${id}`);
        if (!response.ok) {
          throw new Error("Kon tripdetails niet ophalen.");
        }
        const data = await response.json();
        console.log("Gehaalde trip data:", data); // Log de opgehaalde data
        setTrip(data.trip); // Zet tripgegevens
        setTripDays(data.tripDays); // Zet tripdagen
      } catch (error) {
        console.error("Fout bij ophalen van trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]); // Herlaad de data als tripId verandert

  if (loading) return <p>De reisgegevens worden geladen...</p>;

  return (
    <div>
      <h1>ik weet het niet</h1>
      <h1>
        {trip.place} - {trip.country}
      </h1>
      <p>
        {new Date(trip.startDate).toLocaleDateString()} tot {new Date(trip.endDate).toLocaleDateString()}
      </p>
      <h3>Familie: {trip.familyId}</h3>

      <h2>Dagen van de reis:</h2>
      {tripDays.length > 0 ? (
        <ul>
          {tripDays.map((day) => (
            <li key={day._id}>
              <strong>{new Date(day.date).toLocaleDateString()}</strong>
              <p>{day.description}</p>
              <ul>
                {day.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Er zijn geen dagen voor deze reis.</p>
      )}
    </div>
  );
}

export default TravelDetail;
