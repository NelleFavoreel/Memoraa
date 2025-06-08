// TravelSlideshow.js
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "./TravelSlideshow.css";

const TravelSlideshow = ({ parallaxTranslate }) => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

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

  if (trips.length === 0) return null;

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
          <div key={trip._id} className="slick-slide" onClick={() => navigate(`/trips/${trip._id}`)}>
            <img src={trip.imageUrl} alt={trip.place || "Trip"} className="slide-image" style={{ transform: `translateY(${parallaxTranslate}px)` }} />
            <div className="slide-overlay">
              <div className="slide-place">{trip.country || trip.place}</div>
              <div className="slide-time">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TravelSlideshow;
