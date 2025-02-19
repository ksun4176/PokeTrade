import Box from "@mui/material/Box";

type TabPanelProps = {
  children: React.ReactNode;
  prefix: string;
  value: number;
  index: number;
}
export function CustomTabPanel(props: TabPanelProps) {
  const { children, prefix, value, index } = props;
  return <div
    role="tabpanel"
    hidden={value !== index}
    id={`${prefix}-${index}`}
    aria-labelledby={`${prefix}-${index}`}
  >
    { value === index && 
      <Box sx={{ pt: 2 }}>{children}</Box>
    }
  </div>
}
export function TabA11yProps(prefix: string, index: number) {
  return {
    id: `${prefix}-${index}`,
    'aria-controls': `${prefix}-${index}`,
  };
}