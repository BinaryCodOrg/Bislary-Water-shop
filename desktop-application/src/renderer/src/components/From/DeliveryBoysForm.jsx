import { Form, Formik } from "formik";
import React, {  useState } from "react";
import { Col, Row } from "react-bootstrap";
import * as Yup from "yup";
import CInput from "../../assets/Custom/CInput";
import CButton from "../../assets/Custom/CButton";
import { useNavigate } from "react-router-dom";
import { openNotification, toCommaAndPKR } from "../../assets/Api/Api";
import {
  DelivaryBoysArray,
} from "../../Store/Store";
import { useRecoilState } from "recoil";
import { Modal} from "antd";
import DynamicTable from "../../assets/Custom/DynamicTable";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaClipboardCheck } from "react-icons/fa6";

const DeliveryBoysForm = (props) => {
  const Nav = useNavigate();
  const { confirm } = Modal;

  let [delivaryBoysArray, setDelivaryBoysArray] =
    useRecoilState(DelivaryBoysArray);
  let [initialValues, setInitialValues] = useState({
    name: "",
    phoneNumber: "",
    salary: "",
    iDCard: "",
    remarks: "",
  });

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

  async function actionHandler(heading, row, action) {
    console.log(heading, row, action);

    switch (action) {
      case "edit":
        setInitialValues({
          ...row,
          // salary: toCommaAndPKR(parseFloat(row.salary)),
        });
        break;
      case "delete":
        deleteDeliveryBoy(row.id);
        break;
      default:
        console.log("noting hit");
        break;
    }
  }

  const deleteDeliveryBoy = (id) => {
    confirm({
      title: "Are you sure you want to removed this Delivery Boy?",
      content: "This action cannot be undone.",
      okText: "Yes, removed",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        const result = await window.api.deleteDeliveryBoy(id);
        if (result.success) {
          setDelivaryBoysArray(
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isDeleted: 1,
                  }
                : item
            )
          );
          openNotification(
            "success",
            "topRight",
            "Delete Successful",
            "Delivery Boy removed successfully."
          );
        } else {
          openNotification(
            "error",
            "topRight",
            "Delete Failed",
            result.error ||
              "An error occurred while removeing the Delivery Boy."
          );
          console.error(result.error);
        }
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
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
          const isEditMode = !!initialValues?.id;
          const payload = { ...values };
          let result;

          if (isEditMode) {
            result = await window.api.updateDeliveryBoy(payload);
          } else {
            result = await window.api.addDeliveryBoy(payload);
          }

          console.log("API result:", result);

          if (result?.success) {
            const notificationTitle = isEditMode
              ? "Delivery Boy Updated Successfully"
              : "Delivery Boy Added Successfully";
            const notificationDesc = isEditMode
              ? "The delivery boy details were successfully updated."
              : "A new delivery boy was successfully added.";

            if (isEditMode) {
              // Update the existing record
              setDelivaryBoysArray((prev) =>
                prev.map((item) =>
                  item.id === payload.id
                    ? { ...item, ...payload, updatedAt: new Date() }
                    : item
                )
              );
            } else {
              // Add new record
              setDelivaryBoysArray((prev) => [
                {
                  ...payload,
                  id: result.id,
                  isDeleted: 0,
                },
                ...prev,
              ]);
            }
            openNotification(
              "success",
              "topRight",
              notificationTitle,
              notificationDesc
            );
            resetForm(); // Clear form after success
          } else {
            openNotification(
              "error",
              "topRight",
              "Delivery Boy Save Failed",
              result?.message || "Something went wrong during save operation."
            );
          }
        } catch (error) {
          console.error("Error during submission:", error);
          openNotification(
            "error",
            "topRight",
            "Delivery Boy Save Failed",
            error?.message ||
              "Unexpected error occurred while saving the delivery boy."
          );
        } finally {
          setInitialValues({
            name: "",
            phoneNumber: "",
            salary: "",
            iDCard: "",
            remarks: "",
          });
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
                CallBack={actionHandler}
                menuItems={menuItems}
                headings={headings}
                data={
                  Array.isArray(delivaryBoysArray) &&
                  delivaryBoysArray.length > 0
                    ? delivaryBoysArray.filter((boy) => boy.isDeleted === 0)
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
