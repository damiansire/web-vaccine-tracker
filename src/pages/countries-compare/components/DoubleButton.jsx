import React from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const useStyles = makeStyles((theme) => ({
  optionElement: {
    marginBottom: 10,
    textAlign: 'center',
  },
  cursorPointer: {
    cursor: 'pointer',
  },
}));

const StyledDoubleButtonContainer = styled.div`
  .custom-btn-group {
    height: 2rem;
  }
`;

const DoubleButton = (props) => {
  const classes = useStyles();
  let selectedFirstButton = props.selectedOption === props.valueButton1;
  return (
    <StyledDoubleButtonContainer>
      <div className={classes.optionElement}>
        <span>{props.buttonsDescription}</span>
      </div>
      <ButtonGroup
        size='large'
        variant='contained'
        aria-label='large outlined primary button group'
        onClick={props.buttonsHandle}
        className='custom-btn-group'
      >
        <Button
          className={classes.cursorPointer}
          color={selectedFirstButton && 'primary'}
          value={props.valueButton1}
        >
          {props.button1Text}
        </Button>
        <Button
          className={classes.cursorPointer}
          color={!selectedFirstButton && 'primary'}
          value={props.valueButton2}
        >
          {props.button2Text}
        </Button>
      </ButtonGroup>
    </StyledDoubleButtonContainer>
  );
};

export default DoubleButton;
