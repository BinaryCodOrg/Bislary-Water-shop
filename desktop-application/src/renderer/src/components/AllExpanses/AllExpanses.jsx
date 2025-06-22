import React from "react";
import ExpanceFrom from "../From/ExpanceFrom";

const AllExpanses = () => {
  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h3 className="text-center Head2">All Expanses Form</h3>
        </div>
        <div className="col-md-12">
          <ExpanceFrom />
        </div>
      </div>
    </div>
  );
};

export default AllExpanses;
