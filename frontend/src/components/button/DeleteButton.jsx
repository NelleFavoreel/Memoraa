import React from "react";
import "./DeleteButton.css";

const DeleteButton = ({ children, onClick, variant = "default" }) => {
  return (
    <button className={"delete"} onClick={onClick}>
      {children}
    </button>
  );
};

export default DeleteButton;
