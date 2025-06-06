import React from "react";
import DashBoard from "../Components/Landing/DashBoard";
import Orders from "../Components/Orders/Orders";
import DeliveryBoys from "../Components/DeliveryBoys/DeliveryBoys";

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
  ],
};

export default Content;
