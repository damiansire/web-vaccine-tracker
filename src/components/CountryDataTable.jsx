import React from "react";
import { DataGrid } from "@material-ui/data-grid";

const CountryDataTable = (props) => {
  let columns = [
    { field: "date", headerName: "Fecha", width: 120 },
    {
      field: "daily_vaccinations",
      headerName: "Vacunadas hoy",
      width: 150,
    },
    {
      field: "daily_vaccinations_per_million",
      headerName: "Vacunas millon/hab",
      width: 180,
    },
    {
      field: "people_vaccinated",
      headerName: "Vacunadas",
      width: 140,
    },
    {
      field: "people_vaccinated_per_hundred",
      headerName: "Vacunadas por 100k/hab",
      width: 220,
    },
    {
      field: "total_dose_vaccinations",
      headerName: "Total de dosis aplicadas",
      width: 200,
    },
    { field: "vaccine_type", headerName: "Marca de la vacuna", width: 200 },
    {
      field: "people_fully_vaccinated_per_hundred",
      headerName: "Inmunizadas 100k/hab",
      width: 200,
    },
  ];

  for (let index = 0; index < props.countryData.data.length; index++) {
    props.countryData.data[index]["id"] = index;
  }

  const rows = !!props.countryData.data.length ? props.countryData.data : [];
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={20} checkboxSelection />
    </div>
  );
};

export default CountryDataTable;
