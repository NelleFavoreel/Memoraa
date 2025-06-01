import React, { useState } from "react";
import AddButton from "../button/AddButton";
import { div } from "three/tsl";
import FullButton from "../button/FullButton";

function AddPictures({ tripId, onPhotoAdded, onClose }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

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

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const updated = selectedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
    }));
    setMediaFiles(updated);
  };

  const handleUpload = async () => {
    if (mediaFiles.length === 0) {
      setError("Selecteer minstens één bestand.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      for (const media of mediaFiles) {
        let base64Data = "";

        if (media.type === "image") {
          base64Data = await resizeImageToBase64(media.file);
        } else if (media.type === "video") {
          base64Data = await fileToBase64(media.file);
        }

        const response = await fetch(`http://localhost:3001/trips/${tripId}/photos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageUrl: base64Data,
            imageBase64: base64Data,
            description,
          }),
        });

        if (!response.ok) {
          throw new Error("Fout bij het uploaden van media");
        }

        // Bel de callback voor elke succesvolle upload
        if (onPhotoAdded) onPhotoAdded(base64Data);
      }

      setMediaFiles([]);
      setDescription("");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      setError("Fout bij uploaden van media.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-pictures-container">
      <div className="add-pictures">
        <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} />
        <div>
          {mediaFiles.map((media, i) =>
            media.type === "image" ? (
              <img key={i} src={media.preview} alt="Preview" width="100%" />
            ) : (
              <video key={i} width="100%" controls>
                <source src={media.preview} type="video/mp4" />
                Je browser ondersteunt geen video.
              </video>
            )
          )}
        </div>
        <div className="add-picture-buttons" style={{ display: "flex", gap: "10px" }}>
          <FullButton onClick={handleUpload} disabled={loading}>
            {loading ? "Bezig met upload..." : "Upload"}
          </FullButton>
          <button
            onClick={() => {
              if (onClose) onClose();
              setMediaFiles([]);
              setError(null);
            }}
          >
            Annuleer
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default AddPictures;
