import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from "react";
import Typography from "@mui/material/Typography";

type HelpIconWithPopoverProps = {
  /**
   * Element ID to set to Popover
   */
  popoverId: string;
  /**
   * Content to show in Popover
   */
  popoverContent: string;
}
export default function HelpIconWithPopover(props: HelpIconWithPopoverProps) {
  const { popoverId, popoverContent } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return <>
    <IconButton
      color='info' 
      aria-owns={!!anchorEl ? popoverId : undefined}
      aria-haspopup="true"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <HelpOutlineIcon />
    </IconButton>
    <Popover
      id={popoverId}
      open={!!anchorEl}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      onClose={handleClose}
      disableRestoreFocus
      sx={{
        pointerEvents: 'none',
        maxWidth: 500,
      }}
    >
      <Typography sx={{ p: 1, zIndex: -1 }}>
        {popoverContent}
      </Typography>
    </Popover>
  </>
}