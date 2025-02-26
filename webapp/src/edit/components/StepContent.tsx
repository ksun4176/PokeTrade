import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export interface IStepContentProps {
  /**
   * Children to put in stepper container
   */
  children: React.ReactNode;
  /**
   * Handle stepping through the stepper
   * @param isNext Whether we are handling moving to the next step or previous step
   */
  handleSteps: (isNext: boolean) => void;
  /**
   * Whether this is the first step
   */
  isFirstStep?: boolean;
  /**
   * Whether this is the last step
   */
  isLastStep?: boolean;
  /**
   * Whether the next button is disabled
   */
  nextStepDisabled?: boolean;
}
/**
 * Container for stepper content
 */
export class StepContent extends React.Component<IStepContentProps> {
  override render() {
    const { children, handleSteps, isFirstStep, isLastStep, nextStepDisabled } = this.props;

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
          onClick={() => handleSteps(true)}
        >
          {isLastStep ? `Finish` : `Next`}
        </Button>
      </Box>
    </>
  }
}