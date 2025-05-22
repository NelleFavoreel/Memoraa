import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/navigation/Navbar";
import Home from "./pages/home/Home";
import Calendar from "./pages/Calendar";
import Account from "./pages/Account";
import TravelOverview from "./pages/Trips/TravelOverview";
import TravelDetail from "./pages/Trips/TravelDetail";
import LogIn from "./pages/login/LogIn";
import Notifications from "./pages/Notifications";
import EditTrip from "./components/trips/EditTip";
import BeforeHome from "./pages/beforeHome/BeforeHome";
import "./App.css";

// styles
<link rel="stylesheet" href="https://use.typekit.net/wte5uxn.css"></link>;
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <MainApp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}

function MainApp({ isLoggedIn, setIsLoggedIn }) {
  const [hideNavbar, setHideNavbar] = useState(false);
  return (
    <>
      {isLoggedIn && <Navbar hidden={hideNavbar} />}

      <Routes>
        <Route path="/" element={<BeforeHome />} />
        <Route path="/login" element={<LogIn setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/home" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/trips" element={<TravelOverview />} />
        <Route path="/trips/:id" element={<TravelDetail setHideNavbar={setHideNavbar} />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/account" element={<Account />} />
        <Route path="/users" element={<Account />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/edit-trip/:id" element={<EditTrip />} />
      </Routes>
    </>
  );
}

export default App;
