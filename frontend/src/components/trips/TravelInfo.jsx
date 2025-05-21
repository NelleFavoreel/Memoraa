import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteTrip from "./DeleteTrip";
import FullButton from "../button/FullButton";
import Underline from "../button/Underline";
import { SlArrowRight } from "react-icons/sl";
import Filters from "../../components/trips/filters/Filters";

function TravelInfo({ refresh, onRefreshed }) {
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  const [filters, setFilters] = useState({
    status: "all",
    year: "",
    search: "",
    myTrips: false,
  });

  const fetchTrips = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/trips", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Niet geautoriseerd of fout bij ophalen.");
        return res.json();
      })
      .then((data) => {
        setTrips(data);
        if (onRefreshed) onRefreshed();
      })
      .catch((err) => {
        console.error("❌ Fout bij ophalen van trips:", err);
      });
  };
  const filteredTrips = trips.filter((trip) => {
    const now = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (filters.status === "past" && endDate >= now) return false;
    if (filters.status === "future" && startDate < now) return false;

    if (filters.year && startDate.getFullYear() !== Number(filters.year)) return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const placeMatch = trip.place?.toLowerCase().includes(searchLower);
      const countryMatch = trip.country?.toLowerCase().includes(searchLower);
      if (!placeMatch && !countryMatch) return false;
    }

    if (filters.myTrips && !trip.travelers?.includes(userId)) return false;

    return true;
  });
  // Eerste keer laden
  useEffect(() => {
    fetchTrips();
  }, []);

  // Herladen als refresh verandert naar true
  useEffect(() => {
    if (refresh) {
      fetchTrips();
    }
  }, [refresh]);

  const handleDelete = (id) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));
  };

  return (
    <div>
      <Filters filters={filters} onFiltersChange={setFilters} />
      <h1 className="title">Alle reizen</h1>
      {filteredTrips.map((trip, index) => (
        <li key={trip._id} className={`trip-item ${index % 2 !== 0 ? "reverse" : ""}`}>
          <div className="trip-content">
            {trip.imageUrl && <img src={trip.imageUrl} alt={`Afbeelding van ${trip.place || trip.country}`} className="trip-image" />}
            <div className="trip-info-container">
              <h2 className="trips-info-title">{trip.tripType === "roadtrip" && trip.countries?.length > 0 ? trip.countries.join(" - ") : `${trip.place}`}</h2>

              <div className="trip-info">
                {trip.travelers?.includes(userId) && (
                  <div className="trip-delete-button">
                    <DeleteTrip tripId={trip._id} onDelete={handleDelete} />
                  </div>
                )}
                <p>
                  <strong>Type:</strong> {trip.tripType}
                </p>
                <p>
                  <strong>Datum:</strong> {new Date(trip.startDate).toLocaleDateString()} tot {new Date(trip.endDate).toLocaleDateString()}
                </p>
                <div className="trip-link">
                  <Underline>
                    <Link to={`/trips/${trip._id}`}>
                      Bekijk de reisdetails <SlArrowRight />
                    </Link>
                  </Underline>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </div>
  );
}

function FetchUserInfo({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Fout bij ophalen van gebruiker:", err);
      });
  }, [userId]);

  if (!user) {
    return <span>Laden...</span>;
  }

  return (
    <span>
      {user.name} ({user.screenName})
    </span>
  );
}

export default TravelInfo;
