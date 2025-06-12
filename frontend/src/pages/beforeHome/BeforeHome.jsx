import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../components/modal/LoginModal";
import FullButton from "../../components/button/FullButton";
import "./BeforeHome.css";
import HomeContent from "../../components/home/HomeContent";
import LogIn from "../login/LogIn";
import FlyingPlaneCanvas from "../../components/3D/Airplane";

function BeforeHome() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, []);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="before-home">
      {/* <FlyingPlaneCanvas /> */}
      <>
        <div className="before-home-button">
          <h1 className="logo">Tripli</h1>
          <FullButton className="header-button" onClick={() => setShowLogin(true)}>
            Log in
          </FullButton>
        </div>
        <div className="before-home-header">
          <h1>Start hier je familie reisavonturen</h1>
          <h3>Log in en ontdek het zelf</h3>
          <FullButton onClick={() => setShowLogin(true)}>Log in</FullButton>
        </div>
        <div className="before-home-container">
          <HomeContent scrollY={scrollY} />
          <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)}>
            <LogIn onClose={() => setShowLogin(false)} />
          </LoginModal>
        </div>
      </>
    </div>
  );
}

export default BeforeHome;
