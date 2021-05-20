import React from "react";
import OptionsSelected from "./OptionsSelected";
import SelectOptions from "./SelectOptions";
function SelectCountry(props) {
  return (
    <div className="w-full flex flex-col items-center h-64 mx-auto">
      <div className="w-full px-4">
        <div className="flex flex-col items-center relative">
          {/*<OptionsSelected
            selectedCountries={props.selectedCountries}
            setSelectedCountries={props.setSelectedCountries}
          />*/}
          <SelectOptions
            setSelectedCountries={props.setSelectedCountries}
            selectedCountries={props.selectedCountries}
            availablesCountries={props.availablesCountries}
          />
        </div>
      </div>
    </div>
  );
}

export default SelectCountry;
