import React from "react";
import { List, Dropdown, Menu, Typography, Space } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

const DynamicList = ({ headings, data, CallBack, listConcatenationArray }) => {
    // Function to concatenate values from listConcatenationArray
    const concatenateAttributes = (item, keys) => {
        return keys
            .map((key) => (item[key] ? item[key] : ""))
            .filter((value) => value) // Remove any empty values
            .join(", ");
    };

    // Function to render the dropdown for operations
    const renderDropdown = (heading, row) => {

        let Options =  heading.options || [];

        const menu = (
            <Menu>
                {Options.map((option, index) => (
                    <Menu.Item
                        key={index}
                        onClick={() => CallBack(option.action, row)}
                        style={option.style || {}}
                        icon={option.icon || ""}
                    >
                        {option.label}
                    </Menu.Item>
                ))}
            </Menu>
        );

        return (
            <Dropdown overlay={menu} trigger={["click"]}>
                <MoreOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
            </Dropdown>
        );
    };

    return (
        <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        {/* Render the concatenated row */}
                        <Text style={{ fontWeight: "bold" }}>
                            {concatenateAttributes(item, listConcatenationArray)}
                            <span className="float-end">
                                {headings
                                    .filter((heading) => heading.attribute === "Operations")
                                    .map((heading, index) => (
                                        <div key={index}>{renderDropdown(heading, item)}</div>
                                    ))}
                            </span>
                        </Text>

                        {/* Render the operations menu */}

                    </Space>
                </List.Item>
            )}
        />
    );
};

export default DynamicList;
