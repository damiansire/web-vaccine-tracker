import React from "react";
import OptionSelected from "./OptionSelected";
import SelectOption from "./SelectOption";
function SelectCountry(props) {
  const selectCountry = (countryName) => {
    props.setSelectedCountries((lastSelected) => {
      return [...lastSelected, countryName];
    });
  };
  const desSelectCountry = (countryName) => {
    props.setSelectedCountries((lastState) => {
      return lastState.filter(
        (countrySelectedName) => countrySelectedName !== countryName
      );
    });
  };
  return (
    <div className="w-full flex flex-col items-center h-64 mx-auto">
      <div className="w-full px-4">
        <div className="flex flex-col items-center relative">
          <div className="w-full  svelte-1l8159u">
            <div className="my-2 p-1 flex border border-gray-200 bg-white rounded svelte-1l8159u">
              <div className="flex flex-auto flex-wrap">
                {props.selectedCountries.map((name) => (
                  <OptionSelected
                    optionName={name}
                    desSelectCountry={desSelectCountry}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="h-screen absolute shadow top-full bg-white z-40 w-full lef-0 rounded max-h-select overflow-y-auto svelte-5uyqqj">
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
        </div>
      </div>
    </div>
  );
}

export default SelectCountry;
