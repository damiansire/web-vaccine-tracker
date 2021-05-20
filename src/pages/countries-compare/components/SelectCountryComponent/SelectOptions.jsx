import React from "react";

function SelectOptions(props) {
  const selectCountry = (countryName) => {
    props.setSelectedCountries((lastSelected) => {
      return [...lastSelected, countryName];
    });
  };

  return (
    <div className="h-screen shadow top-full bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
      <div className="flex flex-col w-full">
        {props.availablesCountries
          .filter((country) => {
            return !props.selectedCountries.includes(country);
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
    </div>
  );
}

function SelectOption(props) {
  return (
    <div
      className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100"
      onClick={() => {
        props.selectCountry(props.countryName);
      }}
    >
      <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative border-teal-600">
        <div className="w-full items-center flex">
          <div className="mx-2 leading-6  ">{props.countryName} </div>
        </div>
      </div>
    </div>
  );
}

export default SelectOptions;
