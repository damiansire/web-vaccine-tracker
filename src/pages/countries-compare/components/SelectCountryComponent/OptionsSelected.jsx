import React from "react";
import Cross from "./Cross";
function OptionsSelected(props) {
  const desSelectCountry = (countryName) => {
    props.setSelectedCountries((lastState) => {
      return lastState.filter(
        (countrySelectedName) => countrySelectedName !== countryName
      );
    });
  };
  return (
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
  );
}

function OptionSelected(props) {
  return (
    <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 ">
      <div className="text-xs font-normal leading-none max-w-full flex-initial">
        {props.optionName}
      </div>
      <Cross
        click={() => {
          props.desSelectCountry(props.optionName);
        }}
      />
    </div>
  );
}

export default OptionsSelected;
