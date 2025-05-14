import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShareTripButton from "./ShareTripButton";
import ClickableMap from "../maps/ClickableMap";

function TravelDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [tripDays, setTripDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState([]);

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
  }, [id]);

  const handleCitySearch = (dayIndex, searchQuery) => {
    if (!searchQuery) return;

    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN`)
      .then((response) => response.json())
      .then((data) => {
        if (data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCoordinates((prevCoordinates) => [...prevCoordinates, { dayIndex, coordinates: [lng, lat] }]);
        } else {
          alert("Geen locatie gevonden.");
        }
      })
      .catch((error) => console.error("Fout bij zoeken:", error));
  };

  if (loading) return <p>De reisgegevens worden geladen...</p>;

  return (
    <div>
      <ShareTripButton tripId={trip._id} />
      <h1>
        {trip.place} - {trip.country}
      </h1>
      <p>
        {new Date(trip.startDate).toLocaleDateString()} tot {new Date(trip.endDate).toLocaleDateString()}
      </p>

      <h2>Dagen van de reis:</h2>
      {tripDays.length > 0 ? (
        <ul>
          {tripDays.map((day, index) => (
            <li key={day._id}>
              <strong>{new Date(day.date).toLocaleDateString()}</strong>
              <p>{day.description}</p>
              <ul>
                {day.activities.map((activity, activityIndex) => (
                  <li key={activityIndex}>{activity}</li>
                ))}
              </ul>
              {/* Zoekbalk voor elke dag */}
              <input type="text" placeholder="Zoek een stad..." onChange={(e) => handleCitySearch(index, e.target.value)} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Er zijn geen dagen voor deze reis.</p>
      )}

      <h3>Familie: {trip.familyId}</h3>

      <div>
        <ClickableMap coordinates={coordinates} />
      </div>
    </div>
  );
}

export default TravelDetail;
