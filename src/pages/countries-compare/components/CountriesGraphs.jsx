import React from "react";
import Chart from "react-apexcharts";

// import the core library.
import ReactECharts from "echarts-for-react";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";

import { LineChart } from "echarts/charts";
import {
  // GridSimpleComponent,
  GridComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  // ToolboxComponent,
  TooltipComponent,
  // AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  // MarkAreaComponent,
  // LegendComponent,
  // LegendScrollComponent,
  // LegendPlainComponent,
  // DataZoomComponent,
  // DataZoomInsideComponent,
  // DataZoomSliderComponent,
  // VisualMapComponent,
  // VisualMapContinuousComponent,
  // VisualMapPiecewiseComponent,
  // AriaComponent,
  // TransformComponent,
  DatasetComponent,
} from "echarts/components";

const getGraphObj = (countriesData, optionSelected) => {
  let dates = countriesData[0]["data"].map((dataPoint) => dataPoint["date"]);

  const countriesNames = countriesData.map((country) => country.name);

  const countriesSeriesData = countriesData.map((countryData) => {
    return {
      name: countryData.name,
      smooth: true,
      lineStyle: {
        width: 2,
      },
      type: "line",
      data: countryData.data.map((data) => data[optionSelected]),
    };
  });

  return {
    title: {
      text: "Vacunacion Diaria - Hardcode",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: countriesNames,
    },

    toolbox: {
      feature: {
        magicType: { show: true, type: ["stack", "tiled"] },
        saveAsImage: {},
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: dates,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: countriesSeriesData,
  };
};

// Register the required components
echarts.use([TitleComponent, TooltipComponent, GridComponent]);

const CountriesGraphs = (props) => {
  let grapOptions = getGraphObj(props.countriesData, props.optionsSelectedData);

  return <ReactECharts option={grapOptions} style={{ height: 400 }} />;
  let selectedCountriesData = props.countriesData;
  let series = selectedCountriesData.map((country) => {
    const countryData = country["data"].map(
      (dataPoint) => dataPoint[props.optionsSelectedData] || 0
    );

    return {
      name: country.name,
      data: countryData,
    };
  });
  return (
    <div className="mixed-chart" key={props.graphType}>
      <Chart options={grapOptions} series={series} type={props.graphType} />
    </div>
  );
};

export default CountriesGraphs;
