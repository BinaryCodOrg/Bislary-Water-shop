import { atom } from "recoil";

export const Loading = atom({
  key: "Loading",
  default: {
    isLoading: false,
    message: "",
  },
});

export const OrdersArray = atom({
  key: "OrdersArray",
  default: [],
});

export const HouseNumbersArray = atom({
  key: "HouseNumbersArray",
  default: [],
});

export const DelivaryBoysArray = atom({
  key: "DelivaryBoysArray",
  default: [],
});

export const PaymentArray = atom({
  key: "PaymentArray",
  default: [],
});

export const TodayStats = atom({
  key: "TodayStats",
  default: {},
});
