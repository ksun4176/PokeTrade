import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Loading screen while we're fetching data from API
 */
export function LoadingOverlay() {
  return <Box
    display='flex'
    justifyContent='center'
    alignItems='center'
    position='fixed'
    top={0}
    right={0}
    bottom={0}
    left={0}
  >
    <CircularProgress />
  </Box>
}