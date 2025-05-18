import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullButton from "../../components/button/FullButton";
import "./BeforeHome.css";
import HomeContent from "../../components/home/HomeContent";
function BeforeHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  return (
    <>
      <div className="before-home-container">
        <FullButton className="header-button" onClick={() => navigate("/login")}>
          Log in
        </FullButton>
        <div>
          <h1>Start hier je familie reisavonturen</h1>
          <h3>Log in en ontdek het zelf</h3>
          <FullButton onClick={() => navigate("/login")}>Log in</FullButton>
        </div>
        <HomeContent></HomeContent>
      </div>
    </>
  );
}

export default BeforeHome;
