import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteTrip from "./DeleteTrip";
import FullButton from "../button/FullButton";
import Underline from "../button/Underline";
import { SlArrowRight } from "react-icons/sl";
import Filters from "../../components/trips/filters/Filters";
import useAnimateOnVisible from "../animations/useAnimateOnVisible";
import CustomCursor from "../animations/CustomCursor";

function TravelInfo({ refresh, onRefreshed, scrollY }) {
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;
  const [visibleCount, setVisibleCount] = useState(5);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

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
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 7);
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
  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchTrips();
    }
  }, [refresh]);

  useEffect(() => {
    if (filteredTrips.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            entry.target.classList.remove("fade-out");
          } else {
            entry.target.classList.remove("animate");
            entry.target.classList.add("fade-out");
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".trip-image-little img");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredTrips, visibleCount]);

  useAnimateOnVisible(".trip-info", [trips, visibleCount, filters]);

  const getSmallPhotos = (trip) => {
    const dayPhotos = trip.randomPhotos || [];
    const generalPhotos = (trip.photos || []).map((photo) => photo.imageUrl);
    const allPhotos = [...dayPhotos, ...generalPhotos];
    return allPhotos.slice(0, 2);
  };

  const now = new Date();

  const upcomingTrips = filteredTrips.filter((trip) => new Date(trip.startDate) >= now).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const pastTrips = filteredTrips.filter((trip) => new Date(trip.endDate) < now).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  const sortedTrips = [...upcomingTrips, ...pastTrips];
  return (
    <div>
      <Filters filters={filters} onFiltersChange={setFilters} />
      <div className="trips-list">
        {sortedTrips.slice(0, visibleCount).map((trip, index) => (
          <li key={trip._id} className={`trip-item ${index % 2 !== 0 ? "reverse" : ""}`}>
            <Link to={`/trips/${trip._id}`}>
              <div className="trip-content" onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })} onMouseEnter={() => setShowCursor(true)} onMouseLeave={() => setShowCursor(false)}>
                {trip.imageUrl && <img src={trip.imageUrl} alt={`Afbeelding van ${trip.place || trip.country}`} className="trip-image" />}{" "}
                <div className="trip-image-little">{getSmallPhotos(trip).length > 0 && getSmallPhotos(trip).map((photo, idx) => <img key={idx} src={photo} alt={`Reisfoto ${idx + 1}`} />)}</div>
                <div className="trip-info-container">
                  <div className="trip-info parallax" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
                    <h2 className="trips-info-title">
                      <Link to={`/trips/${trip._id}`}>{trip.tripType === "roadtrip" && trip.countries?.length > 0 ? trip.countries.join(" - ") : `${trip.place}`}</Link>
                    </h2>

                    <p>
                      <label>Type:</label> {trip.tripType}
                    </p>
                    <p>
                      <label>Datum:</label> {new Date(trip.startDate).toLocaleDateString()} tot {new Date(trip.endDate).toLocaleDateString()}
                    </p>

                    <div className="trip-link">
                      <Link to={`/trips/${trip._id}`}>
                        <button>
                          <SlArrowRight />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
        {visibleCount < sortedTrips.length && (
          <div className="load-more-container">
            <FullButton onClick={handleLoadMore}>Meer tonen</FullButton>
          </div>
        )}
      </div>
      {showCursor && <CustomCursor x={cursorPos.x} y={cursorPos.y} />}
    </div>
  );
}

export default TravelInfo;
