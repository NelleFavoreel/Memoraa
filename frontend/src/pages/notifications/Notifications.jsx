import React from "react";
import FamilyRequests from "../../components/notifications/FamilyRequests";
import GetNotifications from "../../components/notifications/GetNotifications";
import "./Notifications.css";

function Notifications() {
  return (
    <div>
      <h1 className="title">Notificaties</h1>
      <div className="notifications-container">
        <FamilyRequests />
        <GetNotifications></GetNotifications>
      </div>
    </div>
  );
}

export default Notifications;
