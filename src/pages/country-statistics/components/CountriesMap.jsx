import React, { useState, useEffect } from "react";
import { WorldMap } from "react-svg-worldmap";
import { getIsoCodes } from "../../../adapters/iso-codes.js";
import { getLastDataCountries } from "../../../adapters/rankings.js";

function CountriesMap(props) {


  const [data, setData] = useState([]);

  useEffect(() => {


    async function setDataAux() {
      const missingCountriesCode = {
        "BO": "Bolivia",
        "BQ": "Bonaire Sint Eustatius and Saba",
        "BN": "Brunei",
        "CV": "Cape Verde",
        "CI": "Cote d'Ivoire",
        "CW": "Curacao",
        "CD": "Democratic Republic of Congo",
        "GB": "England",
        "FK": "Falkland Islands",
        "IR": "Iran",
        "LA": "Laos",
        "MD": "Moldova",
        "CY": "Northern Cyprus",
        "GB-NI": "Northern Ireland",
        "PS": "Palestine",
        "RU": "Russia",
        "SH": "Saint Helena",
        "KR": "South Korea",
        "SY": "Syria",
        "TW": "Taiwan",
        "TL": "Timor",
        "US": "United States",
        "VE": "Venezuela",
        "VN": "Vietnam",
        "GB-WLS": "Wales",
      }
      let isoCodes = await getIsoCodes();
      let data = await getLastDataCountries();
      isoCodes = isoCodes.map((obj) => {
        let countryData = data.find(country => country.countryId === obj.countryId);
        if (!countryData) {
          //Si no lo encuentra, buscamos por el code
          countryData = data.find(country => country.countryId === missingCountriesCode[obj.code]);
        }

        let fullVaccinatedPerHundred = countryData ? parseFloat(countryData.people_fully_vaccinated_per_hundred) : null;
        return { country: obj.code, countryId: obj.countryId, value: fullVaccinatedPerHundred };
      });
      setData(isoCodes)
    }
    setDataAux();

  }, []);

  const clickAction = (event, countryName) => {
    props.selectCountryByName(countryName);
  };

  const stylingFunction = (countryData) => {
    let getColor = (value) => {
      if (!value) {
        return "blue"
      }
      if (value > 70) {
        return "green"
      }
      else if (value > 50) {
        return "yellow"
      }
      else if (value > 35) {
        return "orange"
      }
      else if (value > 10) {
        return "red"
      }
      else {
        return "black"
      }
    }
    const opacityLevel = 1
    return {
      fill: getColor(countryData.countryValue),
      fillOpacity: opacityLevel,
      stroke: "green",
      strokeWidth: 1,
      strokeOpacity: 0.2,
      cursor: "pointer"
    }
  }

  return (
    <div>
      {!!data.length && (
        <WorldMap
          size={props.size ? props.size : "xl"}
          onClickFunction={clickAction}
          color="red"
          value-suffix="people"
          data={data}
          styleFunction={stylingFunction}
          backgroundColor="rgba(255, 255, 255, .4)"
        />
      )}
    </div>
  );
}

export default CountriesMap;
