import React from "react";

const CountriesTable = (props) => {
  /*
  props.options.xaxis.categories; // [acafechas]
  series; // [ { name : "Uruguay", data : [1,2,3,4,5,6,7,8,9    ] }]
  ////"Uruguay", "Argentina", "Bolivia"
  //{Date: Uruguay : 123, Argentina : 312, Bolivia : 147}

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
  */
  return <></>;
};

export default CountriesTable;
