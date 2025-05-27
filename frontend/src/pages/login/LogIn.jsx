import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import FullButton from "../../components/button/FullButton";
function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userCredentials = { email, password };

    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          setIsLoggedIn(true);
          toast.success("Inloggen gelukt!");
          navigate("/home");
        } else {
          setError("Er is iets mis met het ontvangen van het token.");
          toast.error("Geen token ontvangen van server");
        }
      } else {
        setError(data.message || "Fout bij inloggen");
        toast.error(data.message || "Wachtwoord is fout");
      }
    } catch (err) {
      console.error("❌ Fout bij inloggen:", err);
      setError("Er is een fout opgetreden bij het inloggen.");
      toast.error("Verbindingsfout met server");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const familyId = "681364b5aa7a419a12954f4a";
    const name = `${firstName} ${lastName}`;

    try {
      const checkResponse = await fetch(`http://localhost:3001/users/check?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&familyId=${familyId}`);
      const checkData = await checkResponse.json();

      if (checkData.emailExists) {
        setError("Er bestaat al een account met dit e-mailadres.");
        toast.error("E-mailadres is al in gebruik");
        return;
      }

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Registratie gelukt! Je kan nu inloggen.");
        setIsRegistering(false);
        setError("");
      } else {
        setError(data.message || "Fout bij registratie");
        toast.error(data.message || "Registratie mislukt");
      }
    } catch (err) {
      console.error("❌ Fout bij registratie:", err);
      setError("Er is een fout opgetreden bij de registratie.");
      toast.error("Verbindingsfout met server");
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <div className="logged-in-container">
          <FullButton
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              setIsLoggedIn(false);
              navigate("/");
              toast.info("Je bent uitgelogd");
            }}
          >
            Uitloggen
          </FullButton>
        </div>
      ) : (
        <>
          <div className="login-background">
            <div className="login-container">
              <h1 className="title-header">{isRegistering ? "Registreren" : "Inloggen"}</h1>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LogIn;
