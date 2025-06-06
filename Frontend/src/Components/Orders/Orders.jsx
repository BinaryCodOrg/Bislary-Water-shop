import React, { useRef } from "react";
import OrderFrom from "../From/OrderFrom";
import { Col, Row } from "react-bootstrap";
import CButton from "../../assets/Custom/CButton";
import { useNavigate } from "react-router-dom";

import "./Drop.css";

const Orders = () => {
  const formRef = useRef(null);
  const Nav = useNavigate();

  const handleOk = () => {
    if (formRef.current) {
      formRef.current.handleSubmit(); // Trigger Formik's handleSubmit
    }
  };

  return (
    <div className="position-relative">
      <div style={{ zIndex: 2 }}>
        <h3 className="text-center Head2">New Order</h3>
        <OrderFrom formRef={formRef} />
      </div>
      <div
        className="position-absolute  bottom-0 end-0 p-3 customDrop overflow-hidden d-none"
        style={{ zIndex: 1 }}
      >
        <div className="drop"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default Orders;
