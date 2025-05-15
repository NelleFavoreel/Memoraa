import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoibmVsZmF2byIsImEiOiJjbWFtamdjaTIwOHRoMmtzOGpuOGUwbjNiIn0.ug7nfrbMOWZ6FuGsKNq4YQ";

function SimpleMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    // Initieer de kaart met Brussel als startpunt
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [4.35121, 50.8551], // Brussel
      zoom: 10,
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!searchInput) return;

    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();

      if (!data.features.length) {
        alert("Locatie niet gevonden.");
        return;
      }

      const [lng, lat] = data.features[0].center;

      // Marker verwijderen als die al bestaat
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Nieuwe marker op gevonden locatie zetten
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);

      // Kaart naar de locatie laten vliegen en inzoomen
      mapRef.current.flyTo({ center: [lng, lat], zoom: 12 });
    } catch (error) {
      console.error("Fout bij zoeken:", error);
      alert("Er is een fout opgetreden bij het zoeken.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input type="text" placeholder="Typ een plaatsnaam..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ width: "70%", padding: "6px" }} />
        <button onClick={handleSearch} style={{ padding: "6px 12px", marginLeft: 8 }}>
          Zoek
        </button>
      </div>

      <div ref={mapContainerRef} style={{ height: "400px", width: "100%", borderRadius: "10px", border: "1px solid #ccc" }} />
    </div>
  );
}

export default SimpleMap;
