import React from "react";
const RankingTypesButtons = (props) => {
  return (
    <div className="flex justify-around items-center m-3">
      {props.isRanking && <h5>Elige el ranking:</h5>}
      {props.rankingTablesOptions.map((option) => {
        return (
          <button
            key={option.buttonText}
            className="bg-transparent mx-4 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => {
              props.selectOption(option);
            }}
          >
            {option.buttonText}
          </button>
        );
      })}
    </div>
  );
};

export default RankingTypesButtons;
