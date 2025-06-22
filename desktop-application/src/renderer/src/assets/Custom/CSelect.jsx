import React from 'react'

const CSelect = ({ label, options, ...props }) => {
    return (
        <div className="input-wrapper">
            {label && <label htmlFor={props.id || props.name}>{label}</label>}
            <select {...props} className="form-control">
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CSelect
