import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = "";

function Maps({ city }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!city) return;

    let map;

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`);
        const data = await response.json();
        const [lng, lat] = data.features[0].center;

        // 🧼 verwijder oude inhoud van de map-container
        if (mapContainerRef.current && mapContainerRef.current.hasChildNodes()) {
          mapContainerRef.current.innerHTML = "";
        }

        map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [lng, lat],
          zoom: 6,
        });

        new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      } catch (error) {
        console.error("Kon locatie niet vinden:", error);
      }
    };

    fetchCoordinates();

    return () => {
      if (map) map.remove();
    };
  }, [city]);

  return (
    <div>
      <h2>📍 Locatie op de kaart</h2>
      <div ref={mapContainerRef} style={{ height: "400px", width: "100%", borderRadius: "10px" }} />
    </div>
  );
}

export default Maps;
