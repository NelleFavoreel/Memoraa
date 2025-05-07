import React, { useState } from "react";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // Voornaam apart
  const [lastName, setLastName] = useState(""); // Achternaam apart
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Voor registratie of login
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Functie voor het inloggen
  const handleLogin = async (e) => {
    e.preventDefault(); // Voorkom herladen van de pagina

    const userCredentials = {
      email,
      password,
    };

    try {
      // Verstuur de inloggegevens naar de backend
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Token opgeslagen:", data.token);
          setIsLoggedIn(true);
          alert("Inloggen succesvol!");
        } else {
          console.error("❌ Geen token ontvangen:", data);
          setError("Er is iets mis met het ontvangen van het token.");
        }

        setIsLoggedIn(true);
        console.log("Inloggen succesvol:", data);
        console.log("Token ontvangen:", data.token);

        alert("Inloggen succesvol!");
      } else {
        // Toon foutmelding als login niet geslaagd is
        setError(data.message || "Fout bij inloggen");
      }
    } catch (err) {
      console.error("❌ Fout bij inloggen:", err);
      setError("Er is een fout opgetreden bij het inloggen.");
    }
  };

  // Functie voor het registreren
  const handleRegister = async (e) => {
    e.preventDefault();

    const familyId = "681364b5aa7a419a12954f4a";
    const name = `${firstName} ${lastName}`;

    try {
      // 1. Check of email of screenName al bestaat
      const checkResponse = await fetch(`http://localhost:3001/users/check?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&familyId=${familyId}`);
      const checkData = await checkResponse.json();

      if (checkData.emailExists) {
        setError("Er bestaat al een account met dit e-mailadres.");
        return;
      }

      // screenName aanpassen als voornaam al bestaat
      let screenName = firstName;
      if (checkData.firstNameExists) {
        screenName = `${firstName}_${lastName}`;
      }

      const userCredentials = {
        name,
        email,
        password,
        familyId,
        screenName,
        familyMembers: [screenName],
      };

      const response = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();
      setError(data.message || "Fout bij registratie");
      if (response.ok) {
        alert("Registratie succesvol! Je kunt nu inloggen.");
        setIsRegistering(false);
      } else {
        setError(data.message || "Fout bij registratie");
      }
    } catch (err) {
      console.error("❌ Fout bij registratie:", err);
      setError("Er is een fout opgetreden bij de registratie.");
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h2>Welkom terug!</h2>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
          >
            Uitloggen
          </button>
        </div>
      ) : (
        <>
          <h2>{isRegistering ? "Registreren" : "Inloggen"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            {isRegistering && (
              <>
                <div>
                  <label htmlFor="firstName">Voornaam:</label>
                  <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div>
                  <label htmlFor="lastName">Achternaam:</label>
                  <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email">E-mail:</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password">Wachtwoord:</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit">{isRegistering ? "Registreren" : "Inloggen"}</button>
          </form>
          <p>
            {isRegistering ? (
              <span>
                Heb je al een account? <button onClick={() => setIsRegistering(false)}>Inloggen</button>
              </span>
            ) : (
              <span>
                Nog geen account? <button onClick={() => setIsRegistering(true)}>Registreren</button>
              </span>
            )}
          </p>
        </>
      )}
    </div>
  );
}

export default LogIn;
