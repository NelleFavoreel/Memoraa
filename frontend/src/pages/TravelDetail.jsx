import TripDetail from "../components/trips/TripDetail";
import EditTrip from "../components/trips/EditTip";
import { Link } from "react-router-dom";

import { useParams } from "react-router-dom";

function TravelDetail() {
  const { id } = useParams();

  return (
    <div>
      <TripDetail></TripDetail>
      <Link to={`/edit-trip/${id}`}>
        <button>Bewerk reis</button>
      </Link>
      <h2>TravelDetail</h2>
      <p>Comming soon... 👉</p>
    </div>
  );
}

export default TravelDetail;
