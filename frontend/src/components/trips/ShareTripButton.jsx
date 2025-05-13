import React from "react";

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

  return <button onClick={handleCopyLink}>Deel deze reis</button>;
};

export default ShareTripButton;
