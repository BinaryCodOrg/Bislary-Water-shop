import React, { useState } from "react";
import { Card } from "react-bootstrap";
import CButton from "../../assets/Custom/CButton";
import DynamicTable from "../../assets/Custom/DynamicTable";
import { useNavigate } from "react-router-dom";
import { openNotification, toCommaAndPKR } from "../../assets/Api/Api";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  IoIosCheckmarkCircle,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { OrdersArray } from "../../Store/Store";
import { useRecoilState } from "recoil";
import { CiClock2 } from "react-icons/ci";
import { HiMiniMinusCircle } from "react-icons/hi2";
import { BiSolidDollarCircle } from "react-icons/bi";
import { Modal, Tag } from "antd";
import { FaClipboardCheck } from "react-icons/fa6";
import SmartModal from "../../assets/Custom/SmartModal";
import OrderCompletionForm from "../From/OrderCompletionForm";

const OrdersData = () => {
  let Nav = useNavigate();
  const { confirm } = Modal;

  let [flagState, setFlagState] = useState(false);
  let [modalObject, setModalObject] = useState({});

  let [orderData, setOrdersArray] = useRecoilState(OrdersArray);

  let NewAppointmentHandling = async (Heading, row, action) => {
    // console.log(Heading, row, action, "NewAppointmentHandling");
    switch (action) {
      case "Edit":
      case "edit":
        // Function to handle edit action
        // console.log("Editing Order:", row);

        if (row.status === "pending") {
          Nav("/orders#Edit", { state: row });
        } else {
          openNotification(
            "warning",
            "topRight",
            "Status Error",
            "Only pending orders can be Edited."
          );
        }

        break;
      case "MarkDone":
      case "markDone":
        if (row.status === "pending") {
          // Function to handle marking order as done
          // console.log("Marking order as done:", row);
          setModalObject({
            title: "Order Completion",
            size: "small",
            row,
            type: "markDone",
          });
          setFlagState(true);
          // changeStatus(row, "Complete");
        } else {
          openNotification(
            "warning",
            "topRight",
            "Status Error",
            "Only pending orders can be completed."
          );
        }
        break;
      case "Cancel":
      case "cancel":
        // Function to handle cancel action
        // console.log("Cancelling Order:", row);
        if (row.status === "pending") {
          changeStatus(row, "Canceled");
        } else {
          openNotification(
            "warning",
            "topRight",
            "Status Error",
            "Only pending orders can be cancelled."
          );
        }
        break;
      case "Delete":
      case "delete":
        // Function to handle delete action
        // console.log("Deleting Order:", row);

        deleteFunction(row.id);

        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  let headings = [
    { label: "No#", attribute: "index" },
    {
      label: "Date",
      attribute: "createdAt",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
    },
    { label: "House Number", attribute: "houseNumber" },
    {
      label: "Phone Number",
      attribute: "phoneNumber",
      render: (row) => row.phoneNumber || "--",
    },
    {
      label: "Time",
      attribute: "createdAt",
      render: (row) =>
        new Date(row.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC",
        }),
    },
    {
      label: "Total",
      attribute: "total_amount",
      render: (row) => toCommaAndPKR(parseFloat(row.total_amount)),
    },
    {
      label: "Status",
      attribute: "status",
      render: (row) => {
        const status = row.status?.toLowerCase();

        const statusMap = {
          pending: { color: "orange", text: "Pending", icon: <CiClock2 /> },
          complete: {
            color: "green",
            text: "Complete",
            icon: <IoIosCheckmarkCircleOutline />,
          },
          canceled: {
            color: "red",
            text: "Canceled",
            icon: <MdCancel />,
          },
          debit: {
            color: "geekblue",
            text: "Debited",
            icon: <HiMiniMinusCircle />,
          },
          credit: {
            color: "cyan",
            text: "Credited",
            icon: <BiSolidDollarCircle />,
          },
        };

        const tag = statusMap[status] || { color: "default", text: status };

        return (
          <Tag
            color={tag.color}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
            }}
          >
            {tag.icon} {tag.text}
          </Tag>
        );
      },
    },
    {
      label: "Operations",
      attribute: "Operations",
      options: [
        {
          action: "edit",
          label: "Edit",
          icon: <FaEdit />,
        },
        {
          action: "update",
          label: "Update",
          icon: <FaClipboardCheck />,
        },
      ],
    },
  ];

  const menuItems = [
    {
      action: "edit",
      label: "Edit",
      icon: <FaEdit />,
      onClick: (heading, row) => CallBack(heading, row, "Edit"),
    },
    {
      action: "markDone",
      label: "Mark Done",
      icon: <IoIosCheckmarkCircle />,
      onClick: (heading, row) => CallBack(heading, row, "MarkDone"),
    },
    {
      action: "cancel",
      label: "Cancel",
      danger: true,
      icon: <MdCancel />,
      onClick: (heading, row) => CallBack(heading, row, "Cancel"),
    },
    {
      action: "delete",
      label: "Delete",
      danger: true,
      icon: <FaTrashAlt />,
      onClick: (heading, row) => CallBack(heading, row, "Delete"),
    },
  ];

  const deleteFunction = (id) => {
    confirm({
      title: "Are you sure you want to delete this order?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        const result = await window.api.deleteOrder(id);
        if (result.success) {
          setOrdersArray((prev) => prev.filter((order) => order.id !== id));
          openNotification(
            "success",
            "topRight",
            "Delete Successful",
            "Order deleted successfully."
          );
        } else {
          openNotification(
            "error",
            "topRight",
            "Delete Failed",
            result.error || "An error occurred while deleting the order."
          );
          console.error(result.error);
        }
      },
    });
  };

  const changeStatus = async (row, status) => {
    try {
      const result = await window.api.updateOrderStatus(row.id, status);
      if (result.success) {
        setOrdersArray((prev) =>
          prev.map((order) =>
            order.id === row.id ? { ...order, status } : order
          )
        );
        openNotification(
          "success",
          "topRight",
          "Status Changed",
          "New status of order from house: " + row.houseNumber + " is " + status
        );
      }
    } catch (error) {
      openNotification(
        "error",
        "topRight",
        "Status not Changed",
        "Some thing went wrrong Please try later"
      );
    }
  };

  return (
    <Card className={"shadow p-3"}>
      <SmartModal
        modalObject={modalObject}
        setFlagState={setFlagState}
        flagState={flagState}
      >
        <OrderCompletionForm />
      </SmartModal>

      <div className="d-flex justify-content-between">
        <h4 className="Head2 mb-4">All Orders</h4>

        <CButton
          text="Add Order"
          onClick={() => {
            Nav("/orders");
          }}
        />
      </div>

      <DynamicTable
        type="antd"
        CallBack={NewAppointmentHandling}
        menuItems={menuItems}
        headings={headings}
        data={Array.isArray(orderData) && orderData.length > 0 ? orderData : []}
        pagination={true}
      />
    </Card>
  );
};

export default OrdersData;
