import { useEffect, useState } from "react";
import "../../pages/trips/Trips.css";
import FullButton from "../button/FullButton";
import AddButton from "../button/AddButton";
import { toast } from "react-toastify";

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
        toast.success(data.message || "Reis succesvol toegevoegd!");
        if (onTripAdded) onTripAdded();
      })
      .catch((err) => {
        toast.error("Fout bij toevoegen van reis, probeer het later opnieuw.");
      });
  };

  const handleCheckboxChange = (friendId) => {
    setSelectedFriend((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="model-form" onSubmit={handleSubmit}>
          <button className="modal-close" onClick={onClose} style={{ float: "right", fontSize: "2rem", background: "transparent", border: "none" }}>
            <span class="material-symbols-outlined">close</span>
          </button>
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
          <div className="traveler-selection" style={{ marginTop: "30px" }}>
            <label>Kies je reisgezelschap:</label>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr className="table-header">
                  <th style={{ textAlign: "left", padding: "5px" }}>Naam</th>
                  <th style={{ textAlign: "left", padding: "5px" }}>Toevoegen</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((friend) => (
                  <tr key={friend._id}>
                    <td style={{ padding: "8px" }}>{friend.screenName}</td>
                    <td style={{ padding: "8px" }}>
                      <input type="checkbox" checked={selectedFriend.includes(friend._id)} onChange={() => handleCheckboxChange(friend._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
