import React from "react";
import NotFoundsvg from "../assets/SVG/NotFoundsvg";

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={{ width: "50%" }}>
        <NotFoundsvg />
      </div>
    </div>
  );
};

export default NotFound;
