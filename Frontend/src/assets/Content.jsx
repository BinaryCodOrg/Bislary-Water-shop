import React from "react";
import DashBoard from "../Components/Landing/DashBoard";
import Orders from "../Components/Orders/Orders";
import DeliveryBoys from "../Components/DeliveryBoys/DeliveryBoys";
import NotFound from "../Components/NotFound";
import Accounts from "../Components/Accounts/Accounts";

const Content = {
  Pages: [
    {
      Title: "DashBoard",
      route: "/",
      element: <DashBoard />,
    },
    {
      Title: "New Orders",
      route: "/orders",
      element: <Orders />,
    },
    {
      Title: "Delivery Boys",
      route: "/DeliveryBoys",
      element: <DeliveryBoys />,
    },
    {
      Title: "Accounts",
      route: "/Accounts",
      element: <Accounts />,
    },
    {
      Title: "404",
      route: "*",
      element: <NotFound />, // <-- Catch-all route
    },
  ],
};

export default Content;
