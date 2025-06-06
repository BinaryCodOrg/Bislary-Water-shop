import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { CreatableSelectField } from "../../assets/Custom/CreateableMultiSelect/CreatableMultiSelectField";
import * as Yup from "yup";
import CInput from "../../assets/Custom/CInput";
import CButton from "../../assets/Custom/CButton";
import { useNavigate } from "react-router-dom";
import { openNotification, toCommaAndPKR } from "../../assets/Api/Api";
import {
  DelivaryBoysArray,
  HouseNumbersArray,
  OrdersArray,
} from "../../Store/Store";
import { useRecoilState, useRecoilValue } from "recoil";
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { Tooltip } from "antd";
import DynamicTable from "../../assets/Custom/DynamicTable";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa6";

const DeliveryBoysForm = (props) => {
  const Nav = useNavigate();

  let [delivaryBoysArray, setDelivaryBoysArray] =
    useRecoilState(DelivaryBoysArray);

  let headings = [
    { label: "No#", attribute: "index" },

    { label: "Name", attribute: "name" },
    { label: "Phone Number", attribute: "phoneNumber" },
    { label: "ID Card", attribute: "iDCard" },

    {
      label: "Operations",
      attribute: "Operations",
      options: [
        {
          action: "edit",
          label: "Edit",
          icon: <FaEdit />,
        },
        {
          action: "update",
          label: "Update",
          icon: <FaClipboardCheck />,
        },
      ],
    },
  ];

  const menuItems = [
    {
      action: "edit",
      label: "Edit",
      icon: <FaEdit />,
      onClick: (heading, row) => CallBack(heading, row, "Edit"),
    },

    {
      action: "delete",
      label: "Delete",
      icon: <FaTrashAlt />,
      danger: true,
      onClick: (heading, row) => CallBack(heading, row, "Delete"),
    },
  ];

  return (
    <Formik
      initialValues={{
        name: "",
        phoneNumber: "",
        salary: "",
        iDCard: "",
        remarks: "",
      }}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Name is required")
          .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
        phoneNumber: Yup.string()
          .required("Phone Number is required")
          .matches(
            /^03\d{9}$/,
            "Phone Number must be 11 digits and start with 03"
          ),
        iDCard: Yup.string()
          .required("ID Card Number is required")
          .matches(
            /^3\d{12}$/,
            "ID Card Number must be 13 digits and start with 3"
          ),
        salary: Yup.string()
          .required("Salary is required")
          .matches(
            /^PKR\s?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
            "Salary must be like 'PKR 9,898' or 'PKR 9,898.00'"
          ),
      })}
      onSubmit={async (values, { resetForm }) => {
        try {
          const payload = values;

          const result = await window.api.addDeliveryBoy(payload); //Smart Order Add

          console.log("result from api:", result);

          if (result.success) {
            setDelivaryBoysArray((prev) => [
              {
                ...payload,
                id: result.id, // Assuming the API returns the new order ID
              },
              ...prev,
            ]);

            openNotification(
              "success",
              "topRight",
              "Delivery Boy Added Successfully",
              "New Delivery boy is added into the system"
            );
            resetForm(); // optional
          } else {
            openNotification(
              "error",
              "topRight",
              "Delivery Boy Save Failed",
              `Failed to save delivery boy: ${result.message}`
            );
          }
        } catch (error) {
          console.error("Error saving delivery boy:", error);
          openNotification(
            "error",
            "topRight",
            "Delivery Boy Save Failed",
            `An error occurred while saving the delivery boy: ${error.message}`
          );
        }
      }}
      innerRef={props.formRef}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue, handleChange }) => (
        <Form>
          <Row className="my-2 justify-content-center">
            <Col md={6}>
              <Row>
                <Col md={6} className="my-2">
                  <CInput
                    type="text"
                    name="name"
                    label="Name :"
                    placeholder="Enter Name"
                  />
                </Col>
                <Col md={6} className="my-2">
                  <CInput
                    type="text"
                    name="salary"
                    label="Salary :"
                    placeholder="Enter Salary"
                    onChangeCallback={(values, setFieldValue, target) => {
                      setFieldValue(
                        target.name,
                        toCommaAndPKR(target.value.replace(/[^0-9.-]+/g, ""))
                      );
                    }}
                  />
                </Col>
                <Col md={6} className="my-2">
                  <CInput
                    type="text"
                    name="phoneNumber"
                    label="Phone Number :"
                    placeholder="Enter Phone Number"
                  />
                </Col>
                <Col md={6} className="my-2">
                  <CInput
                    type="text"
                    name="iDCard"
                    label="ID Card Number :"
                    placeholder="Enter ID Card Number"
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
          </Row>
          <Row className="mt-4 justify-content-center">
            <Col md={9}>
              <DynamicTable
                type="antd"
                CallBack={() => {}}
                menuItems={menuItems}
                headings={headings}
                data={
                  Array.isArray(delivaryBoysArray) &&
                  delivaryBoysArray.length > 0
                    ? delivaryBoysArray
                    : []
                }
              />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default DeliveryBoysForm;
