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
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState([]);
  const [originalTrip, setOriginalTrip] = useState(null);
  const [originalTripDays, setOriginalTripDays] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("http://localhost:3001/family/friends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFamilyMembers(data);
      } catch (error) {
        console.error("Fout bij het ophalen van vrienden:", error);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3001/trips/${id}`);
        const data = await res.json();
        setTrip(data.trip);
        setOriginalTrip(data.trip);
        setTripDays(data.tripDays);
        setOriginalTripDays(data.tripDays);
      } catch (error) {
        console.error("Fout bij ophalen van trip details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);
  useEffect(() => {
    if (trip && !trip.travelers.includes(currentUserId)) {
      setTrip((prevTrip) => ({
        ...prevTrip,
        travelers: [...prevTrip.travelers, currentUserId],
      }));
    }
  }, [trip, currentUserId]);

  const handleTravelerToggle = (userId) => {
    if (!trip) return;

    const isFamilyMember = familyMembers.some((member) => member._id === userId);
    if (!isFamilyMember) {
      alert("Je kunt alleen familieleden toevoegen.");
      return;
    }

    const isTraveler = trip.travelers.includes(userId);
    const updatedTravelers = isTraveler ? trip.travelers.filter((id) => id !== userId) : [...trip.travelers, userId];

    setTrip((prevTrip) => ({
      ...prevTrip,
      travelers: updatedTravelers,
    }));
  };
  const handleCheckboxChange = (memberId) => {
    setSelectedFamilyMembers((prevSelected) => {
      if (prevSelected.includes(memberId)) {
        return prevSelected.filter((id) => id !== memberId);
      } else {
        return [...prevSelected, memberId];
      }
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const updatedTrip = {};

    if (trip.place !== originalTrip.place) updatedTrip.place = trip.place;
    if (trip.country !== originalTrip.country) updatedTrip.country = trip.country;
    if (trip.startDate !== originalTrip.startDate) updatedTrip.startDate = trip.startDate;
    if (trip.endDate !== originalTrip.endDate) updatedTrip.endDate = trip.endDate;
    if (JSON.stringify(trip.travelers) !== JSON.stringify(originalTrip.travelers)) updatedTrip.travelers = trip.travelers;

    if (JSON.stringify(tripDays) !== JSON.stringify(originalTripDays)) updatedTrip.tripDays = tripDays;

    if (trip.cover !== originalTrip.cover) updatedTrip.cover = trip.cover;

    console.log("Updated Trip:", updatedTrip);

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
            {familyMembers.map((member) => (
              <li key={member._id}>
                <label>
                  <input type="checkbox" checked={trip.travelers.includes(member._id)} onChange={() => handleTravelerToggle(member._id)} />
                  {member.name} ({member.screenName})
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Opslaan</button>
      </form>
      <EditTripDays tripDays={tripDays} setTripDays={setTripDays} tripId={id} />
    </div>
  );
}

export default EditTrip;
