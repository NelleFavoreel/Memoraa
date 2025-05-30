import React, { useState } from "react";
import axios from "axios";

function AddPictures({ tripId, onPhotoAdded }) {
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Nieuw: toggle voor uitklappen

  const handleAddPhoto = async () => {
    if (!imageUrl) {
      setError("Vul een geldige afbeelding URL in.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/trips/${tripId}/photos`, { imageUrl, description });
      setImageUrl("");
      setDescription("");
      if (onPhotoAdded) onPhotoAdded();
    } catch (err) {
      setError("Fout bij toevoegen foto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pictures">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)}>+ Voeg een foto toe</button>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
          <input type="text" placeholder="Afbeelding URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <input type="text" placeholder="Beschrijving (optioneel)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleAddPhoto} disabled={loading}>
              {loading ? "Toevoegen..." : "Voeg foto toe"}
            </button>
            <button onClick={() => setIsOpen(false)} type="button">
              Annuleer
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default AddPictures;
