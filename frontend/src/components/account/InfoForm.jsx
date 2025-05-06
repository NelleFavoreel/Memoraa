import { useEffect, useState } from "react";

function InfoForm() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Haal gebruikersgegevens op zonder token of autorisatie
        const response = await fetch("http://localhost:3001/users/me", {
          method: "GET", // Geen headers nodig voor authenticatie
        });

        if (!response.ok) {
          throw new Error(`Kon user info niet ophalen (${response.status}): ${await response.text()}`);
        }

        const data = await response.json();
        console.log("User info:", data);

        // Zet de gebruikersdata in de state
        setUser(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, []); // De lege array zorgt ervoor dat dit alleen bij de eerste render wordt uitgevoerd

  if (!user) return <p>Gebruikersgegevens worden geladen...</p>;

  return (
    <div>
      <h2>Welkom, {user.screenName}</h2>
      <p>Email: {user.email}</p>
      <p>Familie-ID: {user.familyId}</p>
      <p>Familieleden: {user.familyMembers.join(", ")}</p>
    </div>
  );
}

export default InfoForm;
