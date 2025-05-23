import React from "react";
import "./DeleteButton.css";

const DeleteButton = ({ children, onClick, variant = "default" }) => {
  return (
    <button className={"delete"} onClick={onClick}>
      <span className="material-symbols-outlined">close</span>
    </button>
  );
};

export default DeleteButton;
