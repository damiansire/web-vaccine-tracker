import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import {
  getAvailablesCountries,
  getCountryData,
} from "../adapters/countries.js";
import CountryDataTable from "../components/CountryDataTable";

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
    getAvailablesCountries().then((data) => setAvailablesCountries(data));
  }, []);

  const selectCountry = (event) => {
    let countryId = event.target.value;
    getCountryData(countryId).then((countryData) => {
      setCountry(countryData);
    });
  };

  return (
    <div>
      <h3>{selectedCountry["countryId"]}</h3>
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
      <CountryDataTable countryData={selectedCountry || {}} />
    </div>
  );
};

export default CountryData;
