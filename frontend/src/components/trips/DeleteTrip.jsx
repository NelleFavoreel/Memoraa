// DeleteTrip.js
import React from "react";

function DeleteTrip({ tripId, onDelete }) {
  const handleDelete = () => {
    fetch(`http://localhost:3001/trips/${tripId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          console.log("Reis succesvol verwijderd.");
          onDelete(tripId); // Callback om de reis uit de lijst te verwijderen
        } else {
          console.log("Fout bij verwijderen van reis.");
        }
      })
      .catch((err) => {
        console.error("Fout bij verwijderen van reis:", err);
      });
  };

  return <button onClick={handleDelete}>Verwijder reis</button>;
}

export default DeleteTrip;
