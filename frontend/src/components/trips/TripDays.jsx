import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { SlArrowRight } from "react-icons/sl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EditTripDays from "./EditTripDays";
import FullButton from "../button/FullButton";
import { SlSettings } from "react-icons/sl";
import Underline from "../button/Underline";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", right: -50, zIndex: 1, cursor: "pointer" }} onClick={onClick}>
      <SlArrowRight size={15} color="black" />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", left: -50, zIndex: 1, cursor: "pointer" }} onClick={onClick}>
      <SlArrowRight size={15} color="black" style={{ transform: "rotate(180deg)" }} />
    </div>
  );
}

function TripDays({ tripDays, setTripDays, onDayChange, initialTripDays, tripId, trip }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const currentUserId = localStorage.getItem("userId");
  const [travelerNames, setTravelerNames] = useState([]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => {
      setActiveIndex(current);
      if (onDayChange) onDayChange(current);
    },
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    const fetchTravelerNames = async () => {
      if (!trip || !trip.travelers || trip.travelers.length === 0) {
        setTravelerNames([]);
        return;
      }

      try {
        const names = await Promise.all(
          trip.travelers.map(async (travelerId) => {
            const response = await fetch(`http://localhost:3001/users/${travelerId}`);
            if (!response.ok) throw new Error("Kon gebruiker niet ophalen");
            const data = await response.json();
            return data.name;
          })
        );
        setTravelerNames(names);
      } catch (error) {
        console.error("Fout bij ophalen van reizigersnamen:", error);
      }
    };

    fetchTravelerNames();
  }, [trip]);
  console.log("Ontvangen trip prop:", trip);

  const isTraveler = trip?.travelers?.map(String).includes(currentUserId);

  return (
    <div className="trip-days-container">
      {/* Toon het instellingen-icoon alleen als reiziger */}
      {isTraveler && (
        <Underline onClick={() => setShowEditModal(true)}>
          <SlSettings />
        </Underline>
      )}

      <div className="trip-days-slider">
        <h1>Dag {activeIndex + 1}</h1>

        {tripDays && tripDays.length > 0 ? (
          <Slider {...settings}>
            {tripDays.map((day) => (
              <div key={day._id} style={{ padding: "10px" }}>
                <div className="days-place">
                  <label>{day.place}</label>
                </div>
                <p>{day.description}</p>
                <ul>{day.activities?.length > 0 ? day.activities.map((activity, idx) => <li key={idx}>{activity}</li>) : <li>Geen activiteiten</li>}</ul>
              </div>
            ))}
          </Slider>
        ) : (
          <p>Er zijn geen dagen voor deze reis.</p>
        )}
      </div>

      {showEditModal && <EditTripDays tripDays={tripDays} setTripDays={setTripDays} tripId={tripId} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />}
    </div>
  );
}

export default TripDays;
