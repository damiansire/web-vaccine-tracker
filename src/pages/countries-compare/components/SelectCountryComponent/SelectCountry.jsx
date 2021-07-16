import React from "react";
function SelectCountry(props) {
  const selectCountry = (countryName) => {
    props.setSelectedCountries((lastSelected) => {
      return [...lastSelected, countryName];
    });
  };

  return (
    <div className="w-full overflow-scroll" style={{ height: "82vh" }}>
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
      className="cursor-pointer w-full p-3 text-center border-black bg-gray-300 border-b hover:bg-red-300"
      onClick={() => {
        props.selectCountry(props.countryName);
      }}
    >
      {props.countryName}
    </div>
  );
}

export default SelectCountry;
