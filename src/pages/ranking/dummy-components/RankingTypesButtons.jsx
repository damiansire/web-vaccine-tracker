import React from "react";
import { Button } from "@material-ui/core";
function RankingTypesButtons(props) {
  return (
    <>
      <h5>Elige el tipo de ranking</h5>
      {props.rankingTablesOptions.map((option) => {
        console.log(props.rankingTablesOptions);
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              props.selectOption(option);
            }}
          >
            {option.title}
          </Button>
        );
      })}
    </>
  );
}

export default RankingTypesButtons;
