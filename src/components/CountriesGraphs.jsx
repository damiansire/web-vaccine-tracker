import React from "react";
import Chart from "react-apexcharts";

const CountriesGraphs = (props) => {
  console.log(props);
  return (
    <div className="mixed-chart" key={props.graphType}>
      <Chart
        options={props.options}
        series={props.series}
        type={props.graphType}
        width="1000"
      />
    </div>
  );
};

export default CountriesGraphs;
