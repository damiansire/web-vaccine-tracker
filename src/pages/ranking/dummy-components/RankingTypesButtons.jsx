import React from "react";
import { Button } from "@material-ui/core";
function RankingTypesButtons(props) {
  return (
    <>
      <div class="flex justify-around items-center m-3">
        <h5>Elige el ranking:</h5>
        {props.rankingTablesOptions.map((option) => {
          return (
            <Button
              class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => {
                props.selectOption(option);
              }}
            >
              {option.buttonText}
            </Button>
          );
        })}
      </div>
    </>
  );
}

export default RankingTypesButtons;
