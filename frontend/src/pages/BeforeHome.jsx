import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BeforeHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, []);

  return (
    <div>
      <h1>Welkom bij Memoraa!</h1>
      <p>Log in om te beginnen met je familieavonturen.</p>
      <button onClick={() => navigate("/login")}>Log in</button>
    </div>
  );
}

export default BeforeHome;
