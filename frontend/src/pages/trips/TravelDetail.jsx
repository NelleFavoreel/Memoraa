import { useEffect, useState } from "react";
import TripDetail from "../../components/trips/TripDetail";
import EditTrip from "../../components/trips/EditTip";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./TripDetail.css";
import FullButton from "../../components/button/FullButton";
import { SlArrowRight } from "react-icons/sl";
import { SlClose } from "react-icons/sl";
import { SlPencil } from "react-icons/sl";
import AddButton from "../../components/button/AddButton";

function TravelDetail({ setHideNavbar }) {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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
          // <Link to={`/edit-trip/${id}`}>
          <AddButton onClick={() => setShowModal(true)}>
            <SlPencil />
          </AddButton>
          // </Link>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content1">
              <EditTrip onClose={() => setShowModal(false)} />{" "}
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
                style={{
                  float: "right",
                  fontSize: "2rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <TripDetail trip={trip} setHideNavbar={setHideNavbar} />
    </div>
  );
}

export default TravelDetail;
