import React, { useState } from "react";
import FullButton from "../button/FullButton";
import { toast } from "react-toastify";

function ChangingPassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Nieuwe wachtwoorden komen niet overeen.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        toast.success("Wachtwoord is aangepast!");
        onClose();
      } else {
        toast.error("Wachtwoord veranderen niet gelukt");
      }
    } catch (err) {
      console.error("❌ Fout bij wachtwoord wijzigen:", err);
      toast.error("Wachtwoord veranderen niet gelukt");
    }
  };

  return (
    <div className="changing-password-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Huidig wachtwoord:</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label>Nieuw wachtwoord:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label>Bevestig nieuw wachtwoord:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="button-container-account">
          <FullButton type="submit">Wachtwoord wijzigen</FullButton>
          <button type="button" onClick={onClose}>
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangingPassword;
