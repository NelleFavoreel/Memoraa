import React, { useState } from "react";
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

function TripDays({ tripDays, setTripDays, onDayChange, initialTripDays, tripId }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);

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

  if (tripDays.length === 0) {
    return <p>Er zijn geen dagen voor deze reis.</p>;
  }

  return (
    <div className="trip-days-container">
      <Underline onClick={() => setShowEditModal(true)}>
        <SlSettings />
      </Underline>
      <div className="trip-days-slider">
        <h1>Dag {activeIndex + 1}</h1>
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
      </div>
      {showEditModal && <EditTripDays tripDays={tripDays} setTripDays={setTripDays} tripId={tripId} isOpen={showEditModal} onClose={() => setShowEditModal(false)} />}
    </div>
  );
}

export default TripDays;
