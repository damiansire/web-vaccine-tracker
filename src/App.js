import "./App.css";
import CountriesData from "./pages/countries-compare/pages/CountriesDataCompare";
import AllCountriesRanking from "./pages/ranking/pages/AllCountriesRanking";
import CountryStatistics from "./pages/country-statistics/pages/CountryStatistics";

import Navbar from "./components/Navbar.jsx";
import { Route, Switch } from "wouter";
import AllRankings from "./pages/ranking/pages/AllRankings";
import WorldSituation from "./pages/world-situation/pages/WorldSituation"

function App() {
  return (
    <div className="max-h-screen">
      <Navbar />

      <div>
        <Switch>
          <Route path="/" component={CountriesData} />
          <Route path="/country" component={CountryStatistics} />
          <Route path="/ranking" component={AllCountriesRanking} />
          <Route path="/all-rankings" component={AllRankings} />
          <Route path="/world-situation" component={WorldSituation} />
        </Switch>
      </div>
    </div>
  );
}
//<CountryData />
export default App;
