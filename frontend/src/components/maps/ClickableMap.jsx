import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = "";

function ClickableMap({ coordinates }) {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [4.5, 50.8],
      zoom: 6,
    });

    setMap(initMap);

    return () => initMap.remove();
  }, []);

  useEffect(() => {
    if (map && coordinates.length > 0) {
      // Verwijder alle bestaande markers
      map.eachLayer((layer) => {
        if (layer.type === "symbol") {
          map.removeLayer(layer.id);
          map.removeSource(layer.id);
        }
      });

      // Voeg nieuwe markers toe voor elke geselecteerde locatie
      coordinates.forEach((coord) => {
        new mapboxgl.Marker().setLngLat(coord.coordinates).addTo(map);
      });
    }
  }, [map, coordinates]);

  return <div ref={mapContainerRef} style={{ height: "400px", width: "100%" }} />;
}

export default ClickableMap;
