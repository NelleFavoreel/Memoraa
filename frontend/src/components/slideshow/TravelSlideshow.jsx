import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TravelSlideshow.css";

const CustomSlideshow = () => {
  const [trips, setTrips] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const [fade, setFade] = useState(true);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trips.length);
        setFade(false);
      }, 600);
    }, 5000);

    return () => clearInterval(interval);
  }, [trips.length]);

  if (trips.length === 0) return null;

  const leftIndex = (currentIndex - 1 + trips.length) % trips.length;
  const rightIndex = (currentIndex + 1) % trips.length;

  return (
    <div className="custom-slideshow">
      <div className="image-wrapper">
        <div className="side-image left">
          <img src={trips[leftIndex].imageUrl} alt="Vorige reis" />
        </div>

        <div className="center-image" onClick={() => navigate(`/trips/${trips[currentIndex]._id}`)}>
          <img src={trips[currentIndex].imageUrl} alt="Huidige reis" className={fade ? "fade" : ""} />
          <div className={`hover-info ${fade ? "fade" : ""}`}>
            <div className="slide-place">{trips[currentIndex].country || trips[currentIndex].place}</div>
            <div className="slide-time">
              {new Date(trips[currentIndex].startDate).toLocaleDateString()} - {new Date(trips[currentIndex].endDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="side-image right">
          <img src={trips[rightIndex].imageUrl} alt="Volgende reis" />
        </div>
      </div>
    </div>
  );
};

export default CustomSlideshow;
