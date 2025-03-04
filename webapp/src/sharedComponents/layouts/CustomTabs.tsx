import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import React, { useCallback, useEffect, useState } from "react";
export type TabInfo = {
  /** Label to show in tab */
  label: string,
  /** Content to display when we are on that tab */
  content: React.ReactNode,
}

type CustomTabsProps = Omit<TabsProps, "value" | "onChange" | "orientation" | "children"> & 
{
  /**
   * prefix to add to tab IDs
   */
  tabPrefix: string;
  /**
   * Tabs themselves
   */
  tabs: TabInfo[];
  /**
   * The tab we should redirect to initially
   */
  initialTabIndex?: number;
  /**
   * Handler for when tab index changed
   * @param index Tab index changed to
   * @returns 
   */
  onTabChange?: (index: number) => void;
  /**
   * Extra content to add to tabs heading
   */
  tabsHeadingContent?: React.ReactNode;
}
export function CustomTabs(props: CustomTabsProps) {
  const { tabPrefix, tabs, initialTabIndex, onTabChange, tabsHeadingContent, ...tabsProps } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const switchTab = useCallback((newTabIndex: number) => {
    setTabIndex(newTabIndex);
    if (onTabChange) onTabChange(newTabIndex);
  }, [onTabChange]);

  useEffect(() => {
    if (initialTabIndex !== undefined) {
      switchTab(initialTabIndex);
    }
  }, [initialTabIndex, switchTab])

  return <Box
    height='100%'
    width='100%'
  >
    <Box
      pb={1}
      sx={{ display: 'flex' }}
    >
      <Tabs
        value={tabIndex}
        onChange={(_e, newTabIndex: number) => switchTab(newTabIndex)} 
        {...tabsProps}
      >
        { tabs.map((tab, index) => <Tab label={tab.label} {...TabA11yProps(tabPrefix, index)} />)}
      </Tabs>
      {tabsHeadingContent}
    </Box>
    <Box flexGrow={1}>
      <CustomTabPanel prefix={tabPrefix} index={tabIndex}>
        {tabs[tabIndex].content}
      </CustomTabPanel>
    </Box>
  </Box>
}

type TabPanelProps = {
  /**
   * Children to put in tab container
   */
  children: React.ReactNode;
  /**
   * prefix to add to tab IDs
   */
  prefix: string;
  /**
   * index of tab
   */
  index: number;
}
const CustomTabPanel = function (props: TabPanelProps) {
  const { children, prefix, index } = props;
  return <Box 
    role="tabpanel"
    id={`${prefix}-${index}`}
    aria-labelledby={`${prefix}-${index}`}
  >
    {children}
  </Box>
}
/**
 * Properties to add to tab for aria
 * @param prefix prefix to add to tab IDs
 * @param index index of tab
 */
const TabA11yProps = function (prefix: string, index: number) {
  return {
    id: `${prefix}-${index}`,
    'aria-controls': `${prefix}-${index}`,
  };
}