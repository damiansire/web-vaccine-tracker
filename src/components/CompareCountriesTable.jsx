import React from "react";
import { DataGrid } from "@material-ui/data-grid";

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
  let dataPointLength = countriesData[0].data.length;
  let rows = [];
  //Genera un array con dataPointLength element y su id
  for (let index = 0; index < dataPointLength; index++) {
    rows.push({ id: index, date: props.countriesData[0].data[index].date });
  }

  let selectedProp = props.optionsSelectedData;

  //Recorre cada pais
  for (let selectedCountry of countriesData) {
    //Obtengo su nombre
    let countryName = selectedCountry.name;
    //Le agrego el header
    columns.push(getCountryTableHeader(countryName));
    //Recorre los data point, seleccion y los agrega
    selectedCountry.data.forEach((dataPoint, index) => {
      rows[index][countryName] = dataPoint[selectedProp];
    });
  }
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={20} checkboxSelection />
    </div>
  );
};

export default CountriesTable;
