import React, { useEffect, useState } from "react";
import DeleteButton from "../button/DeleteButton";

function FamilyRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/family/family-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Fout bij ophalen verzoeken:", error);
    }
  };

  const handleAccept = async (requesterId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/family/accept-family-request", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestSenderId: requesterId }),
      });

      const data = await res.json();
      setMessage(data.message);
      fetchRequests(); // ververs de lijst
    } catch (error) {
      console.error("Fout bij accepteren verzoek:", error);
    }
  };

  const handleReject = async (requesterId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/family/reject-family-request", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requesterId }),
      });
      const data = await res.json();
      setMessage(data.message);
      fetchRequests();
    } catch (error) {
      console.error("Fout bij weigeren verzoek:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="family-requests-container">
      {requests.length === 0 && <p>Geen verzoeken gevonden.</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Naam</th>
            <th style={{ textAlign: "left", padding: "8px" }}>Toevoegen of Verwijderen</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((user) => (
            <tr key={user._id}>
              <td style={{ padding: "8px" }}>{user.screenName}</td>
              <td style={{ padding: "8px" }}>
                <td style={{ padding: "8px" }}>
                  <button onClick={() => handleAccept(user._id)} style={{ marginRight: "8px" }}>
                    Accepteer
                  </button>
                  <DeleteButton onClick={() => handleReject(user._id)} style={{ backgroundColor: "lightcoral" }}>
                    Weiger
                  </DeleteButton>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FamilyRequests;
