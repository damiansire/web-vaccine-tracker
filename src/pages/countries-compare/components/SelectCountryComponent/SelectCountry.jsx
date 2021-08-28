import React from "react";
function SelectCountry(props) {
  const selectCountry = (countryName) => {
    props.setSelectedCountries((lastSelected) => {
      return [...lastSelected, countryName];
    });
  };

  return (
    <div className="w-full overflow-scroll">
      {props.availablesCountries
        .filter((country) => {
          return (
            !props.selectedCountries.includes(country) &&
            country.toLowerCase().includes(props.searchTerm.toLowerCase())
          );
        })
        .map((countryName) => {
          return (
            <SelectOption
              key={countryName}
              countryName={countryName}
              selectCountry={selectCountry}
            />
          );
        })}
    </div>
  );
}

function SelectOption(props) {
  return (
    <div
      className="cursor-pointer country-list__item"
      onClick={() => {
        props.selectCountry(props.countryName);
      }}
    >
      {props.countryName}
    </div>
  );
}

export default SelectCountry;
