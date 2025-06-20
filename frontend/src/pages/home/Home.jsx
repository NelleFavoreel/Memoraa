import "./Home.css";
import HomeContent from "../../components/home/HomeContent";
import TravelSlideshow from "../../components/slideshow/TravelSlideshow";
import React, { useState, useEffect } from "react";
import Footer from "../../components/footer/footer";

function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxTranslate = scrollY * 0.2;

  return (
    <>
      <div className="home-background">
        <div className="home">
          <h1 className="title">Toekomstige reizen</h1>
          <TravelSlideshow parallaxTranslate={parallaxTranslate} />
          <div className="home-content1">
            <HomeContent />
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  );
}

export default Home;
