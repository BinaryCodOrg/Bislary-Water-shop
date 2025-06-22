// New Ant Design-based Modal Component
import React, { useEffect, useRef } from "react";
import { Modal, Button as AntButton } from "antd";
import { scroller, Element } from "react-scroll";

const SmartModal = ({
  modalObject = {},
  flagState = false,
  setFlagState = () => {},
  children,
}) => {
  const formRef = useRef(null);

  // Scroll to top of modal when opened
  useEffect(() => {
    if (flagState) {
      scroller.scrollTo("modal-top", {
        duration: 500,
        delay: 0,
        smooth: "easeInOutQuart",
        containerId: "smart-modal-container",
      });
    }
  }, [flagState]);

  const handleSubmit = () => {
    if (formRef.current?.handleSubmit) {
      formRef.current.handleSubmit();
    }
  };

  const sizeMap = {
    small: 520,
    default: 700,
    large: 920,
    xxl: 1080,
  };

  const size =
    modalObject.size == "small"
      ? sizeMap.small
      : modalObject.size === "xxl"
      ? sizeMap.xxl
      : modalObject.size === "large"
      ? sizeMap.large
      : sizeMap.default;

  return (
    <Modal
      title={
        <div className="Head2 fw-light" style={{ fontSize: "20px" }}>
          {modalObject.title || "Modal"}
        </div>
      }
      open={flagState}
      onCancel={() => setFlagState(false)}
      onOk={handleSubmit}
      okText="Submit"
      cancelText="Close"
      centered
      width={size}
      destroyOnClose
    >
      <Element id="smart-modal-container" name="modal-top" />

      {children
        ? React.cloneElement(children, {
            formRef,
            modalObject,
            setFlagState,
          })
        : "No content provided."}
    </Modal>
  );
};

export default SmartModal;
