import React from "react";
import FamilyRequests from "../../components/notifications/FamilyRequests";
import GetNotifications from "../../components/notifications/GetNotifications";

function Notifications() {
  return (
    <div>
      <h1 className="title">Notificaties</h1>
      <FamilyRequests />
      <GetNotifications></GetNotifications>
    </div>
  );
}

export default Notifications;
