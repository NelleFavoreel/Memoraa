import React, { useState } from "react";
import Slider from "react-slick";
import { SlArrowRight } from "react-icons/sl";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FullButton from "../button/FullButton";
import DeleteButton from "../button/DeleteButton";
import AddButton from "../button/AddButton";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", right: "-0vh", zIndex: 1, cursor: "pointer", top: "30px" }} onClick={onClick}>
      <SlArrowRight size={15} color="white" />
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block", left: "-0vh", zIndex: 1, cursor: "pointer", top: "30px" }} onClick={onClick}>
      <SlArrowRight size={15} color="white" style={{ transform: "rotate(180deg)" }} />
    </div>
  );
}

function EditTripDays({ tripDays, setTripDays, tripId }) {
  const token = localStorage.getItem("token");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Update een veld van een dag (plaats, newActivity, etc)
  const handleDayChange = (index, key, value) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[index][key] = value;
    setTripDays(updatedTripDays);
  };

  // Voeg activiteit toe en maak het invoerveld leeg
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

  // Verwijder activiteit
  const handleRemoveActivity = (dayIndex, activityIndex) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[dayIndex].activities.splice(activityIndex, 1);
    setTripDays(updatedTripDays);
  };

  // Verklein en converteer foto naar base64
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

  // Foto verwijderen
  const handlePhotoDelete = (dayIndex, photoIndex) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[dayIndex].photos.splice(photoIndex, 1);
    setTripDays(updatedTripDays);
  };

  // Foto's uploaden en toevoegen aan dag
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
    }
  };

  // Alles opslaan
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
      setSuccessMessage("Wijzigingen succesvol opgeslagen! ✅");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Fout bij het opslaan van wijzigingen:", error);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveIndex(current),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <div className="edit-trip-slider">
        {successMessage && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            {successMessage}
          </div>
        )}

        <Slider {...settings}>
          {tripDays.map((day, index) => (
            <div key={index} className="trip-day">
              <h2>Dag {index + 1}</h2>
              <div className="trip-day-content">
                <div>
                  <label>Plaats</label>
                  <input type="text" value={day.place || ""} onChange={(e) => handleDayChange(index, "place", e.target.value)} />
                </div>

                <div className="traveler-selection">
                  <label>Activiteiten</label>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr className="table-header">
                        <th style={{ textAlign: "left", padding: "5px" }}>Activiteit</th>
                        <th style={{ textAlign: "left", padding: "5px" }}>Verwijderen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.activities?.length > 0 ? (
                        day.activities.map((activity, i) => (
                          <tr key={i}>
                            <td style={{ padding: "8px", color: "white" }}>{activity}</td>
                            <td style={{ padding: "8px" }}>
                              <DeleteButton type="button" onClick={() => handleRemoveActivity(index, i)} className="delete-button" style={{ marginLeft: "10px" }}>
                                x
                              </DeleteButton>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td style={{ padding: "8px", color: "white" }}>Geen activiteiten</td>
                          <td></td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan="2" style={{ padding: "8px" }}>
                          <input
                            className="new-activity-input"
                            type="text"
                            value={day.newActivity || ""}
                            onChange={(e) => handleDayChange(index, "newActivity", e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddActivity(index);
                              }
                            }}
                            style={{ width: "80%", marginRight: "10px" }}
                          />
                          <AddButton type="button" onClick={() => handleAddActivity(index)}>
                            +
                          </AddButton>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="photo-upload">
                  <label>Foto toevoegen</label>
                  <input type="file" accept="image/*" multiple onChange={(e) => handlePhotoUpload(index, e.target.files)} />
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    {day.photos?.map((photo, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={photo} alt="upload preview" width={80} />
                        <DeleteButton
                          onClick={() => handlePhotoDelete(index, i)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "red !important",
                            color: "white !important",
                            border: "none !important",
                            width: "20px !important",
                            height: "20px !important",
                            borderRadius: "50% !important",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          ×
                        </DeleteButton>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <div className="button-container-edit-days">
          <FullButton onClick={handleSaveChanges} style={{ marginTop: "20px" }}>
            Opslaan
          </FullButton>
        </div>
      </div>
    </>
  );
}

export default EditTripDays;
