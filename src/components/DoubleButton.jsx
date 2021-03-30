import React from "react";
import { Button, ButtonGroup } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  optionElement: {
    marginBottom: 10,
    textAlign: "center",
  },
}));

const DoubleButton = (props) => {
  const classes = useStyles();
  let selectedFirstButton = props.selectedOption === props.valueButton1;
  return (
    <>
      <div className={classes.optionElement}>
        <span>{props.buttonsDescription}</span>
      </div>
      <ButtonGroup
        size="large"
        variant="contained"
        aria-label="large outlined primary button group"
        onClick={props.buttonsHandle}
      >
        <Button
          color={selectedFirstButton && "primary"}
          value={props.valueButton1}
        >
          {props.button1Text}
        </Button>
        <Button
          color={!selectedFirstButton && "primary"}
          value={props.valueButton2}
        >
          {props.button2Text}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default DoubleButton;
