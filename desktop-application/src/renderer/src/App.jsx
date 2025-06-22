import React, { useEffect } from "react";
import './assets/base.css';
import ResourceBlock from "./assets/ResourceBlock/ResourceBlock";
import { Route, Routes, useLocation } from "react-router-dom";

import Aos from "aos";
import "aos/dist/aos.css";
import { Element, scroller } from "react-scroll";
import LandingPage from "./Components/Landing/LandingPage";
import GlobalHotkeys from "./assets/Custom/GlobalHotkeys";
import { useRecoilValue } from "recoil";
import { Loading } from "./Store/Store";
import { Spin } from "antd";

function App() {
  let location = useLocation();

  let loading = useRecoilValue(Loading);

  useEffect(() => {
    let cLocation = location.pathname;

    console.log(cLocation);

    // Automatically scroll to "test1" when the component mounts
    scroller.scrollTo("test1", {
      duration: 800, // Animation duration in milliseconds
      delay: 0, // Delay before scroll starts
      smooth: "easeInOutQuart", // Smooth scroll effect
      offset: -70, // Adjust for fixed headers (if any)
    });
  }, [location]);

  useEffect(() => {
    Aos.init({
      duration: 1800,
      offset: 100,
      disable: "mobile",
    });
  }, []);

  return (
    <div className="App position-relative">
      {loading.isLoading && (
        <div
          className="position-absolute top-0 d-flex justify-content-center align-items-center"
          style={{
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            zIndex: "10000",
            backgroundColor: "rgba(190, 190, 190, 0.14)",
          }}
        >
          <Spin
            size="large"
            style={{ width: "fit-content", minWidth: "80px", height: "fit-content" }}
          ></Spin>
        </div>
      )}
      <GlobalHotkeys />
      <Element name="test1" className="element"></Element>
      <Routes>
        <Route path="/ResourceBlock/*" element={<ResourceBlock />} />
        <Route path="/*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
