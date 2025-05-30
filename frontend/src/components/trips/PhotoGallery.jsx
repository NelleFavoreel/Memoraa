import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { useState } from "react";

function PhotoGallery({ tripDays }) {
  const [index, setIndex] = useState(-1);
  const photos = tripDays.flatMap((day) => day.photos || []);

  const slides = photos.map((url) => ({ src: url }));

  return (
    <div className="photos-container">
      <h2>Alle foto's</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {photos.map((photo, i) => (
          <img key={i} src={photo} alt={`Foto ${i + 1}`} width={100} style={{ cursor: "pointer", borderRadius: "8px" }} onClick={() => setIndex(i)} />
        ))}
      </div>

      <Lightbox open={index >= 0} close={() => setIndex(-1)} slides={slides} index={index} carousel={{ finite: true }} />
    </div>
  );
}
export default PhotoGallery;
{
  /* <div className="photos-container">
          <h2>Alle foto's</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {tripDays
              .flatMap((day) => day.photos || [])
              .map((photo, index) => (
                <img key={index} src={photo} alt={`Foto ${index + 1}`} width={100} />
              ))}
          </div>
        </div> */
}
