import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ShareTripButton from "./ShareTripButton";
import ClickableMap from "../maps/ClickableMap";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import TripDays from "./TripDays";
import Underline from "../button/Underline";
import { SlSettings } from "react-icons/sl";
import EditTrip from "./EditTip";
import PhotoGallery from "./PhotoGallery";
import AddPictures from "./AddPictures";
import AddButton from "../button/AddButton";
import LoginModal from "../modal/LoginModal";

function TravelDetail({ setHideNavbar }) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [tripDays, setTripDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState([]);
  const [travelerNames, setTravelerNames] = useState([]);
  const [backgroundPhotos, setBackgroundPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const currentUserId = localStorage.getItem("userId");
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const photosRef = useRef(null);
  const mapRef = useRef(null);

  // Scroll handlers
  const scrollToPhotos = () => photosRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToMap = () => mapRef.current?.scrollIntoView({ behavior: "smooth" });

  // Navbar verbergen/showen
  useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  // Trip ophalen
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/trips/${id}`);
        if (!response.ok) throw new Error("Kon tripdetails niet ophalen.");
        const data = await response.json();
        setTrip(data.trip);
        setTripDays(data.tripDays || []);
      } catch (error) {
        console.error("Fout bij ophalen van trip details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [id]);

  // Namen van reizigers ophalen
  useEffect(() => {
    if (!trip || !trip.travelers || trip.travelers.length === 0) {
      setTravelerNames([]);
      return;
    }

    const fetchTravelerNames = async () => {
      try {
        const names = await Promise.all(
          trip.travelers.map(async (travelerId) => {
            const response = await fetch(`http://localhost:3001/users/${travelerId}`);
            if (!response.ok) throw new Error("Kon gebruiker niet ophalen");
            const data = await response.json();
            return data.name;
          })
        );
        setTravelerNames(names);
      } catch (error) {
        console.error("Fout bij ophalen van reizigersnamen:", error);
      }
    };

    fetchTravelerNames();
  }, [trip]);

  // Achtergrondfoto wisselen (slideshow)
  useEffect(() => {
    if (backgroundPhotos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % backgroundPhotos.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [backgroundPhotos]);

  // Bij laden van tripDays eerste dag kiezen
  useEffect(() => {
    if (tripDays.length > 0) {
      handleDayChange(0);
    }
  }, [tripDays]);

  // Bij dag wisselen foto’s aanpassen
  const handleDayChange = (index) => {
    const selectedDayPhotos = tripDays[index]?.photos || [];
    const fallbackPhoto = trip?.imageUrl ? [trip.imageUrl] : [];

    const allPhotosToUse = selectedDayPhotos.length > 0 ? selectedDayPhotos : fallbackPhoto;
    setBackgroundPhotos(allPhotosToUse);
    setCurrentPhotoIndex(0);
  };

  // Coördinaten ophalen van plaatsen via Mapbox geocoding
  useEffect(() => {
    const fetchCoordinatesForPlaces = async () => {
      const fetchedCoordinates = [];

      for (let i = 0; i < tripDays.length; i++) {
        const place = tripDays[i].place;
        if (!place) continue;

        try {
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${mapboxgl.accessToken}`);
          const data = await response.json();

          if (data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            fetchedCoordinates.push({ dayIndex: i, coordinates: [lng, lat] });
          }
        } catch (error) {
          console.error("Fout bij ophalen locatie:", error);
        }
      }

      setCoordinates(fetchedCoordinates);
    };

    if (tripDays.length > 0) {
      fetchCoordinatesForPlaces();
    }
  }, [tripDays]);

  // Foto toegevoegd handler voor AddPictures component
  const handlePhotoAdded = (newPhotoUrl, dayIndex = null) => {
    if (dayIndex !== null) {
      // Foto aan specifieke dag toevoegen
      setTripDays((prevDays) => {
        const updatedDays = [...prevDays];
        if (!updatedDays[dayIndex].photos) updatedDays[dayIndex].photos = [];
        updatedDays[dayIndex].photos.push(newPhotoUrl);
        return updatedDays;
      });
      if (currentPhotoIndex === 0) {
        handleDayChange(dayIndex);
      }
    } else {
      // Foto algemeen toevoegen aan trip
      setTrip((prevTrip) => ({
        ...prevTrip,
        photos: prevTrip.photos ? [...prevTrip.photos, newPhotoUrl] : [newPhotoUrl],
      }));
    }
  };

  if (loading) return <p>De reisgegevens worden geladen...</p>;
  if (!trip) return <p>Reis niet gevonden.</p>;

  const isTraveler = trip.travelers?.includes(currentUserId);

  return (
    <div>
      <div
        className="trip-background-image"
        style={{
          backgroundImage: backgroundPhotos.length > 0 ? `url(${backgroundPhotos[currentPhotoIndex]})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
          transition: "opacity 0.8s ease-in-out",
        }}
      ></div>

      <div className="trip-detail-container">
        <div className="trip-detail-header">
          <h1>{trip.country}</h1>
          <div className="trip-detail-header-actions">
            <div className="trip-detail-share">
              <ShareTripButton tripId={trip._id} />
            </div>
            {isTraveler && (
              <Underline onClick={() => setShowModal(true)} className="edit-trip-button">
                <SlSettings />
              </Underline>
            )}
            {showModal && <EditTrip isOpen={showModal} onClose={() => setShowModal(false)} />}
          </div>
        </div>

        <div className="trip-detail-general-info">
          <div className="trip-detail-info1">
            <p>
              {new Date(trip.startDate).toLocaleDateString()} tot {new Date(trip.endDate).toLocaleDateString()}
            </p>
            <div className="trip-detail-info">
              <label>Aantal dagen:</label>
              <p>{tripDays.length} dagen</p>
            </div>
            <div className="trip-detail-info">
              <label>Type:</label>
              <p>{trip.tripType}</p>
            </div>
            <div className="trip-detail-info">
              <label>Reizigers:</label>
              <p>{travelerNames.length > 0 ? travelerNames.join(", ") : "Geen reisgenoten"}</p>
            </div>
          </div>
          <div>
            <Underline onClick={scrollToPhotos}>Foto's bekijken</Underline>
            <Underline onClick={scrollToMap}>Kaart bekijken</Underline>
          </div>
        </div>
      </div>

      <TripDays tripDays={tripDays} setTripDays={setTripDays} onDayChange={handleDayChange} tripId={id} />

      <div className="trip-detail-under-content" ref={photosRef}>
        <div className="trip-detail-photos-header-button">
          <AddButton onClick={() => setIsModalOpen(true)} style={{ cursor: "pointer" }}>
            +
          </AddButton>
        </div>
        <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddPictures
            tripId={id}
            onPhotoAdded={(newPhotoUrl) => {
              handlePhotoAdded(newPhotoUrl);
              setIsModalOpen(false);
            }}
            onClose={() => setIsModalOpen(false)}
          />
        </LoginModal>
        <PhotoGallery generalPhotos={trip?.photos || []} tripDays={tripDays} />
        <div className="map-container">
          <h2>Kaartweergave</h2>
          <div ref={mapRef}>
            <ClickableMap coordinates={coordinates} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelDetail;
