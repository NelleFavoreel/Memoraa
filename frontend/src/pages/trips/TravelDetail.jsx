import TripDetail from "../../components/trips/TripDetail";
import EditTrip from "../../components/trips/EditTip";
import { Link } from "react-router-dom";
import "./Trips.css";
import { useParams } from "react-router-dom";
import FullButton from "../../components/button/FullButton";
function TravelDetail() {
  const { id } = useParams();

  return (
    <div>
      <TripDetail></TripDetail>
      <Link to={`/edit-trip/${id}`}>
        <FullButton>Bewerk reis</FullButton>
      </Link>
    </div>
  );
}

export default TravelDetail;
