import React from "react";
import CInput from "./CInput"; // Import your CInput component
import { Table } from "react-bootstrap";
import DynamicYesNo from "./DynamicYesNo/DynamicYesNo";
import { CreatableMultiSelectField } from "./CreateableMultiSelect/CreatableMultiSelectField";
import { Field } from "formik";

const DynamicTableFields = ({ headings, data, setFieldValue, handleBlur, values, handleChange }) => {
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {headings.map((heading, index) => (
                        <th key={index}>{heading.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            {headings.map((heading, colIndex) => {
                                if (heading.attribute === "StaticString") {
                                    return (
                                        <td key={colIndex} className="fw-bold" style={heading.styleSet ? heading.styleSet : {}}>
                                            {item.StaticString}
                                        </td>
                                    );
                                }
                                // For the "numberPrint" attribute, display the row number
                                else if (heading.attribute === "renderIndex") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            {rowIndex + 1}
                                        </td>
                                    );
                                }
                                else if (heading.inputType === "multiSelect") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <Field
                                                name={`${heading.attribute}-${rowIndex}`}
                                                component={CreatableMultiSelectField}
                                                label="Multi Select Field"
                                                options={heading.options || []}
                                                onChange={(e) => heading.onChange(e, rowIndex, heading.attribute)}
                                            />
                                        </td>
                                    );
                                }
                                // Handle Date input
                                else if (heading.inputType === "date") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <CInput
                                                name={`${heading.attribute}-${rowIndex}`}
                                                type="date"
                                                setFieldValue={setFieldValue}
                                                handleBlur={handleBlur}
                                                values={values}
                                                placeholder={heading.placeholder || "yyyy"}
                                                showYearPicker={heading.showYearPicker || false}
                                                dateFormat={heading.dateFormat || "yyyy"}
                                            />
                                        </td>
                                    );
                                }
                                // Handle Textarea input
                                else if (heading.inputType === "textarea") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <CInput
                                                name={`${heading.attribute}-${rowIndex}`}
                                                type="textarea"
                                                onChange={(e) => heading.onChange(e, rowIndex, heading.attribute)}
                                                placeholder={heading.placeholder || `Enter ${heading.label.toLowerCase()}`}
                                                rows={heading.rows || 1}
                                            />
                                        </td>
                                    );
                                }
                                // Handle Select input (like Blood Pressure and Cholesterol)
                                else if (heading.inputType === "select") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <CInput
                                                name={`${heading.attribute}-${rowIndex}`}
                                                type="select"
                                                options={heading.options || []}
                                                className={heading.className || "form-select"}
                                                onChange={(e) => heading.onChange(e, rowIndex, heading.attribute)}
                                            />
                                        </td>
                                    );
                                }
                                else if (heading.inputType === "select&textArea") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <div className="d-flex justify-content-center flex-column gap-3">
                                                <div>
                                                    <CInput
                                                        name={`${heading.attribute}-${rowIndex}`}
                                                        type="select"
                                                        options={heading.options || []}
                                                        className={heading.className || "form-select"}
                                                        onChange={(e) => heading.onChange(e, rowIndex, heading.attribute)}
                                                    />
                                                </div>
                                                {values[`${heading.attribute}-${rowIndex}`] === "Other" &&
                                                    <div>
                                                        <CInput
                                                            name={`${heading.attribute2}-${rowIndex}`}
                                                            type="textarea"
                                                            onChange={(e) => heading.onChange(e, rowIndex, heading.attribute2)}
                                                            placeholder={heading.placeholder || `Enter ${heading.label.toLowerCase()}`}
                                                            rows={heading.rows || 1}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </td>
                                    );
                                }
                                // YesNo and Text area Input
                                else if (heading.inputType === "YesNo&textArea") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <div className="d-flex justify-content-center flex-column gap-3">
                                                <div>
                                                    <DynamicYesNo name={`${heading.attribute}-${rowIndex}`} values={values} handleChange={handleChange} />
                                                </div>
                                                {values[`${heading.attribute}-${rowIndex}`] === "Yes" &&
                                                    <CInput
                                                        name={`${heading.attribute2}-${rowIndex}`}
                                                        type="textarea"
                                                        onChange={(e) => heading.onChange(e, rowIndex, heading.attribute2)}
                                                        placeholder={heading.placeholder || `Enter ${heading.label.toLowerCase()}`}
                                                        rows={heading.rows || 1}
                                                    />
                                                }
                                            </div>
                                        </td>
                                    );
                                }
                                // YesNo and Text area Input
                                else if (heading.inputType === "YesNo") {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <div className="d-flex justify-content-center flex-column gap-3">
                                                <div>
                                                    <DynamicYesNo name={`${heading.attribute}-${rowIndex}`} values={values} handleChange={handleChange} />
                                                </div>
                                            </div>
                                        </td>
                                    );
                                }
                                // Default case for other input types
                                else {
                                    return (
                                        <td key={colIndex} style={heading.styleSet ? heading.styleSet : {}}>
                                            <CInput
                                                name={`${heading.attribute}-${rowIndex}`}
                                                type={heading.inputType}
                                                onChange={(e) => heading.onChange(e, rowIndex, heading.attribute)}
                                                placeholder={`Enter ${heading.label.toLowerCase()}`}
                                                options={heading.options || []}
                                                className={heading.className || ""}
                                                rows={heading.rows || ""}
                                                setFieldValue={setFieldValue}
                                                handleBlur={handleBlur}
                                                values={values}
                                                showYearPicker={heading.showYearPicker || false}
                                                dateFormat={heading.dateFormat || "MM/DD/YYYY"}
                                            />
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={headings.length} className="text-center">
                            No data available
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default DynamicTableFields;
