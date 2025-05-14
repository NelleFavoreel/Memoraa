import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditTripDays from "./EditTripDays";

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

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  const [trip, setTrip] = useState(null);
  const [tripDays, setTripDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState([]);

  const [originalTrip, setOriginalTrip] = useState(null);
  const [originalTripDays, setOriginalTripDays] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3001/trips/${id}`);
        const data = await res.json();
        setTrip(data.trip);
        setOriginalTrip(data.trip); // Bewaar originele trip
        setTripDays(data.tripDays);
        setOriginalTripDays(data.tripDays); // Bewaar originele tripDays
      } catch (error) {
        console.error("Fout bij ophalen van trip details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  const handleTravelerToggle = (userId) => {
    if (!trip) return;

    // Alleen familieleden mogen toegevoegd worden
    const isFamilyMember = familyMembers.some((member) => member._id === userId);
    if (!isFamilyMember) {
      alert("Je kunt alleen familieleden toevoegen.");
      return;
    }

    const isTraveler = trip.travelers.includes(userId);
    const updatedTravelers = isTraveler ? trip.travelers.filter((id) => id !== userId) : [...trip.travelers, userId];

    // Update de trip state met de nieuwe lijst van reizigers
    setTrip((prevTrip) => ({
      ...prevTrip,
      travelers: updatedTravelers,
    }));
  };
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    // Maak een object voor de bijgewerkte trip
    const updatedTrip = {};

    // Voeg alleen de velden toe die gewijzigd zijn
    if (trip.place !== originalTrip.place) updatedTrip.place = trip.place;
    if (trip.country !== originalTrip.country) updatedTrip.country = trip.country;
    if (trip.startDate !== originalTrip.startDate) updatedTrip.startDate = trip.startDate;
    if (trip.endDate !== originalTrip.endDate) updatedTrip.endDate = trip.endDate;
    if (JSON.stringify(trip.travelers) !== JSON.stringify(originalTrip.travelers)) updatedTrip.travelers = trip.travelers;

    // Alleen tripDays toevoegen als ze veranderd zijn
    if (JSON.stringify(tripDays) !== JSON.stringify(originalTripDays)) updatedTrip.tripDays = tripDays;

    // Als de cover niet is gewijzigd, wordt het niet toegevoegd
    if (trip.cover !== originalTrip.cover) updatedTrip.cover = trip.cover;

    console.log("Updated Trip:", updatedTrip); // Bekijk wat er wordt verzonden

    try {
      const response = await fetch(`http://localhost:3001/trips/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTrip),
      });

      if (!response.ok) throw new Error("Fout bij het bijwerken van de reis");

      const data = await response.json();
      alert(data.message || "Reis opgeslagen!");
      navigate(`/trips/${id}`);
    } catch (error) {
      console.error("Fout bij opslaan:", error);
      alert("Er is een fout opgetreden bij het opslaan van de reis.");
    }
  };

  if (loading || !trip) return <p>De reisgegevens worden geladen...</p>;

  // Voeg de huidige gebruiker altijd toe aan de reizigerslijst
  if (!trip.travelers.includes(currentUserId)) {
    trip.travelers.push(currentUserId);
  }

  return (
    <div>
      <h1>Bewerk reis</h1>
      <form onSubmit={handleSaveChanges}>
        <div>
          <label>Land</label>
          <input type="text" value={trip.country} onChange={(e) => setTrip({ ...trip, country: e.target.value })} />
        </div>

        <div>
          <label>Startdatum</label>
          <input type="date" value={new Date(trip.startDate).toISOString().split("T")[0]} onChange={(e) => setTrip({ ...trip, startDate: e.target.value })} />
        </div>

        <div>
          <label>Einddatum</label>
          <input type="date" value={new Date(trip.endDate).toISOString().split("T")[0]} onChange={(e) => setTrip({ ...trip, endDate: e.target.value })} />
        </div>

        <div>
          <label>Reizigers</label>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {trip.travelers.map((userId) => (
              <li key={userId}>
                <label>
                  <input type="checkbox" checked={trip.travelers.includes(userId)} onChange={() => handleTravelerToggle(userId)} />
                  <FetchUserInfo userId={userId} /> {/* Haal gebruikersinfo op */}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Opslaan</button>
      </form>

      <EditTripDays tripDays={tripDays} setTripDays={setTripDays} />
    </div>
  );
}

export default EditTrip;
