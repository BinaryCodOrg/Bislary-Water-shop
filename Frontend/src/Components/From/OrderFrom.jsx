import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { CreatableSelectField } from "../../assets/Custom/CreateableMultiSelect/CreatableMultiSelectField";
import * as Yup from "yup";
import CInput from "../../assets/Custom/CInput";
import CButton from "../../assets/Custom/CButton";
import { useLocation, useNavigate } from "react-router-dom";
import { openNotification, toCommaAndPKR } from "../../assets/Api/Api";
import { HouseNumbersArray, OrdersArray } from "../../Store/Store";
import { useRecoilState, useRecoilValue } from "recoil";
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { Tooltip } from "antd";

const OrderFrom = (props) => {
  const Nav = useNavigate();
  const location = useLocation();

  let [orderData, setOrdersArray] = useRecoilState(OrdersArray);
  let [houseNumberArray, setHouseNumberArray] =
    useRecoilState(HouseNumbersArray);

  let [optionsMultiSelect, setOptionsMultiSelect] = useState(
    houseNumberArray.map((item) => ({
      value: item,
      label: item, // Replace underscores with spaces for display
    }))
  );

  let [previusDueAmount, setPreviusDueAmount] = useState(0);
  let [previusDB, setPreviusDB] = useState("");
  let [lastOrderData, setLastOrderData] = useState({});

  const fetchSummry = async (houseNumber) => {
    try {
      const result = await window.api.getIsSettledSum(houseNumber);
      if (result.success) {
        // console.log("Previous Due Amount:", result.isSettledSum);
        setPreviusDueAmount(result.isSettledSum);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const fetchDelivaryBoyName = async (id) => {
    try {
      // console.log("id:", id);
      const result = await window.api.getDeliveryBoyName(id);
      if (result.success) {
        // console.log("Previous DB Name:", result.name);
        setPreviusDB(result.name);
      } else {
        setPreviusDB("");
      }
    } catch (error) {
      console.error("Error fetch Delivary Boy Name:", error);
      setPreviusDB("");
    }
  };

  useEffect(() => {
    if (
      (location?.hash === "#Edit" || location?.hash === "#WICustomer") &&
      props.formRef?.current &&
      location.state &&
      Object.keys(location.state).length > 0
    ) {
      props.formRef.current.setValues({
        ...location.state, // assuming you're editing this part
      });

      fetchSummry(location.state.houseNumber);
      fetchDelivaryBoyName(location.state.id);
    }
  }, [location]);

  return (
    <Formik
      initialValues={{
        houseNumber: "",
        quantity: "1",
        rate: "PKR 80",
        remarks: "",
        phoneNumber: "",
        orderType: "delivery",
        status: "pending",
      }}
      validationSchema={Yup.object({
        houseNumber: Yup.string().required("House Number is required"),
        quantity: Yup.number()
          .required("Quantity is required")
          .positive("Quantity must be a positive number")
          .integer("Quantity must be an integer"),
        rate: Yup.string()
          .required("Rate is required")
          .matches(
            /^PKR\s?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
            "Rate must be like 'PKR 9,898' or 'PKR 9,898.00'"
          ),
        remarks: Yup.string()
          .max(500, "Remarks cannot exceed 500 characters")
          .nullable(),
        phoneNumber: Yup.string().matches(
          /^03\d{9}$/,
          "Phone Number must be 11 digits and start with 03"
        ),
      })}
      onSubmit={async (values, { resetForm }) => {
        try {
          console.log("valeus to save:", values);
          const payload = values;
          // return;

          // console.log("window.api :", window.api);

          // Use exposed Electron API
          // const result = await window.api.addOrder(payload); //Simple Order Add

          const result = await window.api.addSmartOrder(payload); //Smart Order Add

          console.log("result from api:", result);

          if (result.success) {
            console.log(
              "Total:",
              toCommaAndPKR(
                parseFloat(payload.rate.replace(/[^0-9.-]+/g, "") || 0) *
                  parseFloat(payload.quantity || 0)
              )
            );
            // Update the orders array in Recoil state
            setOrdersArray((prev) => [
              {
                ...payload,
                id: result.id, // Assuming the API returns the new order ID
                createdAt: new Date().toISOString(), // Add current timestamp
                // status: "pending", // Default status
                total_amount:
                  parseFloat(payload.rate.replace(/[^0-9.-]+/g, "") || 0) *
                  parseFloat(payload.quantity || 0),
                rate: payload.rate.replace(/[^0-9.-]+/g, ""),
              },
              ...prev,
            ]);

            // Update the house numbers array in Recoil state
            if (!houseNumberArray.includes(values.houseNumber)) {
              setHouseNumberArray((prev) => [
                ...prev,
                values.houseNumber.replace(/ /g, "_"), // Replace spaces with underscores
              ]);
            }

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
          <Row className="justify-content-center d-none">
            <Col md={2}>
              <label className="mt-2 Head1 fw-bold" htmlFor={"houseNumber"}>
                House Number:
              </label>
            </Col>
            <Col md={3}>
              <Field
                name={`houseNumber`}
                component={CreatableSelectField}
                label="Multi Select Field"
                options={optionsMultiSelect}
              />
            </Col>
          </Row>

          <Row className="my-2">
            <Col md={1}></Col>
            <Col md={5}>
              <Row>
                <Col md={12} className="my-2">
                  <label className="Head1 fw-bold" htmlFor={"houseNumber"}>
                    House Number &nbsp;
                    <Tooltip title="No spaces or special characters. Use _ for space. Others will be removed before saving.">
                      <TbInfoSquareRoundedFilled />
                    </Tooltip>
                    :
                  </label>
                  <Field
                    name={`houseNumber`}
                    component={CreatableSelectField}
                    label="Multi Select Field"
                    options={[
                      { value: "walk-in-Customer", label: "walk-in-Customer" },
                      { value: "Ikram", label: "Ikram" },
                      { value: "Islam", label: "Islam" },
                      { value: "Sonu", label: "Sonu" },
                      { value: "Saif", label: "Saif" },
                      ...optionsMultiSelect,
                    ]}
                    onChangeCallback={(target) => {
                      // Filter orders by selected houseNumber
                      const matchingOrders = orderData
                        .filter((item) => item.houseNumber === target)
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        ); // Sort by latest createdAt

                      const latestOrder = matchingOrders[0] || null;

                      if (Object.keys(latestOrder || {}).length !== 0) {
                        // console.log("Latest Order Found:", latestOrder);
                        setFieldValue(
                          "rate",
                          toCommaAndPKR(
                            latestOrder.rate.replace(/[^0-9.-]+/g, "")
                          ) || "80"
                        );
                        setFieldValue(
                          "phoneNumber",
                          latestOrder.phoneNumber || ""
                        );
                        setLastOrderData({
                          date: new Date(
                            latestOrder.createdAt
                          ).toLocaleDateString("en-US"),
                          rate: latestOrder.rate,
                        });

                        fetchDelivaryBoyName(latestOrder.id);
                      }

                      if (houseNumberArray.includes(target)) {
                        fetchSummry(target);
                        setFieldValue("status", "pending");
                      }

                      if (target == "walk-in-Customer") {
                        setFieldValue("orderType", "walk-in");
                        setFieldValue("status", "complete");
                      } else if (
                        ["Ikram", "Islam", "Sonu", "Saif"].includes(target)
                      ) {
                        setFieldValue("orderType", "bulk");
                        setFieldValue("status", "debit");
                      }
                    }}
                  />

                  <ErrorMessage
                    name="houseNumber"
                    component="div"
                    className="text-danger"
                  />
                </Col>
                <Col md={6} className="my-2">
                  <CInput
                    type="number"
                    name="quantity"
                    label="Quantity :"
                    placeholder="Enter Quantity"
                  />
                </Col>
                <Col md={6} className="my-2">
                  <CInput
                    type="text"
                    name="rate"
                    label="Rate :"
                    placeholder="Enter Price"
                    onChangeCallback={(values, setFieldValue, target) => {
                      setFieldValue(
                        "rate",
                        toCommaAndPKR(target.value.replace(/[^0-9.-]+/g, ""))
                      );
                    }}
                  />
                </Col>
                <Col md={12} className="my-2">
                  <CInput
                    type="text"
                    name="phoneNumber"
                    label="Phone Number :"
                    placeholder="Enter Phone Number"
                  />
                </Col>
                <Col md={12} className="my-2">
                  <CInput
                    type="textarea"
                    name="remarks"
                    label="Remarks :"
                    placeholder="Enter Remarks"
                  />
                </Col>
              </Row>
              <Row className="justify-content-between px-3 mt-3">
                <CButton
                  text="Back"
                  onClick={() => {
                    Nav("/");
                  }}
                  style={{ width: "fit-content" }}
                />
                <CButton
                  text="Submit"
                  type="primary" // AntD style
                  htmlType="submit" // HTML form submission behavior
                  style={{ width: "fit-content" }}
                  // onClick={handleSubmit} // Formik's handleSubmit
                />
              </Row>
            </Col>
            <Col md={1}></Col>

            <Col md={4} className="">
              <div className="d-flex justify-content-between align-items-center mt-4">
                <h4 className="Head2 text-center">Total: </h4>
                <h5 className="Head2 text-center">
                  {toCommaAndPKR(
                    parseFloat(values.rate.replace(/[^0-9.-]+/g, "") || 0) *
                      parseFloat(values.quantity || 0)
                  )}
                </h5>
              </div>
              <Card className="p-2 my-3">
                <Card.Body className="py-0">
                  <Row>
                    <h4 className="Head2 text-center">Previous Data</h4>
                    <Col
                      md={12}
                      className="my-2 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold"> Last Delivary Data: </h6>
                      <h6 className="mt-1"> {lastOrderData.date || "--"} </h6>
                    </Col>
                    <Col
                      md={12}
                      className="my-2 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold">Last Bottle Rate: </h6>
                      <h6 className="mt-1"> {lastOrderData.rate || "--"} </h6>
                    </Col>
                    <Col
                      md={12}
                      className="my-2 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold">Prev. Bal: </h6>
                      <h6 className="mt-1">
                        {" "}
                        {previusDueAmount === 0
                          ? "--"
                          : toCommaAndPKR(previusDueAmount || 0)}{" "}
                      </h6>
                    </Col>
                    <Col
                      md={12}
                      className="my-2 d-flex justify-content-between"
                    >
                      <h6 className="fw-bold">Last Delivery Boy: </h6>
                      <h6 className="mt-1"> {previusDB || "--"} </h6>
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

export default OrderFrom;
