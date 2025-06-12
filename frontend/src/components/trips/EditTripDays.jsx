import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullButton from "../button/FullButton";
import DeleteButton from "../button/DeleteButton";
import AddButton from "../button/AddButton";
import { toast } from "react-toastify";
import LoginModal from "../modal/LoginModal";

function EditTripDays({ tripId, isOpen, onClose, tripDays, setTripDays }) {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  if (!tripDays || tripDays.length === 0) {
    return <p>Reisdagen worden geladen of zijn niet beschikbaar.</p>;
  }

  const handleDayChange = (index, key, value) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[index][key] = value;
    setTripDays(updatedTripDays);
  };

  const handleAddActivity = (index) => {
    const updatedTripDays = [...tripDays];
    const newActivity = updatedTripDays[index].newActivity?.trim();
    if (newActivity) {
      if (!updatedTripDays[index].activities) updatedTripDays[index].activities = [];
      updatedTripDays[index].activities.push(newActivity);
      updatedTripDays[index].newActivity = "";
      setTripDays(updatedTripDays);
    }
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[dayIndex].activities.splice(activityIndex, 1);
    setTripDays(updatedTripDays);
  };

  // Foto verwijderen
  const handlePhotoDelete = (dayIndex, photoIndex) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[dayIndex].photos.splice(photoIndex, 1);
    setTripDays(updatedTripDays);
  };

  // Foto's uploaden (zelfde functie als jij had)
  const resizeImageToBase64 = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (index, files) => {
    if (!files || files.length === 0) return;

    try {
      const compressedImages = await Promise.all(Array.from(files).map((file) => resizeImageToBase64(file)));

      const updatedTripDays = [...tripDays];
      if (!updatedTripDays[index].photos) {
        updatedTripDays[index].photos = [];
      }
      updatedTripDays[index].photos.push(...compressedImages);
      setTripDays(updatedTripDays);
    } catch (err) {
      console.error("Fout bij verkleinen van foto's:", err);
      toast.error("Fout bij verkleinen van foto's.");
    }
  };

  // Opslaan functie hetzelfde als jij had
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

      if (!response.ok) throw new Error("Fout bij het opslaan van de gegevens");

      const result = await response.json();
      console.log("Wijzigingen opgeslagen:", result);
      if (onClose) onClose();
      else navigate(`/trips/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Fout bij het opslaan van wijzigingen:", error);
      toast.error("Er is een fout opgetreden bij het opslaan.");
    }
  };

  // De actieve dag om makkelijk te renderen
  const activeDay = tripDays[activeIndex];

  return (
    <LoginModal isOpen={isOpen} onClose={onClose}>
      <div className="edit-trip-days-container">
        <div className="edit-trip-modal">
          {/* Dropdown om dag te kiezen */}
          <div style={{ display: "flex", alignItems: "center", width: "80%", height: "40px" }}>
            <div>
              <label htmlFor="day-select" style={{ marginRight: "10px" }}>
                Kies dag:
              </label>
              <select id="day-select" value={activeIndex} onChange={(e) => setActiveIndex(Number(e.target.value))}>
                {tripDays.map((_, idx) => (
                  <option key={idx} value={idx}>
                    Dag {idx + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="trip-day-content">
            <div>
              <label>Plaats</label>
              <input type="text" value={activeDay.place || ""} onChange={(e) => handleDayChange(activeIndex, "place", e.target.value)} />

              <div className="traveler-selection">
                <label>Activiteiten</label>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    {/* <tr className="table-header">
                      <th style={{ textAlign: "left", padding: "5px" }}>Activiteit</th>
                      <th style={{ textAlign: "left", padding: "5px" }}>Verwijderen</th>
                    </tr> */}
                  </thead>
                  <tbody>
                    {activeDay.activities?.length > 0 ? (
                      activeDay.activities.map((activity, i) => (
                        <tr key={i}>
                          <td style={{ padding: "8px", color: "black" }}>{activity}</td>
                          <td style={{ padding: "8px" }}>
                            <DeleteButton type="button" onClick={() => handleRemoveActivity(activeIndex, i)} className="delete-button" style={{ marginLeft: "10px" }}>
                              x
                            </DeleteButton>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ padding: "8px", color: "black" }}>Geen activiteiten</td>
                        <td></td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="2" className="new-activity-row" style={{ padding: "0px" }}>
                        <textarea
                          className="custom-select"
                          placeholder="Nieuwe activiteit toevoegen..."
                          value={activeDay.newActivity || ""}
                          onChange={(e) => handleDayChange(activeIndex, "newActivity", e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddActivity(activeIndex);
                            }
                          }}
                          rows={4}
                          style={{ width: "100%", resize: "vertical" }}
                        />
                        <AddButton type="button" onClick={() => handleAddActivity(activeIndex)}>
                          +
                        </AddButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="photo-upload">
              <label>Foto toevoegen</label>
              <input type="file" accept="image/*" multiple onChange={(e) => handlePhotoUpload(activeIndex, e.target.files)} />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", width: "100%", flexWrap: "wrap", flexDirection: "row" }}>
                {activeDay.photos?.map((photo, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                    <img src={photo} alt="upload preview" />
                    <DeleteButton
                      onClick={() => handlePhotoDelete(activeIndex, i)}
                      style={{
                        position: "absolute",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </DeleteButton>
                  </div>
                ))}
              </div>
            </div>

            <div className="button-container-edit-days">
              <FullButton onClick={handleSaveChanges} style={{ marginTop: "20px" }}>
                Wijzigingen opslaan
              </FullButton>
              <button onClick={onClose} style={{ marginTop: "0px", marginLeft: "20px" }} className="cancel-button">
                Annuleren
              </button>
            </div>
          </div>
        </div>
      </div>
    </LoginModal>
  );
}

export default EditTripDays;
