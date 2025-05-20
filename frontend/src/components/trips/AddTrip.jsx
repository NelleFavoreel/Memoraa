import { useEffect, useState } from "react";
import "../../pages/trips/Trips.css"; // Zorg dat je de modalstijl toevoegt
import FullButton from "../button/FullButton";
import AddButton from "../button/AddButton";

function AddTrip({ show, onClose, onTripAdded }) {
  const [place, setPlace] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [screenNames, setScreenNames] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState([]);
  const token = localStorage.getItem("token");
  const [tripType, setTripType] = useState("staytrip");
  const [audience, setAudience] = useState("self");
  const [useAICover, setUseAICover] = useState(true);
  const [countries, setCountries] = useState([""]);

  // Haal de achternaam op van de user uit localStorage (optioneel, blijft als userLastName)
  const lastName = localStorage.getItem("lastName") || "";

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
      imageCountry = countries.find((c) => c.trim() !== "") || "";
    } else if (tripType === "citytrip") {
      imageCountry = place;
    }

    if (useAICover && (!finalImageUrl || !finalImageUrl.startsWith("http"))) {
      finalImageUrl = await fetchCountryImage(imageCountry);
    }

    const newTrip = {
      tripType,
      startDate,
      endDate,
      screenNames: screenNames.split(",").map((name) => name.trim()),
      familyId: "Favoreel",
      userId,
      selectedFriend,
      audience,
      useAICover,
      imageUrl: finalImageUrl,
      userLastName: lastName,
    };

    if (tripType === "staytrip") {
      newTrip.place = place;
      newTrip.country = country;
    } else if (tripType === "citytrip") {
      newTrip.place = place;
      newTrip.country = "";
    } else if (tripType === "roadtrip") {
      newTrip.countries = countries.filter((c) => c.trim() !== "");
      newTrip.place = "";
      newTrip.country = "";
    }

    fetch("http://localhost:3001/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTrip),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message || "Reis toegevoegd");
        if (onTripAdded) onTripAdded();
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
        <button className="modal-close" onClick={onClose} style={{ float: "right", fontSize: "1.5rem", background: "transparent", border: "none" }}>
          ✖
        </button>
        <h1 className="title-header">Nieuwe reis toevoegen</h1>
        <form className="model-form" onSubmit={handleSubmit}>
          <label>Type reis:</label>
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="staytrip">Staytrip</option>
            <option value="citytrip">Citytrip</option>
            <option value="roadtrip">Roadtrip</option>
          </select>

          {tripType === "staytrip" && (
            <>
              <label>Stad:</label>
              <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required={tripType === "staytrip"} />
              <label>Land:</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required={tripType === "staytrip"} />
            </>
          )}

          {tripType === "citytrip" && (
            <div>
              <label>Stad:</label>
              <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required={tripType === "citytrip"} />
            </div>
          )}

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
              <div className="model-button-add">
                <AddButton type="button" onClick={() => setCountries([...countries, ""])}>
                  +
                </AddButton>
              </div>
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
          <div className="model-form-AddButton">
            <FullButton type="submit">Voeg reis toe</FullButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTrip;
