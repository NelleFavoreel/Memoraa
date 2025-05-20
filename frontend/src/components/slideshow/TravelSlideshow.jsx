import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./TravelSlideshow.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TravelSlideshow = () => {
  const [trips, setTrips] = useState([]);
  const [centerSlide, setCenterSlide] = useState(0);
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
      .catch((err) => {
        console.error("❌ Fout bij ophalen van trips:", err);
      });
  }, []);

  const settings = {
    className: "center",
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 3,
    autoplay: false,
    autoplaySpeed: 3000,
    dots: false,
    arrows: false,
    infinite: true,
    pauseOnHover: true,
    speed: 500,
    afterChange: (current) => setCenterSlide(current),
  };

  if (trips.length === 0) return null;

  return (
    <div className="travel-slideshow-container">
      <Slider {...settings}>
        {trips.map((trip, index) => (
          <div key={index} style={{ padding: "0 20px", cursor: "pointer", position: "relative" }} onClick={() => navigate(`/trips/${trip._id}`)}>
            <img src={trip.imageUrl} alt={`Reis naar ${trip.place || trip.country}`} />

            {centerSlide === index && (
              <div
                className="hover-info"
                style={{
                  marginLeft: "-50vw",
                  width: "100vw",
                  marginRight: "-50vw",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "#484848",
                  color: "white",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontFamily: "'Myriad Pro', sans-serif",
                  fontWeight: "100",
                }}
              >
                <div>{trip.country || trip.place}</div>
                <div>
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </div>
                <div>Aantal reizigers: {trip.travelers?.length || trip.people?.length || "Onbekend"}</div>
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TravelSlideshow;
