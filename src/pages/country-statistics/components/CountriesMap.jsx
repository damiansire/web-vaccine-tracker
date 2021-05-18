import React, { useState, useEffect } from "react";
import { WorldMap } from "react-svg-worldmap";
import { getIsoCodes } from "../../../adapters/iso-codes.js";

function CountriesMap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getIsoCodes().then((data) => {
      setData(data);
    });
  }, []);

  const clickAction = (event, countryName) => {
    console.log(event, countryName);
  };

  return (
    <div>
      {!!data.length && (
        <WorldMap
          size="lg"
          onClickFunction={clickAction}
          color="red"
          title="Top 10 Countries"
          value-suffix="people"
          data={data}
        />
      )}
    </div>
  );
}

export default CountriesMap;
