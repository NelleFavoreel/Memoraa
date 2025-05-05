import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

//import pages
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Account from "./pages/Account";
import TravelOverview from "./pages/TravelOverview";
import TravelDetail from "./pages/TravelDetail";

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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
