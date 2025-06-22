import React from "react";
import CButton from "../Custom/CButton";
import FormComponent from "../Custom/FormComponent";
import DynamicTable from "../Custom/DynamicTable";
import FormTable from "../Custom/FormTable";

const DynamicComp = {
    "listOfItems": [
        {
            component: <CButton />, // Directly using JSX, no function
            Title: "Button 1",
            subDescription: "Simple button",
            textLog: `let {styles, extra, callBackFunction, 
            text,type}=props
//Types can be {"primary","dashed","text","link"}
//Types can be {"dashed","filled","text","link"}
            <Button
              style={styles} 
              className={extra} 
              onClick={() => { callBackFunction() }}
            > 
                {text}
            </Button>`,
            route: "/Button",
            Props: {
                style: {},
                extra: "",
                callBackFunction: () => { alert("button Clicked") },
                text: "button",
            }
        },
        {
            component: <CButton />, // Wrap in a function
            Title: "Button 2",
            subDescription: "Buttons solid",
            textLog: `
        let {styles,extra,callBackFunction,text,type}=props
            
            <Button
              style={styles} 
              className={extra} 
              onClick={() => { callBackFunction() }}
            > 
                {text}
            </Button>`,
            route: "/ButtonSolid",
            Props: {
                style: {},
                extra: "",
                callBackFunction: () => { alert("button Clicked") },
                text: "button",
                type: "primary",
                variant: "text",
            }

        },
        {
            component: <FormComponent />,
            Title: "From",
            subDescription: "Form has all types of inputs init ",
            textLog: `
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

            <Col md={6} className="pt-4">
              <div role="group" aria-labelledby="radio-group-label">
                <span id="radio-group-label" className="form-label">Select an option</span>
                <CInput className="form-check-input me-3" name="radioInput" label="Radio Option 1" type="radio" id="option1" value="option1" />
                <CInput className="form-check-input me-3" name="radioInput" label="Radio Option 2" type="radio" id="option2" value="option2" />
              </div>
            </Col>


            <Col md={6} className="pt-4">
              <CInput className={"form-check-input me-3"} name="inputCheck" label="Check the Check Box" type="checkBox" />
            </Col>`,
            route: "/Form",
            Props: {
                style: {},
                extra: "",
                callBackFunction: () => { alert("button Clicked") },
                text: "button",
                type: "primary",
                variant: "text",
            }
        },
        {
            component: <DynamicTable />,
            Title: "Table",
            subDescription: "Table to show data only ",
            textLog: `
 let  headings: [
     { label: "Name", attribute: "name" },
     { label: "Age", attribute: "age" },
     { label: "Email", attribute: "email" },
        ],
 let data: [
     { name: "John Doe", age: 28, email: "john@example.com" },
     { name: "Jane Smith", age: 32, email: "jane@example.com" },
     { name: "Mike Johnson", age: 45, email: "mike@example.com" },
        ]

    <DynamicTable headings={headings} data={data} />
            `,
            route: "/Table",
            Props: {
                headings: [
                    { label: "Name", attribute: "name" },
                    { label: "Age", attribute: "age" },
                    { label: "Email", attribute: "email" },
                ],
                data: [
                    { name: "John Doe", age: 28, email: "john@example.com" },
                    { name: "Jane Smith", age: 32, email: "jane@example.com" },
                    { name: "Mike Johnson", age: 45, email: "mike@example.com" },
                ]
            }
        },
        {
            component: <FormTable />,
            Title: "Table From",
            subDescription: "Table becomes Form",
            textLog: `
 let  headings: [
     { label: "Name", attribute: "name" },
     { label: "Age", attribute: "age" },
     { label: "Email", attribute: "email" },
        ],
 let data: [
     { name: "John Doe", age: 28, email: "john@example.com" },
     { name: "Jane Smith", age: 32, email: "jane@example.com" },
     { name: "Mike Johnson", age: 45, email: "mike@example.com" },
        ]

     <DynamicTableFields
        headings={headings}
        data={data}
        onChange={handleInputChange} // Pass the change handler
        />
            `,
            route: "/TableFrom",
            Props: {
                headings: [
                    { label: "Name", attribute: "name" },
                    { label: "Age", attribute: "age" },
                    { label: "Email", attribute: "email" },
                ],
                data: [
                    { name: "John Doe", age: 28, email: "john@example.com" },
                    { name: "Jane Smith", age: 32, email: "jane@example.com" },
                    { name: "Mike Johnson", age: 45, email: "mike@example.com" },
                ]
            }
        },
    ]
}


export default DynamicComp;