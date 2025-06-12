import { useEffect, useState } from "react";
import TripDetail from "../../components/trips/TripDetail";
import EditTrip from "../../components/trips/EditTip";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./TripDetail.css";
import FullButton from "../../components/button/FullButton";
import { SlArrowRight } from "react-icons/sl";
import AddButton from "../../components/button/AddButton";
import Underline from "../../components/button/Underline";

function TravelDetail({ setHideNavbar, hideNavbar }) {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  useEffect(() => {
    fetch(`http://localhost:3001/trips/${id}`)
      .then((res) => res.json())
      .then((data) => setTrip(data.trip))
      .catch((err) => console.error("Fout bij ophalen van trip:", err));
  }, [id]);

  if (!trip) return <p>Reis wordt geladen...</p>;

  return (
    <div className={`trip-detail-container ${token && !hideNavbar ? "with-back-button" : "without-back-button"}`}>
      <div className="trip-detail-edit-trip"></div>

      <TripDetail trip={trip} setHideNavbar={setHideNavbar} hideNavbar={hideNavbar} />
    </div>
  );
}

export default TravelDetail;
