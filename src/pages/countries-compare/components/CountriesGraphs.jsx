import React from "react";

// import the core library.
import ReactECharts from "echarts-for-react";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";

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
} from "echarts/components";

const countryAttributeNames = {
  daily_vaccinations: "Vacunación diaria",
  daily_vaccinations_per_million: "Vacunación diaria por millón",
  people_fully_vaccinated: "Personas full vacunas",
  people_fully_vaccinated_per_hundred: "% Población Inmunizada",
  people_vaccinated: "Vacunadas",
  people_vaccinated_per_hundred: "% Población vacunada",
  total_dose_vaccinations: "Total de dosis aplicadas",
  vaccine_type: "Tipo de vacuna",
};

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
      text: countryAttributeNames[optionSelected],
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
};

export default CountriesGraphs;
