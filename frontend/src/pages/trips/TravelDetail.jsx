import { useEffect, useState } from "react";
import TripDetail from "../../components/trips/TripDetail";
import EditTrip from "../../components/trips/EditTip";
import { Link } from "react-router-dom";
import "./Trips.css";
import { useParams } from "react-router-dom";
import FullButton from "../../components/button/FullButton";
function TravelDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  useEffect(() => {
    fetch(`http://localhost:3001/trips/${id}`)
      .then((res) => res.json())
      .then((data) => setTrip(data.trip))
      .catch((err) => console.error("Fout bij ophalen van trip:", err));
  }, [id]);

  if (!trip) return <p>Reis wordt geladen...</p>;

  const isTraveler = trip.travelers.includes(currentUserId);
  return (
    <div>
      <TripDetail />
      {isTraveler && (
        <Link to={`/edit-trip/${id}`}>
          <FullButton>Bewerk reis</FullButton>
        </Link>
      )}
    </div>
  );
}

export default TravelDetail;
