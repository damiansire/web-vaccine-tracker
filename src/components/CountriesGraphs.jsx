import React from "react";
import Chart from "react-apexcharts";

const getGraphObj = (countriesData) => {
  debugger;
  let dates = countriesData[0]["data"].map((dataPoint) => dataPoint["date"]);
  return {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: dates,
      },
    },
  };
};

const CountriesGraphs = (props) => {
  let grapOptions = getGraphObj(props.countriesData);

  let selectedCountriesData = props.countriesData;

  let series = selectedCountriesData.map((country) => {
    const countryData = country["data"].map(
      (dataPoint) => dataPoint[props.optionsSelectedData] || 0
    );

    return {
      name: country.countryName,
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
