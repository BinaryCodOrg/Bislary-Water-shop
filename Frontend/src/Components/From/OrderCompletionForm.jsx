import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import CInput from "../../assets/Custom/CInput";
import { useNavigate } from "react-router-dom";
import { openNotification, toCommaAndPKR } from "../../assets/Api/Api";
import {
  DelivaryBoysArray,
  OrdersArray,
  PaymentArray,
} from "../../Store/Store";
import { useRecoilState, useRecoilValue } from "recoil";

const OrderCompletionForm = (props) => {
  const Nav = useNavigate();

  let [orderData, setOrdersArray] = useRecoilState(OrdersArray);
  let [paymentArray, setPaymentArray] = useRecoilState(PaymentArray);
  let delivaryBoysArray = useRecoilValue(DelivaryBoysArray);

  let [previusDueAmount, setPreviusDueAmount] = useState(0);

  useEffect(() => {
    if (props?.modalObject?.row?.houseNumber) {
      fetchSummry(props.modalObject.row.houseNumber);
    }
  }, [props.modalObject.row]);

  const fetchSummry = async (houseNumber) => {
    try {
      const result = await window.api.getIsSettledSum(houseNumber);
      if (result.success) {
        console.log("Previous Due Amount:", result.isSettledSum);
        setPreviusDueAmount(result.isSettledSum);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  return (
    <Formik
      initialValues={{
        payment_method: "COD",
        amount_paid: "PKR 0",
        delivery_boy_id: "1",
      }}
      validationSchema={Yup.object({
        payment_method: Yup.string().required(),
        amount_paid: Yup.string().required(),
        delivery_boy_id: Yup.string().required(),
      })}
      onSubmit={async (values, { resetForm }) => {
        try {
          // console.log("valeus to save:", values);
          const payload = {
            orderId: props?.modalObject?.row?.id,
            amount_paid: parseFloat(
              values.amount_paid.replace(/[^0-9.-]+/g, "")
            ),
            payment_method: values.payment_method,
            deliveryBoy: values.delivery_boy_id,
          };

          const result = await window.api.markOrderComplete(payload); //Smart Order Add

          console.log("result from api:", result);

          if (result.success) {
            // Update the orders array in the Recoil state
            setOrdersArray((prevOrders) =>
              prevOrders.map((order) =>
                order.id === payload.orderId
                  ? { ...order, status: result.status }
                  : order
              )
            );

            // setPaymentArray();

            openNotification(
              "success",
              "topRight",
              "Order Saved Successfully",
              `Order with House Number: ${values.houseNumber} has been saved successfully.`
            );
            resetForm(); // optional
          } else {
            openNotification(
              "error",
              "topRight",
              "Order Save Failed",
              `Failed to save order: ${result.message}`
            );
          }
        } catch (error) {
          console.error("Error saving order:", error);
          openNotification(
            "error",
            "topRight",
            "Order Save Failed",
            `An error occurred while saving the order: ${error.message}`
          );
        }
      }}
      innerRef={props.formRef}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue, handleChange }) => (
        <Form>
          <Row className="my-1">
            <Col md={12} className="">
              <div className="d-flex justify-content-between align-items-center mt-4">
                <h4 className="Head2 text-center">Total: </h4>
                <h5 className="Head2 text-center">
                  {toCommaAndPKR(props?.modalObject?.row?.total_amount) || "--"}{" "}
                </h5>
              </div>
              <Card className="p-2 my-3">
                <Card.Body className="py-0">
                  <Row>
                    <h4 className="Head2 text-center">Order Data</h4>
                    <Col
                      md={12}
                      className="my-1 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold">House Number: </h6>
                      <h6 className="mt-1">
                        {" "}
                        {props?.modalObject?.row?.houseNumber || "--"}{" "}
                      </h6>
                    </Col>
                    <Col
                      md={12}
                      className="my-1 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold">Quantity: </h6>
                      <h6 className="mt-1">
                        {" "}
                        {props?.modalObject?.row?.quantity || "--"}{" "}
                      </h6>
                    </Col>
                    <Col
                      md={12}
                      className="my-1 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold">Rate: </h6>
                      <h6 className="mt-1">
                        {" "}
                        {props?.modalObject?.row?.rate || "--"}{" "}
                      </h6>
                    </Col>
                    <Col
                      md={12}
                      className="my-1 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold">Previus Balance: </h6>
                      <h6 className="mt-1">
                        {" "}
                        {toCommaAndPKR(previusDueAmount || 0) || "--"}{" "}
                      </h6>
                    </Col>
                    <Col
                      md={12}
                      className="my-1 d-flex justify-content-between align-items-center"
                    >
                      <h6 className="fw-bold m-0">Payment method: </h6>
                      <CInput
                        type="select"
                        className={"form-select"}
                        style={{ width: "120px" }}
                        name="payment_method"
                        options={[
                          { value: "COD", label: "COD" },
                          { value: "Cash", label: "Cash" },
                          { value: "JazzCash", label: "JazzCash" },
                        ]}
                      />
                    </Col>
                    <Col
                      md={12}
                      className="my-1 d-flex justify-content-between align-items-center"
                    >
                      <h6 className="fw-bold m-0">Paid Amount: </h6>
                      <CInput
                        type="text"
                        name="amount_paid"
                        placeholder="Paid amount"
                        style={{ width: "120px" }}
                        onChangeCallback={(values, setFieldValue, target) => {
                          setFieldValue(
                            target.name,
                            toCommaAndPKR(
                              target.value.replace(/[^0-9.-]+/g, "")
                            )
                          );
                        }}
                      />
                    </Col>
                    <Col
                      md={12}
                      className="my-1 d-flex justify-content-between align-items-center"
                    >
                      <h6 className="fw-bold m-0">Delivery Boy: </h6>
                      <CInput
                        type="select"
                        className={"form-select"}
                        style={{ width: "120px" }}
                        name="delivery_boy_id"
                        options={delivaryBoysArray.map((item, index) => {
                          return { value: item.id, label: item.name };
                        })}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default OrderCompletionForm;
