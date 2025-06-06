import React from "react";
import { Table as BootstrapTable } from "react-bootstrap";
import { Table as AntdTable } from "antd";
import DropDownOptions from "./DropDownOptions/DropDownOptions";

const DynamicTable = ({
  headings = [],
  data = [],
  CallBack,
  menuItems,
  type = "bootstrap", // 'antd' or 'bootstrap'
  pagination = false,
}) => {
  // Shared render function
  const getCellContent = (heading, item, index) => {
    const { attribute, render, Text } = heading;

    if (attribute === "StaticString") return Text;
    if (attribute === "index") return index + 1;
    if (attribute.toLowerCase() === "operations") {
      return (
        <DropDownOptions
          menuItems={menuItems}
          CallBack={CallBack}
          heading={heading}
          row={item}
        />
      );
    }
    if (typeof render === "function") return render(item, index);
    return item[attribute] ?? "--";
  };

  // Ant Design Column Format
  const antdColumns = headings.map((heading, hIndex) => {
    const { label, attribute, render } = heading;

    if (attribute === "StaticString") {
      return {
        title: label,
        key: `static-${hIndex}`,
        render: () => heading.Text,
      };
    }

    if (attribute === "index") {
      return {
        title: label,
        key: "index",
        render: (_, __, index) => index + 1,
      };
    }
    if (attribute.toLowerCase() === "operations") {
      return {
        title: label,
        key: "operations",
        render: (_, record, index) => (
          <DropDownOptions
            menuItems={menuItems}
            CallBack={CallBack}
            heading={heading}
            row={record} // ✅ Proper row data
          />
        ),
      };
    }

    return {
      title: label,
      dataIndex: attribute,
      key: attribute,
      render: render
        ? (text, row, index) => render(row, index, text)
        : (text) => text ?? "--",
    };
  });

  // ✅ Render either Bootstrap or AntD version
  if (type === "antd") {
    return (
      <AntdTable
        className="custom-ant-table"
        columns={antdColumns}
        dataSource={data}
        rowKey={(record) => record.id || record._id || JSON.stringify(record)} // use a unique key
        pagination={pagination}
        size="small"
      />
    );
  }

  // ✅ Bootstrap fallback/default version
  return (
    <div className="table-container border-0">
      <BootstrapTable striped bordered hover responsive>
        <thead>
          <tr>
            {headings.map((heading, index) => (
              <th key={index} className="overflow-box">
                {heading.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                {headings.map((heading, hIndex) => {
                  const content = getCellContent(heading, item, index);
                  return (
                    <td
                      key={hIndex}
                      className={heading.extraClasses || ""}
                      style={heading.styleSet || {}}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headings.length} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </BootstrapTable>
    </div>
  );
};

export default DynamicTable;
