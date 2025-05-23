import React, { useEffect, useState } from "react";
import AddButton from "../button/AddButton";
import FullButton from "../button/FullButton";

function AddFamilyMembers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("http://localhost:3001/family/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data);
    };

    fetchFriends();
  }, [token]);

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3001/family/search-family-members?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResults(data);
  };

  const handleAdd = async (friendId) => {
    const res = await fetch("http://localhost:3001/family/add-friend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId }),
    });

    const data = await res.json();
    setMessage(data.message);

    // Update vriendenlijst
    const updatedFriends = await fetch("http://localhost:3001/family/friends", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFriends(await updatedFriends.json());
  };

  const handleRemove = async (friendId) => {
    await fetch("http://localhost:3001/family/remove-friend", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId }),
    });

    // Update vriendenlijst
    const updatedFriends = await fetch("http://localhost:3001/family/friends", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFriends(await updatedFriends.json());
  };

  return (
    <div className="add-family-members">
      <h2>Mijn familie:</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Naam</th>
            <th style={{ textAlign: "center", padding: "8px" }}>Verwijderen</th>
          </tr>
        </thead>
        <tbody>
          {friends.map((friend) => (
            <tr key={friend._id}>
              <td style={{ padding: "8px" }}>{friend.screenName}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                <button onClick={() => handleRemove(friend._id)} style={{ color: "red", fontSize: "18px", cursor: "pointer" }} title="Verwijderen">
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Familielid toevoegen</h3>
      <input type="text" placeholder="Zoek op naam" value={query} onChange={(e) => setQuery(e.target.value)} style={{ padding: "6px", marginRight: "0.5rem" }} />
      <FullButton onClick={handleSearch} style={{ padding: "6px 12px" }}>
        Zoeken
      </FullButton>

      {results.length > 0 && (
        <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>Naam</th>
              <th style={{ textAlign: "center", padding: "8px" }}>Toevoegen</th>
            </tr>
          </thead>
          <tbody>
            {results.map((user) => (
              <tr key={user._id}>
                <td style={{ padding: "8px" }}>{user.screenName}</td>
                <td style={{ padding: "8px", textAlign: "center", display: "flex", justifyContent: "center" }}>
                  <AddButton onClick={() => handleAdd(user._id)} style={{ padding: "4px 8px", cursor: "pointer" }}>
                    +
                  </AddButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
}

export default AddFamilyMembers;
