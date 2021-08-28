import "./App.css";
import CountriesData from "./pages/countries-compare/pages/CountriesDataCompare";
import AllCountriesRanking from "./pages/ranking/pages/AllCountriesRanking";
import CountryStatistics from "./pages/country-statistics/pages/CountryStatistics";

import Navbar from "./components/Navbar.jsx";
import { Route, Switch, useLocation } from "wouter";
import AllRankings from "./pages/ranking/pages/AllRankings";
import WorldSituation from "./pages/world-situation/pages/WorldSituation";
import InformationSources from "./pages/information-sources/pages/InformationSources";
import ReactGA from "react-ga";
import React, { useEffect } from "react";
import SideBar from "./components/sidebar";

function usePageViews() {
  let location = useLocation();
  useEffect(() => {
    ReactGA.initialize("UA-155224346-6", {
      debug: true,
    });
    ReactGA.set({ page: location[0] });
    ReactGA.pageview(location[0]);
  }, [location]);
}

function App() {
  usePageViews();
  return (
    <div className="screen">
      {/* ===== sidebar ===== */}
      <div className="screen__sidebar">
        <SideBar></SideBar>
      </div>
      {/* ===== /sidebar ===== */}

      {/* ===== content ===== */}
      <div className="screen__content">
        <Switch>
          <Route path="/" component={CountriesData} />
          <Route path="/country/:countryId" component={CountryStatistics} />
          <Route path="/ranking" component={AllCountriesRanking} />
          <Route path="/all-rankings" component={AllRankings} />
          <Route path="/world-situation" component={WorldSituation} />
          <Route path="/information-source" component={InformationSources} />
        </Switch>
      </div>
      {/* ===== /content ===== */}
    </div>
  );
}
//<CountryData />
export default App;
