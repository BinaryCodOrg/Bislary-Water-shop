import { Button } from "antd";
import React from "react";

const CButton = ({
  text,
  style = {},
  className = "",
  onClick,
  type = "default", // AntD visual style
  htmlType = "button", // Native HTML button behavior
  ...restProps
}) => {
  return (
    <Button
      type={type}
      htmlType={htmlType}
      style={style}
      className={className}
      onClick={onClick}
      {...restProps}
    >
      {text}
    </Button>
  );
};

export default CButton;
