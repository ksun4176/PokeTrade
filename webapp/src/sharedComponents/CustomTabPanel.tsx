import Box from "@mui/material/Box";

type TabPanelProps = {
  /**
   * Children to put in tab container
   */
  children: React.ReactNode;
  /**
   * prefix to add to tab name
   */
  prefix: string;
  /**
   * index of tab
   */
  index: number;
}
export function CustomTabPanel(props: TabPanelProps) {
  const { children, prefix, index } = props;
  return <Box 
    role="tabpanel"
    id={`${prefix}-${index}`}
    aria-labelledby={`${prefix}-${index}`}
    sx={{ pt: 2 }}
  >
    {children}
  </Box>
}
/**
 * Properties to add to tab for aria
 * @param prefix prefix to add to tab name
 * @param index index of tab
 */
export function TabA11yProps(prefix: string, index: number) {
  return {
    id: `${prefix}-${index}`,
    'aria-controls': `${prefix}-${index}`,
  };
}