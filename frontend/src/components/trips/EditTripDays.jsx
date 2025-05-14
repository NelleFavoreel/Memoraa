import { useState } from "react";

function EditTripDays({ tripDays, setTripDays, tripId }) {
  const token = localStorage.getItem("token");
  const handleDayChange = (index, key, value) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[index][key] = value;
    setTripDays(updatedTripDays);
  };

  const handleAddActivity = (index, activity) => {
    if (activity.trim()) {
      const updatedTripDays = [...tripDays];
      updatedTripDays[index].activities.push(activity.trim());
      setTripDays(updatedTripDays);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:3001/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tripDays }),
      });

      if (!response.ok) {
        throw new Error("Fout bij het opslaan van de gegevens");
      }

      const result = await response.json();
      console.log("Wijzigingen opgeslagen:", result);
    } catch (error) {
      console.error("Fout bij het opslaan van wijzigingen:", error);
    }
  };

  return (
    <div>
      <h2>Dag per dag details</h2>
      {tripDays.map((day, index) => (
        <div key={index}>
          <h3>Dag {index + 1}</h3>
          <div>
            <label>Plaats</label>
            <input type="text" value={day.place || ""} onChange={(e) => handleDayChange(index, "place", e.target.value)} />
          </div>
          <div>
            <label>Activiteiten</label>
            <input type="text" id={`activity-${index}`} onChange={(e) => handleDayChange(index, "newActivity", e.target.value)} />
            <button
              type="button"
              onClick={() => {
                handleAddActivity(index, day.newActivity);
                handleDayChange(index, "newActivity", "");
              }}
            >
              Voeg toe
            </button>
            <ul>
              {day.activities.map((activity, i) => (
                <li key={i}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <button onClick={handleSaveChanges}>Opslaan</button>
    </div>
  );
}

export default EditTripDays;
