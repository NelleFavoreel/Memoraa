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
  const handlePhotoDelete = (dayIndex, photoIndex) => {
    const updatedTripDays = [...tripDays];
    updatedTripDays[dayIndex].photos.splice(photoIndex, 1);
    setTripDays(updatedTripDays);
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
          <div>
            <label>Foto toevoegen</label>
            <input type="file" accept="image/*" multiple onChange={(e) => handlePhotoUpload(index, e.target.files)} />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {day.photos?.map((photo, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={photo} alt="upload preview" width={80} />
                  <button
                    onClick={() => handlePhotoDelete(index, i)}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button onClick={handleSaveChanges}>Opslaan</button>
    </div>
  );
}

export default EditTripDays;
