import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { accMenuItems } from "./AccMenuItems";
import { Button } from "@mui/material";

interface NavBarProps {
  onTabChange: (index: number) => void;
  activeTab: number;
}

export const AccNavBar: React.FC<NavBarProps> = ({
  onTabChange,
  activeTab,
}) => (
  <Stack spacing={0.5} direction="column" className="w-full">
    {accMenuItems.map((tab: any, index: any) => (
      <Button
        key={tab.label}
        variant={activeTab === index ? "contained" : "text"}
        className="w-full mb-1 justify-start"
        onClick={() => onTabChange(index)}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <tab.icon size={24} />
          <Typography variant="body1">{tab.title}</Typography>
        </Stack>
      </Button>
    ))}
    <Divider orientation="vertical" />
  </Stack>
);
