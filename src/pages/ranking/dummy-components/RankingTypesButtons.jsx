import React from "react";
import { Button } from "@material-ui/core";
function RankingTypesButtons(props) {
  return (
    <>
      <h5>Elige el tipo de ranking</h5>
      {props.rankingTablesOptions.map((option) => {
        console.log(props.rankingTablesOptions);
        return (
          <Button variant="contained" color="primary">
            {option.title}
          </Button>
        );
      })}
    </>
  );
}

export default RankingTypesButtons;
