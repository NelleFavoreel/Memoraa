import "./Home.css";
import HomeContent from "../../components/home/HomeContent";
import TravelSlideshow from "../../components/slideshow/TravelSlideshow";
function Home() {
  return (
    <>
      <div className="home">
        <h1 className="title">Toekomstige reizen</h1>
        <TravelSlideshow></TravelSlideshow>
        <HomeContent />
      </div>
    </>
  );
}

export default Home;
