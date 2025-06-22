import React from "react";
import { Col, Row } from "react-bootstrap";
import DeliveryBoysForm from "../From/DeliveryBoysForm";

const DeliveryBoys = () => {
  return (
    <Row className="justify-content-center">
      <Col md="12">
        <h3 className="text-center Head2">Delivery Boys</h3>
      </Col>
      <Col md="12">
        <DeliveryBoysForm />
      </Col>
    </Row>
  );
};

export default DeliveryBoys;
