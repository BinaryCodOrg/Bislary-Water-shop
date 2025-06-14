import React from "react";
import { Col, Row } from "react-bootstrap";
import OrdersData from "../Landing/OrdersData";

const AllOrders = () => {
  return (
    <div className="container-fluid">
      <Row className="justify-content-center">
        <Col md={12}>
          <OrdersData />
        </Col>
      </Row>
    </div>
  );
};

export default AllOrders;
