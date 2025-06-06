import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import DynamicTableFields from "./DynamicTableFields"; // Import your new component
import { Button, Col, Row } from "react-bootstrap";

const FormTable = () => {
    const [data, setData] = useState([
        { name: "John Doe", age: 28, email: "john@example.com" },
        { name: "Jane Smith", age: 32, email: "jane@example.com" },
        { name: "Mike Johnson", age: 45, email: "mike@example.com" },
    ]);

    const headings = [
        { label: "Name", attribute: "name", inputType: "text" },
        { label: "Age", attribute: "age", inputType: "number" },
        { label: "Email", attribute: "email", inputType: "email" },
    ];

    const handleInputChange = (e, rowIndex, attribute) => {
        const newData = [...data]; // Create a copy of the data
        newData[rowIndex][attribute] = e.target.value; // Update the specific field
        setData(newData); // Update the state with the new data
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Dynamic Input Table</h2>
            <Formik
                initialValues={{}} // Add your initial values as needed
                validationSchema={Yup.object({})} // Define your validation schema if necessary
                onSubmit={(values) => {
                    console.log(values);
                }}
            >
                {() => (
                    <Form>
                        <Row className="px-5 justify-content-center">
                            <Col md={12}>
                                <DynamicTableFields
                                    headings={headings}
                                    data={data}
                                    onChange={handleInputChange} // Pass the change handler
                                />
                            </Col>
                            <Col md={6} className="pt-4">
                                <Button type="submit" className="w-100 btnCustom" >
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormTable;
