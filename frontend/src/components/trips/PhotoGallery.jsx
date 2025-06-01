import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { useState } from "react";

function PhotoGallery({ generalPhotos, tripDays }) {
  const [index, setIndex] = useState(-1);
  const [selectedSlides, setSelectedSlides] = useState([]);
  const [showSlideshow, setShowSlideshow] = useState(false);

  const allPhotos = [...generalPhotos, ...tripDays.flatMap((day) => day.photos || [])];

  const isTripDone = (() => {
    if (tripDays.length === 0) return false;
    const lastDay = tripDays[tripDays.length - 1];
    return new Date(lastDay.date) < new Date();
  })();

  function selectRandomPhotos() {
    let shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 10);
    selected.sort((a, b) => new Date(a.date) - new Date(b.date));
    setSelectedSlides(selected.map((p) => ({ src: typeof p === "string" ? p : p.imageUrl })));
    setIndex(0);
    setShowSlideshow(true);
  }

  return (
    <div className="photos-container">
      <h2>Alle foto's</h2>

      {isTripDone && (
        <button onClick={selectRandomPhotos} style={{ marginBottom: "15px", padding: "10px 15px", cursor: "pointer" }}>
          Kies 10 foto’s met muziek
        </button>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", objectFit: "cover" }}>
        {allPhotos.map((photo, i) => (
          <img
            key={i}
            src={typeof photo === "string" ? photo : photo.imageUrl}
            alt={`Foto ${i + 1}`}
            width={100}
            style={{ cursor: "pointer", borderRadius: "8px" }}
            onClick={() => {
              setSelectedSlides(allPhotos.map((p) => ({ src: typeof p === "string" ? p : p.imageUrl })));
              setIndex(i);
              setShowSlideshow(true);
            }}
          />
        ))}
      </div>

      {showSlideshow && (
        <Lightbox
          open={index >= 0}
          close={() => {
            setIndex(-1);
            setShowSlideshow(false);
          }}
          slides={selectedSlides}
          index={index}
          carousel={{ finite: true, autoplay: { delay: 3000, pauseOnInteraction: false } }} // automatisch elke 3 seconden
          render={{
            slide: ({ slide }) => (
              <>
                <img src={slide.src} alt="Slide" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                <audio
                  src="/path/to/your/calm-music.mp3"
                  controls
                  autoPlay
                  loop
                  style={{
                    position: "fixed",
                    bottom: 20,
                    left: 20,
                    zIndex: 1000,
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: "8px",
                  }}
                />
              </>
            ),
          }}
        />
      )}
    </div>
  );
}

export default PhotoGallery;
