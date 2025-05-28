import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditTripDays from "./EditTripDays";
import "./EditTrip.css";
import FullButton from "../button/FullButton";
import { toast } from "react-toastify";

function EditTrip({ onClose }) {
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
  const [hasAccess, setHasAccess] = useState(true);
  const [showDaysEditor, setShowDaysEditor] = useState(false);

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
  const regenerateTripDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const newDays = [];

    const daysCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      newDays.push({
        dayNumber: i + 1,
        date: date.toISOString(),
        activities: [],
        place: "",
        photos: [],
      });
    }

    setTripDays(newDays);
  };

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3001/trips/${id}`);
        const data = await res.json();
        setTrip(data.trip);
        if (!data.trip.travelers.includes(currentUserId)) {
          setHasAccess(false);
        }
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
      toast.success(data.message || "Reis opgeslagen!");
      if (onClose) onClose();
      else navigate(`/trips/${id}`);
    } catch (error) {
      console.error("Fout bij opslaan:", error);
      toast.error("Er is een fout opgetreden bij het opslaan van de reis.");
    }
  };

  if (loading || !trip) return <p>De reisgegevens worden geladen...</p>;

  return (
    <div className="edit-trip-modal">
      <div className="edit-trip-container">
        {showDaysEditor ? (
          <>
            <FullButton onClick={() => setShowDaysEditor(false)} className="edit-days-toggle-button">
              Terug naar algemene info
            </FullButton>
            <EditTripDays tripDays={tripDays} setTripDays={setTripDays} tripId={id} />
          </>
        ) : (
          <>
            <div className="trip-edit-general-info">
              <form onSubmit={handleSaveChanges} className="edit-trip-form">
                <div>
                  <div>
                    <label>Land</label>
                    <input type="text" value={trip.country} onChange={(e) => setTrip({ ...trip, country: e.target.value })} />
                  </div>

                  <div>
                    <label>Startdatum</label>
                    <input
                      type="date"
                      value={new Date(trip.startDate).toISOString().split("T")[0]}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        setTrip({ ...trip, startDate: newStartDate });
                        regenerateTripDays(newStartDate, trip.endDate);
                      }}
                    />
                  </div>

                  <div>
                    <label>Einddatum</label>
                    <input
                      type="date"
                      value={new Date(trip.endDate).toISOString().split("T")[0]}
                      onChange={(e) => {
                        const newEndDate = e.target.value;
                        setTrip({ ...trip, endDate: newEndDate });
                        regenerateTripDays(trip.startDate, newEndDate);
                      }}
                    />
                  </div>
                </div>

                <div className="traveler-selection">
                  <label>Reizigers</label>
                  <table style={{ borderCollapse: "collapse" }}>
                    <thead>
                      <tr className="table-header">
                        <th style={{ textAlign: "left", padding: "5px" }}>Naam</th>
                        <th style={{ textAlign: "left", padding: "5px" }}>Meereizend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {familyMembers.map((member) => (
                        <tr key={member._id}>
                          <td style={{ padding: "8px" }}>{member.screenName}</td>
                          <td style={{ padding: "8px" }}>
                            <input type="checkbox" checked={trip.travelers.includes(member._id)} onChange={() => handleTravelerToggle(member._id)} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="edit-trip-buttons">
                  <div className="button-container-edit">
                    <FullButton type="submit">Opslaan</FullButton>
                  </div>
                  <FullButton onClick={() => setShowDaysEditor(true)} className="edit-days-toggle-button">
                    Bewerk de dagen afzonderlijk
                  </FullButton>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditTrip;
