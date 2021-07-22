import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

const { formatNumberWithPoint } = require("../../../utils/numberFormat");

//Que es mejor, pasar directamente al componente la info ya filtrada tipo: daily_vaccination, countryid
//O pasarla toda y filtrarla aca, teniendo en cuenta, que va a ser dinamico
//Me va a generar muchas lineas hacerlo atras, porque es para cada attributo
const TableRanking = (props) => {
  //Tratamiento de la info
  const attribute = props.attribute;

  //attribute en el return es un string pero arriba tengo una variable con ese nombre
  //Encontrar una mejor forma de hacer lo de los puntos
  let countriesDataSort = props.data.sort(function (a, b) {
    return b[attribute] - a[attribute];
  });
  countriesDataSort = countriesDataSort.map((country, index) => {
    return {
      position: index + 1,
      countryId: country.countryId,
      attribute: formatNumberWithPoint(country[attribute]),
    };
  });

  //Mostrar en tabla

  const useStyles = makeStyles({
    root: {
      width: "100%",
    },
    container: {
      maxHeight: 440,
    },
  });

  //Logica de la tabla
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const countryAttributeNames = {
    daily_vaccinations: "Vacunacion diaria",
    daily_vaccinations_per_million: "Vacunacion diaria por millon",
    people_fully_vaccinated: "Personas full vacunas",
    people_fully_vaccinated_per_hundred: "% Poblacion Inmunizada",
    people_vaccinated: "Vacunadas",
    people_vaccinated_per_hundred: "% Poblacion vacunada",
    total_dose_vaccinations: "Total de dosis aplicadas",
    vaccine_type: "Tipo de vacuna",
  };


  const columns = [
    { id: "position", label: "Posicion", minWidth: 50 },
    { id: "countryId", label: "Pais", minWidth: 50 },
    { id: "attribute", label: countryAttributeNames[attribute], minWidth: 50 },
  ];

  return (
    <>
      {
        !!props.title &&
        < div
          className={
            "flex justify-center mt-4 mb-7 " +
            (props.small ? "text-2xl" : "text-4xl")
          }
        >
          <h1>{props.title}</h1>
        </div>
      }
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {countriesDataSort
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.countryId}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20, 50, 100, 211]}
          component="div"
          count={countriesDataSort.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default TableRanking;
