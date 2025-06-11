import { Breadcrumb } from "antd";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

import avatar1 from "../../assets/Images/logos/1.png";
import { FaHamburger, FaMoon, FaSun } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { useLocation } from "react-router-dom";
import Content from "../../assets/Content";

import { IoReload } from "react-icons/io5";

const TopBar = (props) => {
  let { collapsed, setCollapsed } = props;

  let location = useLocation();

  let [breadcrumbs, setBreadcrumbs] = useState([""]);
  let [lightMode, setLightMode] = useState(false);

  let [contentBlock, setContentBlock] = useState({});

  useEffect(() => {
    // Remove the leading slash from the pathname and split it into an array
    const slicesArray = location.pathname.split("/");
    // console.log(slicesArray, "array");
    setBreadcrumbs(slicesArray);
    const matchedPage = Content.Pages.find(
      (page) => page.route === location.pathname
    );

    setContentBlock(matchedPage);
  }, [location.pathname]); // Use location.pathname as the dependency to avoid unnecessary re-renders

  return (
    <div className="TopBarStyle">
      <div className="mainContainer">
        <div className="row justify-content-between">
          <div className="col-md-4">
            <div className="d-flex flex-column justify-content-center">
              <Breadcrumb>
                {breadcrumbs.map((elem, index) => {
                  if (index === 0) {
                    return <Breadcrumb.Item>DashBoard</Breadcrumb.Item>;
                  } else {
                    return <Breadcrumb.Item>{elem}</Breadcrumb.Item>;
                  }
                })}
              </Breadcrumb>

              <h2 className="Head2">
                {contentBlock.Title || "Title not Found"}
              </h2>
            </div>
          </div>

          <div className="col-md-2 py-2">
            <div className="AdminControlSection shadow">
              <div className="w-25">
                <TiThMenu
                  role="button"
                  size={"20px"}
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                />
              </div>
              <div className="w-25">
                <IoReload
                  role="button"
                  size={"20px"}
                  className={props.reload ? "spinReload" : ""}
                  onClick={() => {
                    props.setReload(!props.reload);
                  }}
                />
              </div>
              <div className="w-25">
                {lightMode ? (
                  <FaMoon
                    role="button"
                    size={"20px"}
                    onClick={() => {
                      setLightMode(!lightMode);
                    }}
                  />
                ) : (
                  <FaSun
                    role="button"
                    size={"20px"}
                    onClick={() => {
                      setLightMode(!lightMode);
                    }}
                  />
                )}
              </div>
              <div className="w-25">
                <Image
                  src={avatar1}
                  alt={"userIcon"}
                  fluid
                  rounded
                  height={"50px"}
                  width={"50px"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
