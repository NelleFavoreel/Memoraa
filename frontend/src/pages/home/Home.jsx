import ReactFullpage from "@fullpage/react-fullpage";
import "./Home.css";
import HomeContent from "../../components/home/HomeContent";
import TravelSlideshow from "../../components/slideshow/TravelSlideshow";

function Home() {
  return (
    <ReactFullpage
      licenseKey={"gplv3-license"}
      scrollingSpeed={800}
      autoScrolling={true}
      fitToSection={true}
      scrollOverflow={false}
      navigation
      anchors={["slideshow", "info"]}
      render={({ fullpageApi }) => {
        return (
          <div id="fullpage-wrapper">
            {/* SECTION 1 - Slideshow */}
            <div className="section sectionHome">
              <div className="sectionInner">
                <div className="home">
                  <h1 className="title">Toekomstige reizen</h1>
                  <TravelSlideshow />
                </div>
              </div>
            </div>

            {/* SECTION 2 - Info */}
            <div className="section sectionHome">
              <div className="home">
                <HomeContent />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

export default Home;
