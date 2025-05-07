import { useEffect, useState } from "react";

function InfoForm() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Geen token gevonden. Gebruiker is niet ingelogd.");
        }

        const response = await fetch("http://localhost:3001/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Kon user info niet ophalen (${response.status}): ${await response.text()}`);
        }

        const data = await response.json();
        console.log("User info:", data);
        setUser(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, []);

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
