import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

//import pages
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Account from "./pages/Account";
import TravelOverview from "./pages/TravelOverview";
import TravelDetail from "./pages/TravelDetail";
import LogIn from "./pages/LogIn";
import InfoForm from "./components/account/InfoForm";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<TravelOverview />} />
          <Route path="/trips/:id" element={<TravelDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/account" element={<Account />} /> */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/users" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
