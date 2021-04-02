import "./App.css";
import CountriesData from "./pages/CountriesDataCompare";
import { Box, Container } from "@material-ui/core";
import Navbar from "./components/Navbar.jsx";


function App() {

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
