import React from "react";
import "./FullButton.css";

const FullButton = ({ children, onClick, variant = "default" }) => {
  return (
    <button className={`custom-button ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default FullButton;
