import { useState } from "react";
import LoginModal from "../modal/LoginModal";
import LogIn from "../../pages/login/LogIn";
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
import useAnimateOnVisible from "../../components/animations/useAnimateOnVisible";

import "./HomeContent.css";

function HomeContent({ scrollY }) {
  useAnimateOnVisible(".rotate-on-visible");
  useAnimateOnVisible(".rotate-on-visible1");

  const translateY1 = scrollY * 0.2;
  const translateY2 = scrollY * 0.3;
  const translateY3 = scrollY * 0.1;
  const translateY4 = scrollY * 0.05;
  const translateY5 = scrollY * 0.15;

  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <img src={BlueSeePicture} alt="Blue See" className="image1" style={{ transform: `translateY(${translateY1}px)` }} />
      <img src={GreenPicture} alt="Green" className="image2" style={{ transform: `translateY(${translateY2}px)` }} />
      <div className="picture-container">
        <img src={SeePicture} alt="See" className="image4" style={{ transform: `translateY(${translateY3}px)` }} />
        <img src={Mountain} alt="Mountain" className="image3" style={{ transform: `translateY(${translateY4}px)` }} />
      </div>
      <div className="home-content-container">
        <div className="home-content-box">
          <div className="home-content-text">
            <h2>Jouw volgende avontuur begint hier</h2>
            <div className="home-content">
              <p>Stel in een paar simpele stappen jullie perfecte familievakantie samen. Kies een bestemming, voeg favoriete activiteiten toe en start een avontuur om nooit te vergeten!</p>
              <FullButton onClick={() => setShowLogin(true)}>Plan je reis</FullButton>
            </div>
          </div>
          <div className="picture-container">
            <img src={SeePicture2} alt="Blue See" className="image5 rotate-on-visible" />
            <img src={City} alt="Blue See" className="image6" />
          </div>
        </div>
        <div className="home-content-box-1">
          <div className="home-content-text">
            <h2>Houd overzicht over al jullie familieavonturen</h2>
            <div className="home-content">
              <p>Bekijk eerdere reizen en zie wat er nog op de planning staat. Zo mis je geen enkel speciaal moment met de mensen die je liefhebt.</p>
              <FullButton onClick={() => setShowLogin(true)}>Bekijk het overzicht</FullButton>
            </div>
          </div>
          <div className="picture-container">
            <img src={MountainCity} alt="Blue See" className="image8" />
            <img src={CityPicture} alt="Blue See" className="image7 rotate-on-visible1" />
          </div>
        </div>

        <div className="home-content-box2">
          <div className="home-content-text">
            <h2>Laat je inspireren door echte familieverhalen</h2>
            <div className="home-content">
              <p>Ontdek unieke reizen die andere gezinnen hebben gedeeld. Misschien vind je er wel het idee voor jullie volgende droomvakantie!</p>
              <FullButton onClick={() => setShowLogin(true)}>Bekijk je reis</FullButton>
            </div>
          </div>
          <div className="picture-container">
            <img src={BlueSeePicture} alt="Blue See" className="image9 rotate-on-visible" />
          </div>
        </div>
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LogIn onClose={() => setShowLogin(false)} />
      </LoginModal>
    </>
  );
}

export default HomeContent;
