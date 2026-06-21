import React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { buildTableRows } from "./tableData";

const CountriesTable = (props) => {
  /*
  props.options.xaxis.categories; // [acafechas]
  series; // [ { name : "Uruguay", data : [1,2,3,4,5,6,7,8,9    ] }]
  ////"Uruguay", "Argentina", "Bolivia"
  //{Date: Uruguay : 123, Argentina : 312, Bolivia : 147}
*/

  const getCountryTableHeader = (countryName) => {
    return {
      field: countryName,
      headerName: countryName,
      width: 200,
    };
  };

  let columns = [{ field: "date", headerName: "Fecha", width: 120 }];

  let countriesData = props.countriesData;
  let selectedProp = props.optionsSelectedData;

  // Una columna por país (las filas, alineadas por fecha, las arma buildTableRows).
  for (let selectedCountry of countriesData) {
    columns.push(getCountryTableHeader(selectedCountry.name));
  }

  let rows = buildTableRows(countriesData, selectedProp);
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={20} checkboxSelection />
    </div>
  );
};

export default CountriesTable;
