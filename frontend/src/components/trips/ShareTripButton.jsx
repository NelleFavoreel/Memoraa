import React from "react";
import FullButton from "../button/FullButton";
import { SlCursor } from "react-icons/sl";
import AddButton from "../button/AddButton";
import { toast } from "react-toastify";
import { SlLink } from "react-icons/sl";

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
      <SlLink />
    </button>
  );
};

export default ShareTripButton;
