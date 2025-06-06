import { Dropdown, Menu } from "antd";
import React from "react";
import { FaGear } from "react-icons/fa6";

const DropDownOptions = ({ row, heading, CallBack, menuItems }) => {
  const options = menuItems || heading.options || [];

  const menu = (
    <Menu className="ClearDropDownSpan">
      {options.map((option, index) => (
        <Menu.Item
          key={index}
          onClick={() => CallBack(option.label, row, option.action)}
          icon={option.icon}
          style={option.style}
          className={option.danger ? "custom-danger-option" : ""}
        >
          {option.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} trigger={["click"]}>
        <FaGear style={{ cursor: "pointer" }} />
      </Dropdown>
    </div>
  );
};

export default DropDownOptions;
