import React, { useEffect, useState } from "react";

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requesterId }),
      });
      const data = await res.json();
      setMessage(data.message);
      fetchRequests(); // lijst verversen na acceptatie
    } catch (error) {
      console.error("Fout bij accepteren verzoek:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h3>Openstaande familieverzoeken</h3>
      {requests.length === 0 && <p>Geen verzoeken gevonden.</p>}
      <ul>
        {requests.map((user) => (
          <li key={user._id}>
            {user.screenName}
            <button onClick={() => handleAccept(user._id)} style={{ marginLeft: "10px" }}>
              Accepteer
            </button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FamilyRequests;
