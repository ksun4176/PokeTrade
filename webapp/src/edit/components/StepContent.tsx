import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export interface IStepContentProps {
  children: React.ReactNode;
  handleSteps: (isNext: boolean) => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  nextStepDisabled?: boolean;
  handleNext?: () => void;
}
export class StepContent extends React.Component<IStepContentProps> {
  override render() {
    const { children, handleSteps, isFirstStep, isLastStep, nextStepDisabled, handleNext } = this.props;

    const handleNextClick = () => {
      if (handleNext) handleNext();
      handleSteps(true);
    }
    return <>
      {children}
      <Box sx={{ display: 'flex', flexDirection: 'row', p: 1 }}>
        <Button
          color="inherit"
          disabled={isFirstStep}
          onClick={() => handleSteps(false)}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          variant='contained'
          color='success'
          disabled={nextStepDisabled}
          onClick={handleNextClick}
        >
          {isLastStep ? `Finish` : `Next`}
        </Button>
      </Box>
    </>
  }
}