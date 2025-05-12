import { useEffect, useState } from "react";

function AddTrip() {
  const [place, setPlace] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [screenNames, setScreenNames] = useState(""); // Hier komen de geselecteerde screenNames
  const [familyId, setFamilyId] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState([]); // Zorg dat dit een array is
  const token = localStorage.getItem("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    const newTrip = {
      place,
      country,
      imageUrl,
      startDate,
      endDate,
      screenNames: screenNames.split(",").map((name) => name.trim()),
      familyId,
      userId,
      selectedFriend,
    };

    fetch("http://localhost:3001/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrip),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          console.log(data.message);
        }
      })
      .catch((err) => {
        console.error("Fout bij toevoegen van reis:", err);
      });
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("http://localhost:3001/family/friends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Fout bij het ophalen van vrienden:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleCheckboxChange = (friendId) => {
    // Als de vriend al is geselecteerd, deselecteer hem, anders selecteer hem
    setSelectedFriend((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friendId)) {
        return prevSelectedFriends.filter((id) => id !== friendId);
      } else {
        return [...prevSelectedFriends, friendId];
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Plaats:
        <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required />
      </label>
      <label>
        Land:
        <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
      </label>
      <label>
        Afbeelding URL:
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </label>
      <label>
        Startdatum:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      </label>
      <label>
        Einddatum:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      </label>

      <label>Kies je vrienden voor de reis:</label>
      <div>
        {friends.map((friend) => (
          <div key={friend._id}>
            <input type="checkbox" id={friend._id} checked={selectedFriend.includes(friend._id)} onChange={() => handleCheckboxChange(friend._id)} />
            <label htmlFor={friend._id}>{friend.screenName}</label>
          </div>
        ))}
      </div>

      <label>
        Family ID:
        <input type="text" value={familyId} onChange={(e) => setFamilyId(e.target.value)} required />
      </label>
      <button type="submit">Voeg reis toe</button>
    </form>
  );
}

export default AddTrip;
