import React, { useState } from "react";

function AddFamilyMembers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3001/family/search-family-members?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setResults(data);
  };

  const handleAdd = async (friendId) => {
    const token = localStorage.getItem("token");
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
  };

  return (
    <div>
      <div style={{ border: "2px solid red", padding: "10px" }}>
        <h3>Familielid toevoegen</h3>
      </div>

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
