import React from "react";
import FullButton from "../button/FullButton";

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

  return <FullButton onClick={handleCopyLink}>Deel deze reis</FullButton>;
};

export default ShareTripButton;
