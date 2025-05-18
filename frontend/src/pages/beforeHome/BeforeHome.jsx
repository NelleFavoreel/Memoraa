import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../components/modal/LoginModal";
import FullButton from "../../components/button/FullButton";
import "./BeforeHome.css";
import HomeContent from "../../components/home/HomeContent";
import LogIn from "../login/LogIn";
function BeforeHome() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home");
  }, []);

  return (
    <div className="before-home-container">
      <FullButton className="header-button" onClick={() => setShowLogin(true)}>
        Log in
      </FullButton>
      <div>
        <h1>Start hier je familie reisavonturen</h1>
        <h3>Log in en ontdek het zelf</h3>
        <FullButton onClick={() => setShowLogin(true)}>Log in</FullButton>
      </div>
      <HomeContent />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LogIn />
      </LoginModal>
    </div>
  );
}

export default BeforeHome;
