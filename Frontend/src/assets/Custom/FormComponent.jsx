import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import CInput from "./CInput";
import { Button, Col, Row } from "react-bootstrap";
import DynamicYesNo from "./DynamicYesNo/DynamicYesNo";
import { CreatableMultiSelectField } from "./CreateableMultiSelect/CreatableMultiSelectField";

const FormComponent = () => {
  let options = [
    { value: "", label: "Select" },
    { value: "value 1", label: "Value" }
  ]
  let optionsMultiSelect = [
    { value: "value 1", label: "Value 1" },
    { value: "value 2", label: "Value 2" },
    { value: "value 3", label: "Value 3" },
    { value: "value 4", label: "Value 4" }
  ]
  return (
    <Formik
      initialValues={{
        inputNumber: "",
        inputSelect: "",
        radioInput: "",
        inputCheck: "",
        inputName: "",
      }}
      validationSchema={Yup.object({
        inputName: Yup.string().required("Text Input is required"),
        inputNumber: Yup.number()
          .typeError("Must be a number")
          .required("Number Input is required"),
        inputSelect: Yup.string().required("Select Input is required"),
        radioInput: Yup.string().required("Please select an option"), // Validation for radio buttons
        inputCheck: Yup.boolean().oneOf([true], "You must accept the terms"), // Checkbox validation
      })}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ isSubmitting, values, setFieldValue, handleChange, handleBlur }) => (
        <Form className="">
          <Row className="px-5 justify-content-center">
            <Col md={12}><h4 className="text-mute text-center mb-4">Form</h4></Col>
            <Col md={4}>
              <CInput name="inputName" label="Text Input" type="text" placeholder="Enter text" />
            </Col>
            <Col md={4}>
              <CInput name="inputNumber" label="Number Input" type="number" placeholder="Enter Number" />
            </Col>
            <Col md={4}>
              <CInput options={options} className={"form-select"} name="inputSelect" label="Select Input" type="select" placeholder="Enter text" />
            </Col>

            <Col md={4} className="pt-4">
              <div role="group" aria-labelledby="radio-group-label">
                <span id="radio-group-label" className="form-label">Select an option</span>
                <CInput className="form-check-input me-3" name="radioInput" label="Radio Option 1" type="radio" id="option1" value="option1" />
                <CInput className="form-check-input me-3" name="radioInput" label="Radio Option 2" type="radio" id="option2" value="option2" />
              </div>
            </Col>
            <Col md={4} className="pt-4">
              <CInput className={"form-check-input me-3"} name="inputCheck" label="Check the Check Box" type="checkBox" />
            </Col>

            <Col md={4} className="pt-4">
              <DynamicYesNo name={`DynamicYesNo`} values={values} handleChange={handleChange} />
            </Col>


            <Col md={4} className="pt-4">
              <label htmlFor={"MultiSelect"}>Multi Select Input</label>
              <Field
                name={`MultiSelect`}
                component={CreatableMultiSelectField}
                label="Multi Select Field"
                options={optionsMultiSelect}
              />
            </Col>

            <Col md={4} className="pt-4">
              <CInput setFieldValue={setFieldValue} handleBlur={handleBlur} values={values} placeholder="dd/MM/yyyy" name="inputDate" label="Check your Date input" type="Date" />
            </Col>

            <Col md={6} className="pt-4">
              <button className="btn btn-primary btnCustom  w-100" type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};
export default FormComponent;
