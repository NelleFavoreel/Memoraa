import FullButton from "../../components/button/FullButton";
import { useNavigate } from "react-router-dom";
import BlueSeePicture from "../../../public/images/BlueSeePicture.jpeg";
import CityPicture from "../../../public/images/CityPicture.jpeg";
import GreenPicture from "../../../public/images/GreenPicture.jpeg";
import Mountain from "../../../public/images/Mountain.jpeg";
import SeePicture from "../../../public/images/SeePicture.jpeg";
import SeePicture2 from "../../../public/images/SeePicture2.jpeg";
import City from "../../../public/images/City.jpeg";
import MountainCity from "../../../public/images/MountainCity.jpeg";
import "./HomeContent.css";
function HomeContent() {
  const navigate = useNavigate();
  return (
    <>
      <img src={BlueSeePicture} alt="Blue See" className="image1" />
      <img src={GreenPicture} alt="Blue See" className="image2" />
      <div className="picture-container">
        <img src={SeePicture} alt="Blue See" className="image4" />
        <img src={Mountain} alt="Blue See" className="image3" />
      </div>
      <div className="home-content-container">
        <div className="home-content-box">
          <div className="home-content-text">
            <h2>Jou volgende avontuur begint hier</h2>
            <div className="home-content">
              <p>Stel in een paar simpele stappen je perfecte familievakantie samen. Kies je bestemming, voeg je favoriete activiteiten toe en laat het avontuur beginnen!</p>
              <FullButton onClick={() => navigate("/login")}>Plan je reis</FullButton>
            </div>
          </div>
          <div className="picture-container">
            <img src={SeePicture2} alt="Blue See" className="image5" />
            <img src={City} alt="Blue See" className="image6" />
          </div>
        </div>
        <div className="home-content-box-1">
          <div className="home-content-text">
            <h2>Houd overzicht over alle familieavonturen</h2>
            <div className="home-content">
              <p>Bekijk de gezamenlijke kalender en ontdek welke reizen gepland staan. Zo mis je geen enkel moment van jullie onvergetelijke ervaringen.</p>
              <FullButton onClick={() => navigate("/login")}>Plan je reis</FullButton>
            </div>
          </div>
          <div className="picture-container">
            <img src={MountainCity} alt="Blue See" className="image8" />
            <img src={CityPicture} alt="Blue See" className="image7" />
          </div>
        </div>

        <div className="home-content-box2">
          <div className="home-content-text">
            <h2>Laat je inspireren door echte familieavonturen</h2>
            <div className="home-content">
              <p>Bekijk alle onvergetelijke reizen die gezinnen voor jou hebben gedeeld. Misschien zit jouw volgende droomreis er wel tussen!</p>
              <FullButton onClick={() => navigate("/login")}>Plan je reis</FullButton>
            </div>
          </div>
          <div className="picture-container">
            <img src={BlueSeePicture} alt="Blue See" className="image9" />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeContent;
