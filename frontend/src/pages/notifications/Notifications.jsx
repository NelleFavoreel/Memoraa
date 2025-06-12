import React, { useEffect, useState } from "react";
import FamilyRequests from "../../components/notifications/FamilyRequests";
import GetNotifications from "../../components/notifications/GetNotifications";
import "./Notifications.css";
import Footer from "../../components/footer/footer";
function Notifications() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div>
      <h1 className={`title ${animate ? "animate" : ""}`}>Meldingen</h1>
      <div className="notifications-container">
        <FamilyRequests />
        <GetNotifications />
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Notifications;
