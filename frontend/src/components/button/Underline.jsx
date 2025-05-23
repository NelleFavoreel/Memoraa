import React from "react";
import "./Underline.css";

const Underline = ({ children, onClick, className = "", as = "button", ...props }) => {
  const Component = as;
  return (
    <Component className={`underline-link ${className}`} onClick={onClick} {...props}>
      {children}
    </Component>
  );
};

export default Underline;
