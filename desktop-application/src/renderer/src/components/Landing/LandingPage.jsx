import React, { useEffect, useState } from "react";
import AdminSideBar from "../Navigation/AdminSideBar";
import TopBar from "../Navigation/TopBar";
import { Route, Routes, useLocation } from "react-router-dom";
import DashBoard from "./DashBoard";
import Content from "../../assets/Content";
// import HeadChanger from "../../assets/Custom/HeadChanger";
import NotFound from "../NotFound";
import { useRecoilState } from "recoil";
import {
  AllDues,
  DelivaryBoysArray,
  ExpancesArray,
  HouseNumbersArray,
  Loading,
  OrdersArray,
  Reload,
  TodayStats,
} from "../../Store/Store";

const LandingPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [reload, setReload] = useRecoilState(Reload);

  const [webHead, setWebHead] = useState("Dashboard");
  const [ordersArray, setOrdersArray] = useRecoilState(OrdersArray);
  const [houseNumbersArray, setHouseNumbersArray] =
    useRecoilState(HouseNumbersArray);

  let [delivaryBoysArray, setDelivaryBoysArray] =
    useRecoilState(DelivaryBoysArray);
  let [expancesArray, setExpancesArray] = useRecoilState(ExpancesArray);
  const [loading, setLoading] = useRecoilState(Loading);
  const [todayStats, setTodayStats] = useRecoilState(TodayStats);
  const [allDues, setAllDues] = useRecoilState(AllDues);

  let location = useLocation();

  let Pages = Content.Pages;

  useEffect(() => {
    // console.log(location, "location");
    let route = location.pathname;
    Content.Pages.forEach((item) => {
      if (item?.route == route) {
        setWebHead(item?.Title || "Title Not Found");
      }
    });
  }, [location]);

  useEffect(() => {
    if (reload) {
      FetchOrders();
    }
  }, [reload]);

  async function FetchOrders() {
    setLoading((prev) => ({
      ...prev,
      isLoading: true,
      message: "Fetching Orders...",
    }));
    try {
      const data = await window.api.getOrders();
      // console.log(data, data.length, "Orders Data");
      setOrdersArray(data);

      const houseNumbers = await window.api.getAllHouseNumbers();
      // console.log(houseNumbers, "houseNumbers");
      setHouseNumbersArray(houseNumbers);

      const DelivaryBoys = await window.api.getDeliveryBoys();
      // console.log(DelivaryBoys, "DelivaryBoys");
      setDelivaryBoysArray(DelivaryBoys);

      const TodayStatsObj = await window.api.getTodayStats();
      // console.log(TodayStatsObj, "TodayStatsObjs");
      setTodayStats(TodayStatsObj.data);

      const getAllDues = await window.api.getAllDues();
      // console.log(getAllDues, "getAllDues");
      setAllDues(getAllDues);

      const getExpenses = await window.api.getExpenses();
      // console.log(getExpenses, "getExpenses");
      setExpancesArray(getExpenses.data);

      setLoading((prev) => ({
        ...prev,
        isLoading: false,
        message: "Data fetching successfull",
      }));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setLoading((prev) => ({
        ...prev,
        isLoading: false,
        message: "Data Fetching had some errors...",
      }));
    } finally {
      setLoading((prev) => ({
        ...prev,
        isLoading: false,
        message: "Data fetching completed",
      }));
      setReload(false);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* <HeadChanger title={webHead} /> */}
      {/* Loading Indicator */}

      {/* Sidebar */}
      <div
        style={{
          width: isSidebarCollapsed ? "80px" : "250px",
          background: "#fff",
          transition: "width 0.3s ease",
          overflow: "hidden",
          // padding: "16px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <AdminSideBar
          collapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
          setReload={setReload}
          reload={reload}
        />
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <TopBar
          collapsed={isSidebarCollapsed}
          setCollapsed={setIsSidebarCollapsed}
          setReload={setReload}
          reload={reload}
        />

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          <Routes>
            {Pages.map((item, index) => {
              return <Route path={item.route} element={item.element} />;
            })}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#f4f4f4",
            padding: "10px",
            textAlign: "center",
            boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0 }}>© 2024 Your Company. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
