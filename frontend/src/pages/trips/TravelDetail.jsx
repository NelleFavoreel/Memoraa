import { useEffect, useState } from "react";
import TripDetail from "../../components/trips/TripDetail";
import EditTrip from "../../components/trips/EditTip";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./TripDetail.css";
import FullButton from "../../components/button/FullButton";
import { SlArrowRight } from "react-icons/sl";

function TravelDetail({ setHideNavbar }) {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]); // <- DIT toevoegen

  useEffect(() => {
    fetch(`http://localhost:3001/trips/${id}`)
      .then((res) => res.json())
      .then((data) => setTrip(data.trip))
      .catch((err) => console.error("Fout bij ophalen van trip:", err));
  }, [id]);

  if (!trip) return <p>Reis wordt geladen...</p>;

  const isTraveler = trip.travelers.includes(currentUserId);
  return (
    <div className="trip-detail-container">
      <div className="back-button-detail" onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <SlArrowRight style={{ transform: "rotate(180deg)", marginRight: "0.5rem" }} />
        <span>Terug</span>
      </div>
      <div className="trip-detail-edit-trip">
        {isTraveler && (
          <Link to={`/edit-trip/${id}`}>
            <FullButton>Bewerk reis</FullButton>
          </Link>
        )}
      </div>
      <TripDetail trip={trip} setHideNavbar={setHideNavbar} />
    </div>
  );
}

export default TravelDetail;
