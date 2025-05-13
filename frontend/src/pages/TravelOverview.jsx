import TravelInfo from "../components/trips/TravelInfo";
import AddTrip from "../components/trips/AddTrip";
import DeleteTrip from "../components/trips/DeleteTrip";

function TravelOverview() {
  return (
    <>
      <TravelInfo></TravelInfo>
      <AddTrip></AddTrip>
    </>
  );
}

export default TravelOverview;
