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
  // El país[0] no siempre tiene la serie más larga (con sameOrigin no se
  // normaliza), así que tomo el máximo de longitudes para no indexar fuera de rango.
  let dataPointLength = countriesData.reduce(
    (max, country) => Math.max(max, country.data.length),
    0
  );
  // El país con la serie más larga aporta las fechas de referencia.
  let longestSeries = countriesData.reduce(
    (longest, country) =>
      country.data.length > longest.length ? country.data : longest,
    []
  );
  let rows = [];
  //Genera un array con dataPointLength element y su id
  for (let index = 0; index < dataPointLength; index++) {
    rows.push({ id: index, date: longestSeries[index].date });
  }

  let selectedProp = props.optionsSelectedData;

  //Recorre cada país
  for (let selectedCountry of countriesData) {
    //Obtengo su nombre
    let countryName = selectedCountry.name;
    //Le agrego el header
    columns.push(getCountryTableHeader(countryName));
    //Recorre los data point, selección y los agrega
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
