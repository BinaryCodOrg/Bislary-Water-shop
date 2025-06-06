import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";

const GlobalHotkeys = () => {
  const navigate = useNavigate();

  useHotkeys(
    "ctrl+n",
    (e) => {
      e.preventDefault();
      navigate("/orders"); // Or trigger a modal
    },
    {
      enableOnTags: ["TEXTAREA", "INPUT", "SELECT"],
      preventDefault: true,
    }
  );

  useHotkeys(
    "ctrl+b+n",
    (e) => {
      e.preventDefault();
      navigate("/orders#WICustomer", {
        state: {
          houseNumber: "walk-in-Customer",
          quantity: "1",
          rate: "PKR 70",
          status: "complete",
        },
      }); // Or trigger a modal
    },
    {
      enableOnTags: ["TEXTAREA", "INPUT", "SELECT"],
      preventDefault: true,
    }
  );

  useHotkeys(
    "ctrl+v+b",
    (e) => {
      e.preventDefault();
      navigate("/orders#WICustomer", {
        state: {
          quantity: "1",
          rate: "PKR 30",
          status: "debit",
        },
      }); // Or trigger a modal
    },
    {
      enableOnTags: ["TEXTAREA", "INPUT", "SELECT"],
      preventDefault: true,
    }
  );

  return null; // it's a logic-only component
};

export default GlobalHotkeys;
