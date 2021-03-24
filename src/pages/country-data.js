import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import getVaccineApiEndpointForCountry from "../endpoint";
import Button from "@material-ui/core/Button";

import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

const CountryData = () => {
  const [loadCountryData, setLoadCountryData] = useState(false);
  const [state, setState] = useState({});
  const [graphType, setGraphType] = useState("line");
  const [selectedCountries, setSelectedCountries] = useState("Argentina");

  const allCountries = [
    { countryId: "Uruguay" },
    { countryId: "Argentina" },
    { countryId: "Chile" },
    { countryId: "Bolivia" },
    { countryId: "Colombia" },
    { countryId: "Venezuela" },
  ];
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const getCountryData = (countryId) => {
    fetch(getVaccineApiEndpointForCountry(countryId))
      .then((response) => response.json())
      .then((data) => {
        let countryDate = data["vaccine"].map((datapoint) => datapoint["date"]);
        let vaccineCountry = data["vaccine"].map(
          (datapoint) => datapoint["total_vaccines"]
        );
        let newData = {
          options: {
            chart: {
              id: "basic-bar",
            },
            xaxis: {
              categories: countryDate,
            },
          },
          series: [
            {
              name: countryId,
              data: vaccineCountry,
            },
          ],
        };
        setState(newData);
        setLoadCountryData(true);
      });
  };

  useEffect(() => {
    getCountryData(selectedCountries);
  }, [selectedCountries]);

  return (
    <div className="app">
      {loadCountryData && (
        <>
          <div className="row">
            <Button
              variant="outlined"
              size="large"
              color="primary"
              onClick={() => {
                setGraphType("line");
              }}
            >
              Graficos de Lineas
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="primary"
              onClick={() => {
                setGraphType("bar");
              }}
            >
              Graficos de Barra
            </Button>
            <Autocomplete
              onChange={(event, newInputValue) => {
                console.log(newInputValue[0]["countryId"]);
                setSelectedCountries(newInputValue[0]["countryId"]);
              }}
              multiple
              id="checkboxes-tags-demo"
              options={allCountries}
              disableCloseOnSelect
              getOptionLabel={(option) => option.countryId}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.countryId}
                </React.Fragment>
              )}
              style={{ width: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Checkboxes"
                  placeholder="Favorites"
                />
              )}
            />
          </div>
          <div className="row">
            {graphType === "bar" && (
              <div className="mixed-chart">
                <Chart
                  options={state.options}
                  series={state.series}
                  type={graphType}
                  width="1000"
                />
              </div>
            )}
            {graphType === "line" && (
              <div className="mixed-chart">
                <Chart
                  options={state.options}
                  series={state.series}
                  type={graphType}
                  width="1000"
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CountryData;
