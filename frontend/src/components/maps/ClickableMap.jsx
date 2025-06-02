import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import FullButton from "../button/FullButton";

function ClickableMap({ coordinates }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const hasCenteredRef = useRef(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [4.5, 50.8],
      zoom: 6,
      pitch: 0,
      bearing: 0,
      antialias: true,
      minZoom: 5,
      maxZoom: 16,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    coordinates.forEach((coord) => {
      const popupNode = document.createElement("div");
      popupNode.style.padding = "5px 10px";
      popupNode.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      popupNode.style.color = "#373737";
      popupNode.style.borderRadius = "6px";
      popupNode.style.fontSize = "14px";
      popupNode.style.minWidth = "100px";
      popupNode.style.textAlign = "center";
      popupNode.textContent = coord.place || `Dag ${coord.dayIndex + 1} - ${coord.place}`;
      const popup = new mapboxgl.Popup().setDOMContent(popupNode);

      const marker = new mapboxgl.Marker().setLngLat(coord.coordinates).setPopup(popup).addTo(map);

      markersRef.current.push(marker);
    });

    if (coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord.coordinates));
      map.fitBounds(bounds, { padding: 0, maxZoom: 12 });
    }
  }, [coordinates]);

  // const handleSearch = async () => {
  //   if (!searchInput) return;
  //   try {
  //     const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${mapboxgl.accessToken}`);
  //     const data = await response.json();
  //     if (data.features.length === 0) {
  //       alert("Locatie niet gevonden.");
  //       return;
  //     }
  //     const [lng, lat] = data.features[0].center;

  //     const map = mapRef.current;
  //     if (!map) return;

  //     const searchMarker = new mapboxgl.Marker({ color: "red" }).setLngLat([lng, lat]).setPopup(new mapboxgl.Popup().setText(searchInput)).addTo(map);

  //     map.flyTo({ center: [lng, lat] });

  //     markersRef.current.push(searchMarker);
  //   } catch (error) {
  //     console.error("Fout bij zoeken:", error);
  //   }
  // };

  return (
    <div>
      <div style={{ marginBottom: 8 }}></div>

      <div ref={mapContainerRef} style={{ height: "70vh", width: "100%" }} />
      {/* <input type="text" placeholder="Zoek een plaats..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} style={{ width: "70%", padding: "6px" }} />
      <FullButton onClick={handleSearch}>Zoek</FullButton> */}
    </div>
  );
}

export default ClickableMap;
