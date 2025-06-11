// TravelSlideshow.js
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "./TravelSlideshow.css";
import CustomCursor from "../animations/CustomCursor";

const TravelSlideshow = ({ parallaxTranslate }) => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3001/trips", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Niet geautoriseerd of fout bij ophalen.");
        return res.json();
      })
      .then((data) => {
        const toekomstigeReizen = data.filter((trip) => new Date(trip.startDate) > new Date() && trip.imageUrl);
        setTrips(toekomstigeReizen);
      })
      .catch((err) => console.error("❌ Fout bij ophalen van trips:", err));
  }, []);

  if (trips.length === 0) {
    return (
      <div className="no-trips-message" style={{ textAlign: "center" }}>
        <p>Er zijn nog geen toekomstige reizen toegevoegd. 👀</p>
        <p>Maak snel je eerste reis aan en ontdek de wereld met je familie!</p>
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    pauseOnHover: true,
  };

  return (
    <div className="slick-wrapper">
      <Slider {...settings}>
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="slick-slide1"
            onClick={() => navigate(`/trips/${trip._id}`)}
            onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
            onMouseEnter={() => setShowCursor(true)}
            onMouseLeave={() => setShowCursor(false)}
          >
            <img src={trip.imageUrl} alt={trip.place || "Trip"} className="slide-image" style={{ transform: `translateY(${parallaxTranslate}px)` }} />
            <div className="slide-overlay">
              <div className="slide-place">{(trip.tripType === "roadtrip" ? "Roadtrip  " : "") + (trip.place || trip.country || "")}</div>
              <div className="slide-time">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {showCursor && <CustomCursor x={cursorPos.x} y={cursorPos.y} />}
    </div>
  );
};

export default TravelSlideshow;
