import { useState } from "react";

function EditTripDays({ tripDays, setTripDays }) {
  const handleDayChange = (index, key, value) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[index][key] = value;
    setTripDays(updatedTripDays);
  };

  const handleAddActivity = (index, activity) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[index].activities.push(activity);
    setTripDays(updatedTripDays);
  };

  return (
    <div>
      <h2>Dag per dag details</h2>
      {tripDays.map((day, index) => (
        <div key={index}>
          <h3>Dag {index + 1}</h3>
          <div>
            <label>Plaats</label>
            <input type="text" value={day.place} onChange={(e) => handleDayChange(index, "place", e.target.value)} />
          </div>
          <div>
            <label>Activiteiten</label>
            <input type="text" onChange={(e) => handleAddActivity(index, e.target.value)} />
            <ul>
              {day.activities.map((activity, i) => (
                <li key={i}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditTripDays;
