import React from "react";
import { Table } from "antd";
import { createStyles } from "antd-style";
import DropDownOptions from "./DropDownOptions/DropDownOptions";

const useStyle = createStyles(({ css, token }) => ({
    customTable: css`
    .ant-table-body {
      scrollbar-width: thin;
      scrollbar-color: #eaeaea transparent;
    }
    .ant-table-thead > tr > th {
      background-color: ${token.colorBgContainer};
      position: sticky;
      top: 0;
      z-index: 2;
    }
  `,
}));

const DynamicAntTable = ({ headings, data, CallBack, menuItems }) => {
    const { styles } = useStyle();

    // Map headings to Ant Design columns
    const columns = headings.map((heading) => {
        if (heading.attribute === "StaticString") {
            return {
                title: heading.label,
                key: heading.attribute,
                // render: () => (
                //     <span
                //         className={heading.extraClasses || ""}
                //         style={heading.styleSet || {}}
                //     >
                //         {heading.Text}
                //     </span>
                // ),
                ellipsis: {
                    showTitle: true,
                },
                className: "fw-bold",
            };
        }

        if (heading.attribute === "Operations" || heading.attribute === "operations") {
            return {
                title: heading.label,
                key: heading.attribute,
                render: (_, row) => (
                    <DropDownOptions
                        menuItems={menuItems}
                        CallBack={CallBack}
                        heading={heading}
                        row={row}
                    />
                ),
                ellipsis: {
                    showTitle: true,
                },
                className: heading.extraClasses || "",
            };
        }

        return {
            title: heading.label,
            dataIndex: heading.attribute,
            key: heading.attribute,
            className: heading.extraClasses || "",
            style: heading.styleSet || {},
            ellipsis: {
                showTitle: false,
            },
        };
    });

    return (
        <Table
            className={styles.customTable}
            columns={columns}
            dataSource={data.map((item, index) => ({ ...item, key: index }))}
            scroll={{
                x: "max-content",
                y: "100%", // Adjust height as needed
            }}
            pagination={false} // Disable pagination if unnecessary
            bordered
        />
    );
};

export default DynamicAntTable;
