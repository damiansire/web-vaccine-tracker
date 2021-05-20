import React from "react";

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

export default SelectOption;
