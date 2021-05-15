import "./App.css";
import CountriesData from "./pages/countries-compare/pages/CountriesDataCompare";
import CountriesRanking from "./pages/ranking/pages/CountriesRanking";
import CountryStatistics from "./pages/country-statistics/pages/CountryStatistics";

import { Box, Container } from "@material-ui/core";
import Navbar from "./components/Navbar.jsx";
import { Route, Switch } from "wouter";

function App() {
  return (
    <Container>
      <Navbar />
      <Box m={2}>
        <Switch>
          <Route path="/" component={CountriesData} />
          <Route path="/country" component={CountryStatistics} />
          <Route path="/ranking" component={CountriesRanking} />
        </Switch>
      </Box>
    </Container>
  );
}
//<CountryData />
export default App;
