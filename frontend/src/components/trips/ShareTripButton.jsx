import React from "react";
import FullButton from "../button/FullButton";
import { SlCursor } from "react-icons/sl";
import AddButton from "../button/AddButton";

const ShareTripButton = ({ tripId }) => {
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/trips/${tripId}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("🔗 Link gekopieerd!");
      })
      .catch((err) => {
        console.error("❌ Fout bij kopiëren:", err);
        alert("Kon link niet kopiëren.");
      });
  };

  return (
    <AddButton onClick={handleCopyLink}>
      <SlCursor />
    </AddButton>
  );
};

export default ShareTripButton;
