import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShareTripButton from "./ShareTripButton";
import ClickableMap from "../maps/ClickableMap";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

function TravelDetail() {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
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
        console.log("Gehaalde trip data:", data);
        setTrip(data.trip);
        setTripDays(data.tripDays);
      } catch (error) {
        console.error("Fout bij ophalen van trip details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [id]);
  useEffect(() => {
    const fetchCoordinatesForPlaces = async () => {
      const fetchedCoordinates = [];

      for (let i = 0; i < tripDays.length; i++) {
        const place = tripDays[i].place;
        if (!place) continue;

        try {
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${mapboxgl.accessToken}`);
          const data = await response.json();

          if (data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            fetchedCoordinates.push({ dayIndex: i, coordinates: [lng, lat] });
          }
        } catch (error) {
          console.error("Fout bij ophalen locatie:", error);
        }
      }

      setCoordinates(fetchedCoordinates);
    };

    if (tripDays.length > 0) {
      fetchCoordinatesForPlaces();
    }
  }, [tripDays]);
  if (loading) return <p>De reisgegevens worden geladen...</p>;

  return (
    <div>
      <ClickableMap coordinates={coordinates} />
      <ShareTripButton tripId={trip._id} />
      <h1>
        {trip.place} - {trip.country}
      </h1>
      <p>
        {new Date(trip.startDate).toLocaleDateString()} tot {new Date(trip.endDate).toLocaleDateString()}
      </p>
      <h3>Familie: {trip.familyId}</h3>
      <h2>Alle foto's</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {tripDays
          .flatMap((day) => day.photos || [])
          .map((photo, index) => (
            <img key={index} src={photo} alt={`Foto ${index + 1}`} width={100} />
          ))}
      </div>

      <h2>Dagen van de reis:</h2>
      {tripDays.length > 0 ? (
        <ul>
          {tripDays.map((day, index) => (
            <li key={day._id}>
              <strong>
                {new Date(day.date).toLocaleDateString()} {day.place}
              </strong>
              <p>{day.description}</p>
              <ul>
                {day.activities.map((activity, activityIndex) => (
                  <li key={activityIndex}>{activity}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Er zijn geen dagen voor deze reis.</p>
      )}

      <h3>Familie: {trip.familyId}</h3>

      <div></div>
    </div>
  );
}

export default TravelDetail;
