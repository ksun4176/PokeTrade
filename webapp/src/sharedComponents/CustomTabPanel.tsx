import Box from "@mui/material/Box";

type TabPanelProps = {
  children: React.ReactNode;
  prefix: string;
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
export function TabA11yProps(prefix: string, index: number) {
  return {
    id: `${prefix}-${index}`,
    'aria-controls': `${prefix}-${index}`,
  };
}