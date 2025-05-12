import React, { useEffect, useState } from "react";

function AddFamilyMembers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Haal vrienden op bij laden van component
  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch("http://localhost:3001/family/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFriends(data);
    };

    fetchFriends();
  }, []);

  // Zoeken naar familieleden
  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3001/family/search-family-members?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResults(data);
  };

  // Toevoegen als vriend
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

    // Ververs de vriendenlijst
    const updatedFriends = await fetch("http://localhost:3001/family/friends", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFriends(await updatedFriends.json());
  };

  // Verwijderen van vriend
  const handleRemove = async (friendId) => {
    await fetch("http://localhost:3001/family/remove-friend", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ friendId }),
    });

    // Ververs de lijst
    const updatedFriends = await fetch("http://localhost:3001/family/friends", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFriends(await updatedFriends.json());
  };

  return (
    <div>
      <h2>Mijn familie:</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{friend.screenName}</span>
            <button onClick={() => handleRemove(friend._id)} style={{ color: "red", fontSize: "20px" }}>
              ❌
            </button>
          </li>
        ))}
      </ul>

      <h3>Familielid toevoegen</h3>
      <input type="text" placeholder="Zoek op naam" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Zoeken</button>
      <ul>
        {results.map((user) => (
          <li key={user._id}>
            {user.screenName} <button onClick={() => handleAdd(user._id)}>Toevoegen</button>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddFamilyMembers;
