import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { TopGradientContainer } from "../../sharedComponents/layouts/TopGradientContainer";
import { MyAppBar } from "../../sharedComponents/surfaces/MyAppBar";

interface IEditContainerProps {
  /**
   * Children to put in stepper container
   */
  children: React.ReactNode;
  onSaveButtonClicked: () => void;
  onResetButtonClicked: () => void;
  saveButtonDisabled?: boolean;
}
/**
 * Container for edit pages
 */
export default function EditContainer(props: IEditContainerProps) {
  const { children, onSaveButtonClicked, onResetButtonClicked, saveButtonDisabled } = props;
  return <TopGradientContainer flexDirection='column'>
    <MyAppBar />
    <Box
      display='flex'
      flexDirection='column'
      p={1}
      height='100%'
    >
      <Box flexGrow={1}>
        {children}
      </Box>
      <Box display='flex' mt={1} gap={1}>
        <Box flexGrow={1} />
        <Button
          onClick={onResetButtonClicked}
        >Reset</Button>
        <Button
          variant="contained"
          color="success"
          onClick={onSaveButtonClicked}
          disabled={saveButtonDisabled}
        >
          Save
        </Button>
      </Box>
    </Box>
  </TopGradientContainer>
}