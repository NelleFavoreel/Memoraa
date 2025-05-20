import { useState } from "react";
import TravelInfo from "../../components/trips/TravelInfo";
import AddTrip from "../../components/trips/AddTrip";
import "./Trips.css";
import FullButton from "../../components/button/FullButton";

function TravelOverview() {
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleTripAdded = () => {
    setRefresh(true);
    setShowModal(false);
  };

  const handleRefreshed = () => {
    setRefresh(false);
  };

  return (
    <>
      <FullButton onClick={() => setShowModal(true)}>Voeg een reis toe</FullButton>
      <AddTrip show={showModal} onClose={() => setShowModal(false)} onTripAdded={handleTripAdded} />
      <TravelInfo refresh={refresh} onRefreshed={handleRefreshed} />
    </>
  );
}

export default TravelOverview;
