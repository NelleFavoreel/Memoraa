import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChangingPassword from "./ChangePassword";

function InfoForm() {
  const { userId } = useParams(); // Haal userId op uit de URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      // console.log("userId:", userId); // Log de userId
      if (!userId) {
        console.error("userId is not valid!");
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Geen token gevonden, gebruikersgegevens kunnen niet worden opgehaald.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Fout bij ophalen gebruiker");
        }

        const data = await response.json();
        setUser(data); // Zet de opgehaalde gebruiker in de state
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) return <p>Gebruikersgegevens worden geladen...</p>;

  return (
    <>
      <h2> {user.screenName}</h2>
      <div className="info-form-user">
        <p>Email: {user.email}</p>
      </div>
    </>
  );
}

export default InfoForm;
