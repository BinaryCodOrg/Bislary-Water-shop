import { Form, Formik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import CInput from "../../assets/Custom/CInput";
import DynamicTable from "../../assets/Custom/DynamicTable";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AllDues } from "../../Store/Store";
import { useRecoilState } from "recoil";
import { ConvertDate } from "../../assets/Api/Api";

const Accounts = () => {
  const [allDues, setAllDues] = useRecoilState(AllDues);

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

  let headings = [
    { label: "No#", attribute: "index" },
    // { label: "Order ID", attribute: "order_id" },
    { label: "House Number", attribute: "houseNumber" },
    { label: "Paid Amount", attribute: "paid_amount" },
    { label: "Due Amount", attribute: "due_amount" },
    { label: "Is Settled", attribute: "isSettled" },
    {
      label: "Created At",
      attribute: "createdAt",
      render: (row) => ConvertDate(row.createdAt),
    },
    {
      label: "Operations",
      attribute: "Operations",
      options: [], // Add action buttons here if needed
    },
  ];

  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {}}
      validationSchema={{}}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue, handleChange }) => (
        <Form>
          <Row className="justify-content-center ">
            <Col md={11}>
              <DynamicTable
                type="antd"
                CallBack={() => {}}
                menuItems={menuItems}
                headings={headings}
                data={allDues}
              />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default Accounts;
