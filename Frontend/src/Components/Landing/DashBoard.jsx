import React, { useEffect, useState } from "react";
import { Card, Row } from "react-bootstrap";
import LineChart from "../LineChart/LineChart";
import PieChart from "../LineChart/PieChart";
import DynamicTable from "../../assets/Custom/DynamicTable";
import DynamicList from "../../assets/Custom/DynamicList";
import { FaClipboardCheck, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  IoIosCheckmarkCircle,
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";
import { MdCancel } from "react-icons/md";
import Widget from "../../assets/Custom/Widget";

import CashIcon from "../../assets/Images/Widget/cash-svgrepo-com.svg";
import DeliveryIcon from "../../assets/Images/Widget/delivery-movement-svgrepo-com.svg";
import ManIcon from "../../assets/Images/Widget/man-svgrepo-com.svg";
import calendar from "../../assets/Images/Widget/calendar-svgrepo-com.svg";
import DeliveryBox from "../../assets/Images/Widget/box-svgrepo-com.svg";
import ExpanceIcon from "../../assets/Images/Widget/dollar-square-svgrepo-com.svg";
import moneyRecive from "../../assets/Images/Widget/money-recive-svgrepo-com.svg";

import CButton from "../../assets/Custom/CButton";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { OrdersArray, TodayStats } from "../../Store/Store";
import { openNotification, toCommaAndPKR } from "../../assets/Api/Api";
import { Modal, Tag } from "antd";
import { CiClock2, CiDollar } from "react-icons/ci";
import { HiMiniMinusCircle } from "react-icons/hi2";
import { BiSolidDollarCircle } from "react-icons/bi";
import SmartModal from "../../assets/Custom/SmartModal";
import OrderCompletionForm from "../From/OrderCompletionForm";

const DashBoard = () => {
  let Nav = useNavigate();
  const { confirm } = Modal;

  let [orderData, setOrdersArray] = useRecoilState(OrdersArray);
  let todayStats = useRecoilValue(TodayStats);

  let [flagState, setFlagState] = useState(false);
  let [modalObject, setModalObject] = useState({});

  let graph = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Line 1",
        data: [33, 59, 80, 81, 56],
        borderColor: "rgb(181, 194, 252)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Line 2",
        data: [48, 40, 55, 60, 70],
        borderColor: "rgb(78, 83, 111)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  // let BarGraphs = {
  //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //     datasets: [
  //         {
  //             label: 'Case',
  //             data: [100, 20, 40, 81, 56, 33, 72, 60, 45, 88, 55, 90],
  //             borderColor: '#3d4461',
  //             backgroundColor: '#59679c',
  //         }
  //     ],
  // }

  let [option, setOption] = useState("Poultry Farm");

  let [widgets, setWidgets] = useState([
    {
      Name: "Daily Sales",
      value: 1,
      symbol: "#",
      symbolLocation: "prefix",
      icon: calendar,
      version: 2,
      extra: "themeGreen",
    },
    {
      Name: "Daily Delivery",
      value: 11000,
      symbol: "Rs",
      symbolLocation: "prefix",
      icon: DeliveryBox,
      version: 2,
      extra: "themeOrange",
    },
    {
      Name: "Daily expense",
      value: 10,
      symbol: "Rs",
      symbolLocation: "prefix",
      icon: ExpanceIcon,
      version: 2,
      extra: "DefaultTheme",
    },
    {
      Name: "Total Sale",
      value: 23,
      symbol: "Rs",
      symbolLocation: "prefix",
      icon: moneyRecive,
      version: 2,
      extra: "DefaultTheme",
    },
  ]);

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
    { label: "Phone Number", attribute: "phoneNumber" },
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

  let TodaysAppointmentHandling = (Heading, row, action) => {
    console.log(Heading, row, action, "TodaysAppointmentHandling");
  };

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

  let CallBack = (elem) => {
    // alert(elem);
    setOption(elem);

    switch (elem) {
      case "Cash Sale":
        //Function to store Data for Walk-In-Customer
        break;
      case "Delivery":
        // Function to Open Delivery Details Module
        break;
      case "IKRAM":
        // Function to store 1 Bottle of IKRAM
        break;
      case "ISLAM":
        // Function to store 1 Bottle of ISLAM
        break;

      default:
        console.log("kuch Nahi chala");
        break;
    }
  };

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

  useEffect(() => {
    if (Object.keys(todayStats).length > 0) {
      setWidgets([
        {
          Name: "Daily Sales",
          value: todayStats.totalSalesToday,
          symbol: "#",
          symbolLocation: "prefix",
          icon: calendar,
          version: 2,
          extra: "themeGreen",
        },
        {
          Name: "Daily Delivery",
          value: toCommaAndPKR(todayStats.totalRevenueToday || 0),
          symbol: "Rs",
          symbolLocation: "prefix",
          icon: DeliveryBox,
          version: 2,
          extra: "themeOrange",
        },
        {
          Name: "Daily expense",
          value: toCommaAndPKR(todayStats.deliveryRevenueToday || 0),
          symbol: "Rs",
          symbolLocation: "prefix",
          icon: ExpanceIcon,
          version: 2,
          extra: "DefaultTheme",
        },
        {
          Name: "Total Sale",
          value: toCommaAndPKR(todayStats.totalExpensesToday || 0),
          symbol: "Rs",
          symbolLocation: "prefix",
          icon: moneyRecive,
          version: 2,
          extra: "DefaultTheme",
        },
      ]);
    }
  }, [todayStats]);

  return (
    <div className="container-fluid p-0">
      <SmartModal
        modalObject={modalObject}
        setFlagState={setFlagState}
        flagState={flagState}
      >
        <OrderCompletionForm />
      </SmartModal>

      <Row className="align-items-stretch mb-3">
        <div className="col-md-12">
          <Widget allWidget={widgets} setOption={CallBack} />
        </div>
      </Row>
      <Row className="align-items-stretch">
        <div className="col-md-8">
          <Card className={"shadow"}>
            <LineChart lineChartData={graph} />
          </Card>
        </div>
        {/* <div className="col-md-5">
          <Card className={"shadow"}>
            <PieChart lineChartData={BarGraphs} />
          </Card>
        </div> */}

        <div className="col-md-4">
          <Card className={"shadow p-3"} style={{ maxHeight: "80vh" }}>
            <h4 className="Head1 mb-4">Account Details</h4>
            <div className="table-responsive">
              <DynamicList
                skipUpTill={4}
                CallBack={TodaysAppointmentHandling}
                headings={headings}
                data={
                  Array.isArray(orderData)
                    ? orderData.filter(
                        (item) =>
                          !["complete", "debit", "cradit"].includes(item.status)
                      )
                    : []
                }
                listConcatenationArray={["houseNumber"]}
              />
            </div>
          </Card>
        </div>

        <div className="col-md-12 mt-3">
          <Card className={"shadow p-3"}>
            <div className="d-flex justify-content-between">
              <h4 className="Head1 mb-4">All Orders span</h4>

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
              data={
                Array.isArray(orderData) && orderData.length > 0
                  ? orderData
                  : []
              }
              pagination={true}
            />
          </Card>
        </div>
      </Row>
    </div>
  );
};

export default DashBoard;
