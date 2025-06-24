import React from "react";
import ReactApexChart from "react-apexcharts";

/**
 * CustomApexChart
 *
 * Props:
 * - series: Apex series data (required)
 * - categories: X-axis labels (optional)
 * - type: Chart type (area, line, bar, etc.) (default: 'area')
 * - height: Chart height (default: 300)
 * - showGrid: Boolean to toggle background grid (default: false)
 * - showToolbar: Boolean to show Apex toolbar (default: false)
 * - xAxisType: X-axis type ('category', 'datetime', 'numeric') (default: 'category')
 * - smoothCurve: Boolean to enable smooth stroke curve (default: true)
 */

const CustomApexChart = ({
  series = [],
  categories = [],
  type = "bar", // bar, area, radialBar, line, etc.
  height = 300,
  showGrid = false,
  showToolbar = false,
  xAxisType = "category",
  barBorderRadius = 0,
  showXAxis = true,
  showYAxis = true,
  showBarValues = false, // ✅ NEW: show data labels on bars if true
  colors = [], // ✅ NEW PROP
}) => {
  let options = {
    chart: {
      type,
      height,
      toolbar: {
        show: showToolbar,
      },
      animations: {
        enabled: true, // Default is true
        easing: "easeinout", // Available: linear, easein, easeout, easeinout
        speed: 800, // Duration in ms
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: colors.length ? colors : undefined, // ✅ Apply only if provided
    grid: {
      show: showGrid,
    },
    dataLabels: {
      enabled: type === "radialBar" || (type === "bar" && showBarValues),
    },
  };

  // Apply config based on chart type
  switch (type) {
    case "bar":
      options = {
        ...options,
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: barBorderRadius,
            columnWidth: "60%",
          },
        },
        stroke: {
          show: true,
          width: 2,
        },
        xaxis: {
          type: xAxisType,
          categories,
          labels: { show: showXAxis },
          axisBorder: { show: showXAxis },
          axisTicks: { show: showXAxis },
        },
        yaxis: {
          labels: { show: showYAxis },
          axisBorder: { show: showYAxis },
          axisTicks: { show: showYAxis },
        },
      };
      break;

    case "area":
      options = {
        ...options,
        stroke: {
          curve: "smooth",
          width: 2,
        },
        xaxis: {
          type: xAxisType,
          categories,
          labels: { show: showXAxis },
          axisBorder: { show: showXAxis },
          axisTicks: { show: showXAxis },
        },
        yaxis: {
          labels: { show: showYAxis },
          axisBorder: { show: showYAxis },
          axisTicks: { show: showYAxis },
        },
      };
      break;

    case "radialBar":
      options = {
        ...options,
        labels: categories,
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                show: true,
              },
              value: {
                show: true,
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
        },
      };
      break;

    case "line":
      options = {
        ...options,
        stroke: {
          curve: "straight",
          width: 2,
        },
        xaxis: {
          type: xAxisType,
          categories,
          labels: { show: showXAxis },
          axisBorder: { show: showXAxis },
          axisTicks: { show: showXAxis },
        },
        yaxis: {
          labels: { show: showYAxis },
          axisBorder: { show: showYAxis },
          axisTicks: { show: showYAxis },
        },
      };
      break;

    default:
      // fallback config
      options = {
        ...options,
        xaxis: {
          type: xAxisType,
          categories,
          labels: { show: showXAxis },
        },
        yaxis: {
          labels: { show: showYAxis },
        },
      };
  }

  return (
    <div className="custom-apex-chart">
      <ReactApexChart
        options={options}
        series={series}
        type={type}
        height={height}
      />
    </div>
  );
};

export default CustomApexChart;
