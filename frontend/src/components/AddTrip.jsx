import { useState } from "react";

function AddTrip() {
  const [place, setPlace] = useState("");
  const [country, setCountry] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [screenNames, setScreenNames] = useState(""); // Hier komen de geselecteerde screenNames
  const [familyId, setFamilyId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTrip = {
      place,
      country,
      imageUrl,
      startDate,
      endDate,
      screenNames: screenNames.split(",").map((name) => name.trim()), // screenNames als array van strings
      familyId,
    };

    fetch("http://localhost:3001/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrip),
    })
      .then((res) => res.json()) // Zorg ervoor dat je altijd de JSON antwoord verwerkt
      .then((data) => {
        if (data.message) {
          console.log(data.message); // Toon de success of foutmelding
        }
      })
      .catch((err) => {
        console.error("Fout bij toevoegen van reis:", err);
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
      <label>
        ScreenNames (gescheiden door komma):
        <input type="text" value={screenNames} onChange={(e) => setScreenNames(e.target.value)} required />
      </label>
      <label>
        Family ID:
        <input type="text" value={familyId} onChange={(e) => setFamilyId(e.target.value)} required />
      </label>
      <button type="submit">Voeg reis toe</button>
    </form>
  );
}

export default AddTrip;
