import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./components/notifications/Notification.css";

function Root() {
  const [showToast, setShowToast] = React.useState(true);

  React.useEffect(() => {
    function checkWidth() {
      setShowToast(window.innerWidth >= 900);
    }
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <>
      <App />
      {showToast && <ToastContainer toastClassName="notification-toast" bodyClassName="notification-toast-body" position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
