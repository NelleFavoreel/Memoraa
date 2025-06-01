import "yet-another-react-lightbox/styles.css";
import Lightbox from "yet-another-react-lightbox";
import { useState } from "react";
import FullButton from "../button/FullButton";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import LoginModal from "../modal/LoginModal";

function PhotoGallery({ generalPhotos, tripDays }) {
  const [index, setIndex] = useState(-1);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const isTripDone = (() => {
    if (tripDays.length === 0) return false;
    const lastDay = tripDays[tripDays.length - 1];
    return new Date(lastDay.date) < new Date();
  })();

  const allPhotos = [...generalPhotos.filter((p) => p != null), ...tripDays.flatMap((day) => (day.photos || []).filter((p) => p != null))];

  const getPhotoSrc = (p) => {
    if (typeof p === "string") return p;
    if (p && p.imageUrl) return p.imageUrl;
    return "";
  };

  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    swipe: false,
    pauseOnHover: false,
  };

  const getSummaryPhotos = () => {
    let shuffled = [...allPhotos].sort(() => 0.5 - Math.random());
    let selected = shuffled.slice(0, 10);
    selected.sort((a, b) => new Date(a.date) - new Date(b.date));
    return selected.map((p) => ({ src: getPhotoSrc(p) }));
  };

  const [summarySlides, setSummarySlides] = useState([]);

  function startSummary() {
    setSummarySlides(getSummaryPhotos());
    setShowSummary(true);
    setShowLightbox(false);
  }

  return (
    <div className="photos-container">
      <h2>Alle foto's</h2>

      <div className="photos-summary">
        {isTripDone && !showSummary && (
          <FullButton onClick={startSummary} style={{ marginBottom: "15px", padding: "10px 15px", cursor: "pointer" }}>
            Samenvatting reis
          </FullButton>
        )}
      </div>

      {!showSummary && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", objectFit: "cover" }}>
            {allPhotos.map((photo, i) => (
              <img
                key={i}
                src={getPhotoSrc(photo)}
                alt={`Foto ${i + 1}`}
                width={100}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShowLightbox(true);
                  setIndex(i);
                }}
              />
            ))}
          </div>

          {showLightbox && <Lightbox open={showLightbox} close={() => setShowLightbox(false)} slides={allPhotos.map((p) => ({ src: getPhotoSrc(p) }))} index={index} carousel={{ finite: true }} />}
        </>
      )}

      {/* Hier gebruik je LoginModal voor samenvatting */}
      <LoginModal isOpen={showSummary} onClose={() => setShowSummary(false)}>
        <div className="summary-container">
          <Slider {...slickSettings}>
            {summarySlides.map((slide, i) => (
              <div className="summary-photo" key={i}>
                <img src={slide.src} alt={`Samenvatting foto ${i + 1}`} style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }} />
              </div>
            ))}
          </Slider>
        </div>
      </LoginModal>
    </div>
  );
}

export default PhotoGallery;
