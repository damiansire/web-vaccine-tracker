import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import {
  getAvailablesCountries,
  getCountryData,
} from "../../../adapters/countries.js";

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
    countryId: "Uruguay",
    data: [],
  });

  useEffect(() => {
    getAvailablesCountries().then((data) => {
      setAvailablesCountries(data);
      selectCountry({ target: { value: "Uruguay" } });
    });
  }, []);

  const selectCountry = (event) => {
    let countryId = event.target.value;
    getCountryData(countryId).then((countryData) => {
      setCountry(countryData);
    });
  };

  return (
    <div className="grid grid-cols-10 justify-items-center gap-4 min-h-full">
      <div className="col-span-6">
        <CountryDataTable countryData={selectedCountry || {}} />
      </div>
      <div className="col-span-4">
        <div>
          {!!availablesCountries.length && (
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-native-simple">Age</InputLabel>
              <Select native onChange={selectCountry}>
                {availablesCountries.map((countryId) => (
                  <option value={countryId} key={countryId}>
                    {countryId}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
        <CountriesMap />
      </div>
    </div>
  );
};

export default CountryData;
