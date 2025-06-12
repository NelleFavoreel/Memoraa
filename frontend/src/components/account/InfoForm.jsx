import { useEffect, useState } from "react";

function InfoForm() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndTrips = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("userId of token ontbreekt");
        return;
      }

      try {
        const userResponse = await fetch(`http://localhost:3001/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userResponse.ok) throw new Error("Kon gebruiker niet ophalen");

        const userData = await userResponse.json();

        const tripsResponse = await fetch(`http://localhost:3001/trips?familyId=${userData.familyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!tripsResponse.ok) throw new Error("Kon reizen niet ophalen");

        const tripsData = await tripsResponse.json();
        const now = new Date();

        const futureTrips = tripsData.filter((trip) => new Date(trip.startDate) > now);
        const pastTrips = tripsData.filter((trip) => new Date(trip.endDate) < now);
        const nextTrip = futureTrips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];
        setUser({
          ...userData,
          futureTrips,
          pastTrips,
          nextTrip,
        });
      } catch (error) {
        console.error("Fout bij ophalen data:", error);
      }
    };

    fetchUserAndTrips();
  }, []);

  if (!user) return <p>Gebruikersgegevens worden geladen...</p>;

  return (
    <>
      <h2>{user.screenName}</h2>
      <div className="info-form-user">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div className="info-form-text">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="info-form-text">
            <label>Aantal toekomstige reizen:</label>
            <p>{user.futureTrips?.length || 0}</p>
          </div>
          <div className="info-form-text">
            <label>Eerst aankomende reis:</label>
            {user.nextTrip ? (
              <p>
                {user.nextTrip.tripType === "roadtrip" ? (
                  <>Roadtrip door {user.nextTrip.countries?.join(" & ")}</>
                ) : (
                  <>
                    {user.nextTrip.place}, {user.nextTrip.country}
                  </>
                )}{" "}
                –{" "}
                {new Date(user.nextTrip.startDate).toLocaleDateString("nl-BE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : (
              <p>Geen geplande reizen</p>
            )}
          </div>
          <div className="info-form-text">
            <label>Aantal voorbije reizen:</label>
            <p>{user.pastTrips?.length || 0}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default InfoForm;
