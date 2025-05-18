import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import FullButton from "../../components/button/FullButton";
function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // Voornaam apart
  const [lastName, setLastName] = useState(""); // Achternaam apart
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Voor registratie of login
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

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
          localStorage.setItem("userId", data.userId);
          console.log("Token opgeslagen:", data.token);
          setIsLoggedIn(true);
          navigate("/home");
          window.location.reload();
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
          <FullButton
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              window.location.reload();
            }}
          >
            Uitloggen
          </FullButton>
        </div>
      ) : (
        <>
          <h1 className="title-header"> {isRegistering ? "Registreren" : "Inloggen"}</h1>
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
            <FullButton type="submit">{isRegistering ? "Registreren" : "Inloggen"}</FullButton>
          </form>
          <p>
            {isRegistering ? (
              <span>
                Heb je al een account? <FullButton onClick={() => setIsRegistering(false)}>Inloggen</FullButton>
              </span>
            ) : (
              <span>
                Nog geen account? <FullButton onClick={() => setIsRegistering(true)}>Registreren</FullButton>
              </span>
            )}
          </p>
        </>
      )}
    </div>
  );
}

export default LogIn;
