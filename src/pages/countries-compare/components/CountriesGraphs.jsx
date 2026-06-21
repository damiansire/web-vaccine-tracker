import React from "react";

// import the core library.
import ReactECharts from "echarts-for-react";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";

import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
} from "echarts/components";

import { getGraphObj } from "./graphData";

// Register the required components
echarts.use([TitleComponent, TooltipComponent, GridComponent]);

const CountriesGraphs = (props) => {
  let grapOptions = getGraphObj(props.countriesData, props.optionsSelectedData);

  return <ReactECharts option={grapOptions} style={{ height: 400 }} />;
};

export default CountriesGraphs;
