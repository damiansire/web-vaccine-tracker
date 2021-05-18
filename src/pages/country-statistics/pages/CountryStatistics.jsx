import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import {
  getAvailablesCountries,
  getCountryData,
} from "../../../adapters/countries.js";

import CountriesSpecificPositionRanking from "../components/CountriesSpecificPositionRanking";
import CountryDataTable from "../components/CountryDataTable";
import CountriesMap from "../components/CountriesMap";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const CountryData = () => {
  const classes = useStyles();

  const [availablesCountries, setAvailablesCountries] = useState([]);
  const [selectedCountry, setCountry] = useState({
    countryName: "Uruguay",
    data: [],
  });

  //Seteo iniciales de propiedades
  useEffect(() => {
    getAvailablesCountries().then((data) => {
      setAvailablesCountries(data);
    });
    selectCountryByName("Uruguay");
  }, []);

  const selectCountry = (event) => {
    let countryName = event.target.value;
    selectCountryByName(countryName);
  };

  const selectCountryByName = (countryName) => {
    getCountryData(countryName).then((countryData) => {
      setCountry(countryData);
    });
  };

  return (
    <div className="grid grid-cols-10 justify-items-center gap-4 min-h-full">
      <div className="col-span-6">
        <CountryDataTable countryData={selectedCountry || {}} />
      </div>
      <div className="col-span-4">
        <div className="grid grid-cols-2">
          <div>
            {!!availablesCountries.length && (
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">
                  Pais seleccionado
                </InputLabel>
                <Select native onChange={selectCountry}>
                  {availablesCountries.map((countryName) => (
                    <option value={countryName} key={countryName}>
                      {countryName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          </div>
          <div className="flex flex-wrap content-start">
            Pais seleccionado: {selectedCountry.countryName}
          </div>
        </div>
        <CountriesMap selectCountryByName={selectCountryByName} />
        <CountriesSpecificPositionRanking
          countryName={selectedCountry.countryName}
        />
      </div>
    </div>
  );
};

export default CountryData;
