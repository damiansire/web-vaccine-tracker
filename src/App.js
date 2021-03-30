import "./App.css";
import CountriesData from "./pages/CountriesDataCompare";
import CountryData from "./pages/CountryStatistics";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container } from "@material-ui/core";
import Navbar from "./components/Navbar.jsx";

const useStyles = makeStyles((theme) => ({
  layout: {
    marginTop: 30,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Container>
      <Navbar />
      <Box m={2}>
        <CountriesData />
      </Box>
    </Container>
  );
}
//<CountryData />
export default App;
