// DeleteTrip.js
import React from "react";
import { toast } from "react-toastify";
import DeleteButton from "../button/DeleteButton";
function DeleteTrip({ tripId, onDelete }) {
  const token = localStorage.getItem("token");
  const handleDelete = () => {
    fetch(`http://localhost:3001/trips/${tripId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Reis succesvol verwijderd.");
          onDelete(tripId);
        } else {
          toast.error("Fout bij verwijderen van reis.");
        }
      })
      .catch((err) => {
        toast.error("Fout bij verwijderen van reis, probeer het later opnieuw.");
        console.error("Fout bij verwijderen van reis:", err);
      });
  };

  return <DeleteButton onClick={handleDelete}>X</DeleteButton>;
}

export default DeleteTrip;
