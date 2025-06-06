import React from "react";
import { toast } from "react-toastify";
import DeleteButton from "../button/DeleteButton";
import { useNavigate } from "react-router-dom";

function DeleteTrip({ tripId, onDelete }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleDelete = (event) => {
    event.stopPropagation();

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
          // Als je op detailpagina bent, ga dan terug naar trips overzicht
          navigate("/trips");
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
