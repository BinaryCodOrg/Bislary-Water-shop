import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import CInput from "../../assets/Custom/CInput";
import DynamicTable from "../../assets/Custom/DynamicTable";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AllDues } from "../../Store/Store";
import { useRecoilState } from "recoil";
import { ConvertDate } from "../../assets/Api/Api";
import { CreatableSelectField } from "../../assets/Custom/CreateableMultiSelect/CreatableMultiSelectField";

const Accounts = () => {
  const [allDues, setAllDues] = useRecoilState(AllDues);

  const [filteredDues, setFilteredDues] = useState([]);

  useEffect(() => {
    setFilteredDues(allDues); // Initialize with all data
  }, [allDues]);

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
      // validationSchema={{}}
      enableReinitialize
    >
      {({ handleSubmit, values, setFieldValue, handleChange }) => (
        <Form>
          <Row className="justify-content-center ">
            <Col md={12}>
              <Card className={"shadow p-3"}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="Head2 m-0">Due Accounts</h4>
                  <div style={{ width: "15%" }}>
                    <Field
                      name="search"
                      component={CreatableSelectField}
                      label="Multi Select Field"
                      options={[
                        ...Array.from(
                          new Set(allDues.map((item) => item.houseNumber))
                        ).map((houseNumber) => ({
                          value: houseNumber,
                          label: houseNumber,
                        })),
                      ]}
                      onChangeCallback={(target) => {
                        console.log(target);
                        if (!target) {
                          setFilteredDues(allDues);
                          return;
                        }

                        const query = target.toLowerCase();

                        const result = allDues.filter((item) => {
                          const houseMatch = item.houseNumber
                            ?.toLowerCase()
                            .includes(query);
                          const formattedDate = ConvertDate(
                            item.createdAt
                          ).toLowerCase();
                          const dateMatch = formattedDate.includes(query);

                          return houseMatch || dateMatch;
                        });

                        setFilteredDues(result);
                      }}
                    />
                  </div>
                </div>
                <DynamicTable
                  type="antd"
                  CallBack={() => {}}
                  menuItems={menuItems}
                  headings={headings}
                  data={filteredDues}
                  pagination={true}
                />
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default Accounts;
