import React, { useState } from "react";
import Select from "react-select/creatable";

const CreatableMultiSelectField = ({
  options,
  field,
  form,
  disabled,
  onChange,
}) => {
  const handleChange = (selectedOptions) => {
    form.setFieldValue(
      field.name,
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );

    if (onChange) {
      let obj = {
        target: {
          name: field.name,
          value: selectedOptions,
        },
      };
      onChange(obj);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid #3d4461" : "1px solid #3d4461",
      boxShadow: state.isFocused ? "0 0 0 0px #3d4461" : "none",
      "&:hover": {
        border: state.isFocused ? "1px solid #08a9d1" : "1px solid #3d4461",
      },
      backgroundColor: disabled ? "#f0f0f0" : "white", // Change background when disabled
      pointerEvents: disabled ? "none" : "auto", // Disable interaction
      minHeight: "42px", // Set the minimum height
      height: field.value && field.value.length > 0 ? "auto" : "42px", // Set the height
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: field.value && field.value.length > 0 ? "auto" : "42px", // Ensure value container matches the control height
      // padding: '0 8px' // Adjust padding as needed
    }),
    input: (provided) => ({
      ...provided,
      margin: "0", // Ensure input has no margin
      padding: "0", // Ensure input has no padding
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "44px", // Ensure indicators container matches the control height
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure the menu is on top of other elements
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure the menu portal is on top of other elements
    }),
  };

  return (
    <Select
      isMulti
      name={field.name}
      className=""
      value={
        options
          ? options.filter((option) =>
              Array.isArray(field.value)
                ? field.value.includes(option.value)
                : false
            )
          : []
      }
      onChange={handleChange}
      options={options}
      styles={customStyles}
      menuPortalTarget={document.body}
      isDisabled={disabled}
    />
  );
};

const createOption = (label) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ""),
});

const defaultOptions = [
  { value: "ESS Super ", label: "ESS Super " },
  { value: "PSS ", label: "PSS " },
  { value: "CSC", label: "CSC" },
  { value: "Uni Super ", label: "Uni Super " },
  { value: "Telstra ", label: "Telstra " },
  { value: "Other", label: "Other" },
];

const CreatableSelectField = ({
  field,
  form,
  disabled,
  options,
  onChangeCallback,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [CustomOptions, setOptions] = useState(options || defaultOptions);
  const [value, setValue] = useState(null);

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
      form.setFieldValue(field.name, newOption.value);
    }, 1000);
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "2px solid #3d4461" : "1px solid #3d4461",
      boxShadow: state.isFocused ? "0 0 0 0px #08a9d1" : "none",
      "&:hover": {
        border: state.isFocused ? "2px solid #3d4461" : "1px solid #3d4461",
      },
      backgroundColor: disabled ? "#f0f0f0" : "white", // Change background when disabled
      pointerEvents: disabled ? "none" : "auto", // Disable interaction
      minHeight: "42px", // Set the minimum height
      height: "42px", // Allow height to adjust based on content
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: field.value && field.value.length > 0 ? "auto" : "44px", // Adjust height based on selection
      padding: "0 8px", // Adjust padding as needed
    }),
    input: (provided) => ({
      ...provided,
      margin: "0", // Ensure input has no margin
      padding: "0", // Ensure input has no padding
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "42px", // Ensure indicators container matches the control height
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure the menu is on top of other elements
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999, // Ensure the menu portal is on top of other elements
    }),
  };
  return (
    <Select
      isClearable
      isDisabled={isLoading ? isLoading : disabled}
      isLoading={isLoading}
      onChange={(newValue) => {
        setValue(newValue);
        form.setFieldValue(field.name, newValue ? newValue.value : null);
        // console.log(newValue ? newValue.value : null, onChangeCallback);
        if (onChangeCallback) {
          onChangeCallback(newValue ? newValue.value : null);
        }
      }}
      onCreateOption={handleCreate}
      options={CustomOptions}
      value={
        CustomOptions
          ? CustomOptions.find((option) => option.value === field.value)
          : null
      }
      styles={customStyles}
      menuPortalTarget={document.body}
    />
  );
};

const SimpleSelectField = ({ options, field, form, onChange }) => {
  const handleChange = (selectedOption) => {
    // Update form value
    form.setFieldValue(field.name, selectedOption ? selectedOption.value : "");

    // Run custom onChange if provided
    if (onChange) {
      onChange(selectedOption);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "1px solid #3d4461" : "1px solid #3d4461",
      boxShadow: state.isFocused ? "0 0 0 0px #3d4461" : "none",
      "&:hover": {
        border: state.isFocused ? "1px solid #08a9d1" : "1px solid #3d4461",
      },
      minHeight: "42px",
      height: "42px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "42px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "44px",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <Select
      name={field.name}
      value={
        options
          ? options.find((option) => option.value === field.value) || null
          : null
      }
      onChange={handleChange}
      options={options}
      styles={customStyles}
      menuPortalTarget={document.body}
      isClearable
    />
  );
};

export { CreatableMultiSelectField, CreatableSelectField, SimpleSelectField };
