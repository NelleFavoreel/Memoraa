import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./components/notifications/Notification.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <App />
      <ToastContainer toastClassName="notification-toast" bodyClassName="notification-toast-body" position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </>
  </React.StrictMode>
);
