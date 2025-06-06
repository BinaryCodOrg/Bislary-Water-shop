import React from "react";
import { Field } from "formik";
import DatePicker from "react-datepicker";
import { differenceInYears } from "date-fns";
import { Button, InputGroup } from "react-bootstrap";

const CInput = ({ label, className, ...props }) => {
  switch (props.type) {
    case "textarea":
    case "Textarea":
    case "TextArea":
    case "textArea":
      return (
        <div className="input-wrapper">
          {label && (
            <label
              className="fw-bold text-left Head1 mb-2 w-100"
              htmlFor={props.name}
            >
              {label}
            </label>
          )}
          <Field name={props.name}>
            {({ field, form, meta }) => (
              <React.Fragment>
                <textarea
                  {...field} // Provides value, onChange, and onBlur
                  {...props} // Other custom props like placeholder, type, etc.
                  className={` ${className || "form-control"} ${
                    meta.touched && meta.error ? "is-invalid" : ""
                  }`}
                  onChange={(e) => {
                    const { name, value } = e.target;

                    // Update Formik field value
                    form.setFieldValue(name, value);

                    // Call custom onChange callback if provided
                    if (props.onChangeCallback) {
                      props.onChangeCallback(
                        form.values,
                        form.setFieldValue,
                        e.target
                      );
                    }
                  }}
                />
                {meta.touched && meta.error ? (
                  <div className="error-text">{meta.error}</div>
                ) : null}
              </React.Fragment>
            )}
          </Field>
        </div>
      );

      break;

    case "CheckBox":
    case "checkBox":
    case "checkbox":
      return (
        <div className="input-wrapper" style={{ width: "fit-content" }}>
          <Field name={props.name}>
            {({ field, form, meta }) => (
              <div
                className={`checkbox-wrapper ${
                  meta.touched && meta.error ? "is-invalid" : ""
                }`}
              >
                <input
                  type="checkbox" // Specify the type for checkbox
                  {...field} // Provides value, onChange, and onBlur
                  {...props} // Other custom props
                  className="form-check-input me-2" // Apply specific checkbox class
                  id={props.id ? props.id : props.name} // Use the name for the id
                  onChange={(e) => {
                    const { name, value } = e.target;

                    // Update Formik field value
                    form.setFieldValue(name, e.target.checked);
                  }}
                />
                {label && (
                  <label
                    htmlFor={props.id ? props.id : props.name}
                    className="form-check-label"
                  >
                    {label}
                  </label>
                )}
                {meta.touched && meta.error ? (
                  <div className="error-text">{meta.error}</div>
                ) : null}
              </div>
            )}
          </Field>
        </div>
      );
      break;
    case "radio":
      return (
        <div className="input-wrapper">
          <Field name={props.name}>
            {({ field, form, meta }) => (
              <div
                className={`checkbox-wrapper ${
                  meta.touched && meta.error ? "is-invalid" : ""
                }`}
              >
                <input
                  type="radio" // Specify the type for checkbox
                  {...field} // Provides value, onChange, and onBlur
                  {...props} // Other custom props
                  className="form-check-input me-2" // Apply specific checkbox class
                  id={props.id} // Use the name for the id
                  onChange={(e) => {
                    const { name, value } = e.target;

                    // Update Formik field value
                    form.setFieldValue(name, value);
                  }}
                />
                {label && (
                  <label htmlFor={props.id} className="form-check-label">
                    {label}
                  </label>
                )}
                {meta.touched && meta.error ? (
                  <div className="error-text">{meta.error}</div>
                ) : null}
              </div>
            )}
          </Field>
        </div>
      );
      break;

    case "select":
    case "Select":
      return (
        <div className="input-wrapper">
          {label && (
            <label
              className="fw-bold text-left Head1 mb-2 w-100"
              htmlFor={props.name}
            >
              {label}
            </label>
          )}
          <Field name={props.name} as="select">
            {({ field, form, meta }) => (
              <React.Fragment>
                <select
                  {...field}
                  {...props}
                  className={` ${className || "form-control"} ${
                    meta.touched && meta.error ? "is-invalid" : ""
                  }`}
                  onChange={(e) => {
                    const { name, value } = e.target;

                    // Update Formik field value
                    form.setFieldValue(name, value);
                  }}
                >
                  {props.options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {meta.touched && meta.error ? (
                  <div className="error-text">{meta.error}</div>
                ) : null}
              </React.Fragment>
            )}
          </Field>
        </div>
      );
      break;

    case "Date":
    case "date":
      return (
        <div className="input-wrapper">
          {label && (
            <label
              className="fw-bold text-left Head1 mb-2 w-100"
              htmlFor={props.name}
            >
              {label}
            </label>
          )}
          <Field name={props.name}>
            {({ field, form, meta }) => (
              <React.Fragment>
                <DatePicker
                  className={`form-control ${className} DateInputPadding ${
                    meta.touched && meta.error ? "is-invalid" : ""
                  }`}
                  selected={
                    props.values?.[props.name] || props.customSelect || null
                  }
                  onChange={(date) => {
                    const fieldName = props.name;
                    props.setFieldValue(fieldName, date);
                    if (props.ageFlag) {
                      const age = differenceInYears(new Date(), date) || 0;
                      props.setFieldValue("Age", age);
                    }
                  }}
                  dateFormat={
                    props.dateFormat ? props.dateFormat : "dd/MM/yyyy"
                  }
                  placeholderText={props.placeholder}
                  onBlur={props.handleBlur}
                  showIcon
                  maxDate={new Date()}
                  {...props}
                  id={props.name}
                  name={props.name}
                  wrapperClassName="w-100"
                  disabled={props?.disabled ?? false}
                />
                {meta.touched && meta.error ? (
                  <div className="error-text">{meta.error}</div>
                ) : null}
              </React.Fragment>
            )}
          </Field>
        </div>
      );
      break;

    default:
      if (props.group) {
        return (
          <div className="input-wrapper">
            {label && (
              <label
                className="fw-bold text-left Head1 mb-2 w-100"
                htmlFor={props.name}
              >
                {label}
              </label>
            )}
            <Field name={props.name}>
              {({ field, form, meta }) => (
                <React.Fragment>
                  <InputGroup
                    className={`${
                      meta.touched && meta.error ? "is-invalid" : ""
                    }`}
                  >
                    <input
                      {...field} // Provides value, onChange, and onBlur
                      {...props} // Other custom props like placeholder, type, etc.
                      className={`${className || "form-control"} ${
                        meta.touched && meta.error ? "is-invalid" : ""
                      }`}
                      onChange={(e) => {
                        const { name, value } = e.target;

                        // Update Formik field value
                        form.setFieldValue(name, value);

                        // Call custom onChange callback if provided
                        if (props.onChangeCallback) {
                          props.onChangeCallback(
                            form.values,
                            form.setFieldValue,
                            e.target
                          );
                        }
                      }}
                    />
                    <Button
                      className="btn bgColorIncome2  border-0"
                      id="button-addon2"
                    >
                      {props.groupIcon}
                    </Button>
                  </InputGroup>
                  {meta.touched && meta.error ? (
                    <div className="error-text">{meta.error}</div>
                  ) : null}
                </React.Fragment>
              )}
            </Field>
          </div>
        );
      } else {
        return (
          <div className="input-wrapper">
            {label && (
              <label
                className="fw-bold text-left Head1 mb-2 w-100"
                htmlFor={props.name}
              >
                {label}
              </label>
            )}
            <Field name={props.name}>
              {({ field, form, meta }) => (
                <React.Fragment>
                  <input
                    {...field} // Provides value, onChange, and onBlur
                    {...props} // Other custom props like placeholder, type, etc.
                    className={` ${className || "form-control"} ${
                      meta.touched && meta.error ? "is-invalid" : ""
                    }`}
                    onChange={(e) => {
                      const { name, value } = e.target;

                      // Update Formik field value
                      form.setFieldValue(name, value);

                      // Call custom onChange callback if provided
                      if (props.onChangeCallback) {
                        props.onChangeCallback(
                          form.values,
                          form.setFieldValue,
                          e.target
                        );
                      }
                    }}
                  />
                  {meta.touched && meta.error ? (
                    <div className="error-text">{meta.error}</div>
                  ) : null}
                </React.Fragment>
              )}
            </Field>
          </div>
        );
      }

      break;
  }
};

export default CInput;
