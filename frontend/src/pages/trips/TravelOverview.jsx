import { useState } from "react";
import TravelInfo from "../../components/trips/TravelInfo";
import AddTrip from "../../components/trips/AddTrip";
import "./Trips.css";
import "../../components/trips/AnimationTrips.css";
import FullButton from "../../components/button/FullButton";
import AddButton from "../../components/button/AddButton";
import { useNavigate } from "react-router-dom";

function TravelOverview() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const handleTripAdded = (tripId) => {
    setRefresh(true);
    setShowModal(false);
    if (tripId) {
      navigate(`/trips/${tripId}`);
    }
  };

  const handleRefreshed = () => {
    setRefresh(false);
  };

  return (
    <>
      <div className="model-form-container">
        <AddButton onClick={() => setShowModal(true)}>+</AddButton>
      </div>
      <AddTrip show={showModal} onClose={() => setShowModal(false)} onTripAdded={handleTripAdded} />
      <TravelInfo refresh={refresh} onRefreshed={handleRefreshed} />
    </>
  );
}

export default TravelOverview;
