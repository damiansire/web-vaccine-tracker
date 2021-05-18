import React, { useState, useEffect } from "react";
import { WorldMap } from "react-svg-worldmap";
import { getIsoCodes } from "../../../adapters/iso-codes.js";

function CountriesMap(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getIsoCodes().then((data) => {
      setData(data);
    });
  }, []);

  const clickAction = (event, countryName) => {
    props.selectCountryByName(countryName);
  };

  return (
    <div>
      {!!data.length && (
        <WorldMap
          size="lg"
          onClickFunction={clickAction}
          color="red"
          value-suffix="people"
          data={data}
        />
      )}
    </div>
  );
}

export default CountriesMap;
