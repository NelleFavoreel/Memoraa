import { useEffect, useState } from "react";
import "../../pages/trips/Trips.css"; // Zorg dat je de modalstijl toevoegt
import FullButton from "../button/FullButton";

function AddTrip({ show, onClose }) {
  const [place, setPlace] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [screenNames, setScreenNames] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState([]);
  const token = localStorage.getItem("token");
  const [tripType, setTripType] = useState("staytrip");
  const [audience, setAudience] = useState("self");
  const [useAICover, setUseAICover] = useState(true);
  const [countries, setCountries] = useState([""]);

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
  }, [token]);

  const fetchCountryImage = async (countryName) => {
    if (!countryName) return "";
    const accessKey = "ul5tNUtQ1UlFRJ-IaGYykyzhxTSnjhanMR7NDqMJLag";
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${countryName}&orientation=landscape&client_id=${accessKey}`);
      const data = await response.json();
      return data.results[0]?.urls.regular || "";
    } catch (error) {
      console.error("Fout bij ophalen afbeelding van Unsplash:", error);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    let finalImageUrl = imageUrl.trim();

    // Kies het juiste land voor de afbeelding
    let imageCountry = "";
    if (tripType === "staytrip") {
      imageCountry = country;
    } else if (tripType === "roadtrip") {
      // Pak eerste niet-lege land uit countries array
      imageCountry = countries.find((c) => c.trim() !== "") || "";
    } else if (tripType === "citytrip") {
      imageCountry = place; // bij citytrip kan plaats ook een stad zijn
    }

    if (useAICover && (!finalImageUrl || !finalImageUrl.startsWith("http"))) {
      finalImageUrl = await fetchCountryImage(imageCountry);
    }

    const newTrip = {
      tripType,
      startDate,
      endDate,
      screenNames: screenNames.split(",").map((name) => name.trim()),
      familyId,
      userId,
      selectedFriend,
      audience,
      useAICover,
      imageUrl: finalImageUrl,
    };

    // Voeg alleen velden toe die relevant zijn per type
    if (tripType === "staytrip") {
      newTrip.place = place;
      newTrip.country = country;
    } else if (tripType === "citytrip") {
      newTrip.place = place; // stad
      newTrip.country = ""; // optioneel leeg
    } else if (tripType === "roadtrip") {
      newTrip.countries = countries.filter((c) => c.trim() !== "");
      newTrip.place = ""; // optioneel leeg
      newTrip.country = ""; // optioneel leeg
    }

    fetch("http://localhost:3001/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTrip),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message || "Reis toegevoegd");
        onClose(); // Sluit modal na toevoegen
      })
      .catch((err) => {
        console.error("Fout bij toevoegen van reis:", err);
      });
  };

  const handleCheckboxChange = (friendId) => {
    setSelectedFriend((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        <h2 className="title-header">Nieuwe reis toevoegen</h2>
        <form className="model-form" onSubmit={handleSubmit}>
          <label>Type reis:</label>
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="staytrip">Staytrip</option>
            <option value="citytrip">Citytrip</option>
            <option value="roadtrip">Roadtrip</option>
          </select>

          {tripType === "staytrip" && (
            <>
              <label>Plaats:</label>
              <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required={tripType === "staytrip"} />
              <label>Land:</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required={tripType === "staytrip"} />
            </>
          )}

          {/* Citytrip: alleen plaats verplicht */}
          {tripType === "citytrip" && (
            <div>
              <label>Stad:</label>
              <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required={tripType === "citytrip"} />
            </div>
          )}

          {/* Roadtrip: landen input, minstens 1 land verplicht */}
          {tripType === "roadtrip" && (
            <>
              <label>Landen:</label>
              {countries.map((c, i) => (
                <input
                  key={i}
                  type="text"
                  value={c}
                  onChange={(e) => {
                    const newCountries = [...countries];
                    newCountries[i] = e.target.value;
                    setCountries(newCountries);
                  }}
                  required={tripType === "roadtrip" && i === 0}
                />
              ))}
              <button type="button" onClick={() => setCountries([...countries, ""])}>
                Voeg land toe
              </button>
            </>
          )}

          <label>Coverafbeelding:</label>
          <select value={useAICover ? "ai" : "manual"} onChange={(e) => setUseAICover(e.target.value === "ai")}>
            <option value="ai">Genereer automatisch</option>
            <option value="manual">Zelf uploaden</option>
          </select>

          {!useAICover && <input type="text" placeholder="URL van je afbeelding" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />}

          <label>
            Startdatum:
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>
          <label>
            Einddatum:
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </label>
          <label>Kies je reisgezelschap:</label>
          <div className="model-form-checkboxes">
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

          <FullButton type="submit">Voeg reis toe</FullButton>
        </form>
      </div>
    </div>
  );
}

export default AddTrip;
