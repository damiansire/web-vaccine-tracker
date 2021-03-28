import React from "react";
import { DataGrid } from "@material-ui/data-grid";

const CountriesTable = (props) => {
  /*
  props.options.xaxis.categories; // [acafechas]
  series; // [ { name : "Uruguay", data : [1,2,3,4,5,6,7,8,9    ] }]
  ////"Uruguay", "Argentina", "Bolivia"
  //{Date: Uruguay : 123, Argentina : 312, Bolivia : 147}
*/
  let columns = [
    { field: "date", headerName: "Fecha", width: 120 },
    {
      field: "Argentina",
      headerName: "Argentina",
      width: 150,
    },
    {
      field: "Uruguay",
      headerName: "Uruguay",
      width: 180,
    },
    {
      field: "Colombia",
      headerName: "Colombia",
      width: 140,
    },
    {
      field: "Bolivia",
      headerName: "Bolivia",
      width: 220,
    },
  ];

  const rows = [
    {
      id: 1,
      date: "20-12-2020",
      Argentina: 80,
      Uruguay: 80,
      Colombia: 80,
      Bolivia: 80,
    },
  ];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={20} checkboxSelection />
    </div>
  );
};

export default CountriesTable;
