import React from "react";
import "./AddButton.css";

const AddButton = ({ children, onClick, variant = "default" }) => {
  return (
    <button className={"add"} onClick={onClick}>
      {children}
    </button>
  );
};

export default AddButton;
