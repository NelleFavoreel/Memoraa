import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = "pk.eyJ1IjoibmVsZmF2byIsImEiOiJjbWFtamdjaTIwOHRoMmtzOGpuOGUwbjNiIn0.ug7nfrbMOWZ6FuGsKNq4YQ";

function ClickableMap({ coordinates }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const hasCenteredRef = useRef(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [4.5, 50.8],
      zoom: 6, // start iets verder uitgezoomd
      pitch: 0,
      bearing: 0,
      antialias: true,
      minZoom: 4, // voorkom te ver uitzoomen
      maxZoom: 16, // voorkom te ver inzoomen
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Verwijder oude markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Voeg nieuwe markers toe
    coordinates.forEach((coord) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(coord.coordinates)
        .setPopup(new mapboxgl.Popup().setText(`Dag ${coord.dayIndex + 1}`))
        .addTo(map);

      markersRef.current.push(marker);
    });

    if (coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord.coordinates));
      map.fitBounds(bounds, { padding: 50, maxZoom: 12 }); // maxZoom voorkomt dat ie te ver inzoomt
    }
  }, [coordinates]);

  const handleSearch = async () => {
    if (!searchInput) return;
    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      if (data.features.length === 0) {
        alert("Locatie niet gevonden.");
        return;
      }
      const [lng, lat] = data.features[0].center;

      const map = mapRef.current;
      if (!map) return;

      // Voeg marker toe voor zoekresultaat
      const searchMarker = new mapboxgl.Marker({ color: "red" }).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup().setText(searchInput)).addTo(map);

      // Verplaats kaart naar de locatie
      map.flyTo({ center: [lng, lat] });

      // Voeg deze marker toe aan je markersRef zodat je ze later kan verwijderen als nodig
      markersRef.current.push(searchMarker);
    } catch (error) {
      console.error("Fout bij zoeken:", error);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input type="text" placeholder="Zoek een plaats..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ width: "70%", padding: "6px" }} />
        <button onClick={handleSearch}>Zoek</button>
      </div>

      <div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
}

export default ClickableMap;
