import React, { useState } from "react";
import Slider from "react-slick";
import { SlArrowRight } from "react-icons/sl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", right: -40, zIndex: 1, cursor: "pointer" }} onClick={onClick}>
      <SlArrowRight size={15} color="white" />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", left: -40, zIndex: 1, cursor: "pointer" }} onClick={onClick}>
      <SlArrowRight size={15} color="white" style={{ transform: "rotate(180deg)" }} />
    </div>
  );
}

function TripDays({ tripDays }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveIndex(current),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (tripDays.length === 0) {
    return <p>Er zijn geen dagen voor deze reis.</p>;
  }

  const day = tripDays[activeIndex];

  return (
    <div className="trip-days-container">
      <h1>Dag {activeIndex + 1}</h1>

      <div className="trip-days-slider">
        <Slider {...settings}>
          {tripDays.map((day, index) => (
            <div key={day._id} style={{ padding: "10px" }}>
              <p>{day.description}</p>
              <ul>{day.activities && day.activities.length > 0 ? day.activities.map((activity, idx) => <li key={idx}>{activity}</li>) : <li>Geen activiteiten</li>}</ul>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default TripDays;
