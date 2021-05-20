import React from "react";
import Cross from "./Cross";
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

export default OptionSelected;
