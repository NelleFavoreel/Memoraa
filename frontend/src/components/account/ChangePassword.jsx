import React, { useState } from "react";

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

      const data = await response.json();

      if (response.ok) {
        alert("Wachtwoord succesvol gewijzigd!");
        onClose(); // Sluit formulier
      } else {
        setError(data.message || "Wachtwoord wijzigen mislukt.");
      }
    } catch (err) {
      console.error("❌ Fout bij wachtwoord wijzigen:", err);
      setError("Er is een fout opgetreden.");
    }
  };

  return (
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
      <button type="submit">Wachtwoord wijzigen</button>
      <button type="button" onClick={onClose}>
        Annuleren
      </button>
    </form>
  );
}

export default ChangingPassword;
