import React, { useState } from "react";
import { Button, ConfigProvider, Menu } from "antd";
import {
  MdMailOutline,
  MdOutlineAccountBalanceWallet,
  MdOutlineControlCamera,
  MdOutlineDesktopWindows,
  MdPieChartOutlined,
} from "react-icons/md";
import {
  RiAccountPinCircleFill,
  RiAppsLine,
  RiMenu2Fill,
  RiMenuFill,
  RiReceiptLine,
} from "react-icons/ri";
import AdviserS1 from "../../assets/Images/logos/2-removebg-preview.png";
import AdviserSmini from "../../assets/Images/logos/1-removebg-preview.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { PiHandCoinsFill } from "react-icons/pi";
import { GoPackageDependencies } from "react-icons/go";

const { SubMenu } = Menu;

const AdminSideBar = (props) => {
  const sidebarWidth = props.collapsed ? "80px" : "250px"; // Change these values as needed

  let Nav = useNavigate();

  let location = useLocation();

  return (
    <div
      className="AdminSideBar"
      style={{
        width: sidebarWidth, // Apply dynamic width based on collapsed state
        transition: "width 0.3s", // Smooth transition for width change
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedColor: "#3d4461",
              itemSelectedBg: "#e9ebf5",
            },
          },
        }}
      >
        <Menu
          mode="inline"
          inlineCollapsed={props.collapsed}
          style={{
            minHeight: "100vh",
          }}
          selectedKeys={[location.pathname]}
        >
          {/* Custom Option 1 */}
          <Menu.Item
            disabled
            className="customeSideHead"
            key="1"
            style={{ height: "5rem" }}
            title={props.collapsed ? "Logo" : null} // Disable tooltip when not collapsed
          >
            {props.collapsed ? (
              <div
                className="mt-3"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  props.setCollapsed(!props.collapsed);
                }}
              >
                <h5 role="button" className="">
                  <img src={AdviserSmini} alt="Logo" width={"50px"} />
                </h5>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => {
                  props.setCollapsed(!props.collapsed);
                }}
              >
                <h5 role="button">
                  <img src={AdviserS1} alt="Logo" width={"170px"} />
                </h5>
              </div>
            )}
          </Menu.Item>

          <Menu.Item
            onClick={() => {
              props.setReload(!props.reload);
              Nav("/");
            }}
            key="/"
            icon={<MdOutlineDesktopWindows />}
          >
            Dashboard
          </Menu.Item>

          <Menu.Item
            key="/AllOrders"
            onClick={() => {
              Nav("/AllOrders");
            }}
            icon={<GoPackageDependencies />}
          >
            All Orders
          </Menu.Item>

          <Menu.Item
            key="/Accounts"
            onClick={() => {
              Nav("/Accounts");
            }}
            icon={<MdOutlineAccountBalanceWallet />}
          >
            Accounts
          </Menu.Item>

          <SubMenu key="sub1" icon={<FaMoneyBillTransfer />} title="Sale">
            <Menu.Item
              key="/DeliveryBoys"
              icon={<TbTruckDelivery />}
              onClick={() => {
                Nav("/DeliveryBoys");
              }}
            >
              Delivery Boys
            </Menu.Item>
            <Menu.Item
              key="/Expanses"
              icon={<RiReceiptLine />}
              onClick={() => {
                Nav("/Expanses");
              }}
            >
              Expanses
            </Menu.Item>
          </SubMenu>
          {/*
                        <SubMenu key="sub2" icon={<RiAppsLine />} title="Sales Record">
                        <Menu.Item key="9" onClick={() => { Nav("/Canceled Appointments") }}>Canceled Appointments</Menu.Item>
                        <Menu.Item key="10" onClick={() => { Nav("/Rescheduled Appointments") }}>Rescheduled Appointments</Menu.Item>
                        <SubMenu className='subSubMenu' key="sub3" title="Patients Review">
                        <Menu.Item key="11" onClick={() => { Nav("/Recent") }}>Recent</Menu.Item>
                        <Menu.Item key="12" onClick={() => { Nav("/All") }}>All</Menu.Item>
                        </SubMenu>
                        </SubMenu>
                        */}
        </Menu>
      </ConfigProvider>
    </div>
  );
};

export default AdminSideBar;
