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
  const [filterActive, setFilterActive] = useState(false);

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
    { label: "Quantity", attribute: "Quantity" },
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
      initialValues={{
        filterDate: "",
        search: "",
      }}
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
                  <div className="d-flex gap-3" style={{ width: "25%" }}>
                    <div style={{ width: "50%" }}>
                      <CInput
                        type="date"
                        name="filterDate"
                        placeholder="MM/DD/YYYY"
                        setFieldValue={setFieldValue}
                        values={values}
                        dateFormat="MM/dd/yyyy"
                        onChange={(targetDate) => {
                          console.log("targetDate:", targetDate);

                          // Update form value
                          setFieldValue("filterDate", targetDate);

                          // If date is cleared, reset filter
                          if (!targetDate) {
                            setFilteredDues(allDues);
                            setFilterActive(false);
                            return;
                          }

                          const selectedDate =
                            ConvertDate(targetDate).toLowerCase();
                          const searchValue = values.search?.toLowerCase();

                          const result = allDues.filter((item) => {
                            const itemDate = ConvertDate(
                              item.createdAt
                            ).toLowerCase();
                            const dateMatch = itemDate === selectedDate;

                            if (searchValue) {
                              const houseMatch =
                                item.houseNumber?.toLowerCase() === searchValue;
                              return dateMatch && houseMatch;
                            }

                            return dateMatch;
                          });

                          console.log("Filtered Results:", result);
                          setFilteredDues(result);
                          setFilterActive(true);
                        }}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
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
                            setFilterActive(false);
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
                          setFilterActive(true);
                        }}
                      />
                    </div>
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
            {filterActive && (
              <Col md={12} className="mt-2">
                <Card className={"shadow p-3"}>
                  <div className="d-flex flex-row gap-3">
                    <div>
                      <h4 className="Head1 fw-bold m-0">
                        Total bottles:{" "}
                        <span className="fw-normal">
                          {filteredDues.reduce(
                            (sum, entry) =>
                              sum + (parseFloat(entry.Quantity) || 0),
                            0
                          )}
                        </span>
                      </h4>
                    </div>
                    <div>
                      <h4 className="Head1 fw-bold m-0">
                        Net Due Amount:{" "}
                        <span className="fw-normal">
                          {filteredDues.reduce(
                            (sum, entry) =>
                              sum + (parseFloat(entry.due_amount) || 0),
                            0
                          ) -
                            filteredDues.reduce(
                              (sum, entry) =>
                                sum + (parseFloat(entry.paid_amount) || 0),
                              0
                            )}
                        </span>
                      </h4>
                    </div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default Accounts;
