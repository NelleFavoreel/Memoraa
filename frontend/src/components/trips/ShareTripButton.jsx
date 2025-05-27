import React from "react";
import FullButton from "../button/FullButton";
import { SlCursor } from "react-icons/sl";
import AddButton from "../button/AddButton";
import { toast } from "react-toastify";

const ShareTripButton = ({ tripId }) => {
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/trips/${tripId}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success("Link goed gekopieerd!");
      })
      .catch((err) => {
        console.error("❌ Fout bij kopiëren:", err);
        toast.error("Link niet gekopieerd, probeer opnieuw!");
      });
  };

  return (
    <button onClick={handleCopyLink}>
      {" "}
      <SlCursor></SlCursor>
    </button>
  );
};

export default ShareTripButton;
