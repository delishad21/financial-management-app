import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  useColorScheme,
} from "@mui/material";
import PropTypes from "prop-types";
// components
import {
  IconBellRinging,
  IconMenu,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useThemeContext } from "@/app/provider";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const LandingHeader = () => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <IconButton
            size="large"
            aria-label="show 11 new notifications"
            color="inherit"
            aria-controls="msgs-menu"
            aria-haspopup="true"
            onClick={toggleTheme}
          >
            <Badge variant="dot" color="primary">
              {isDarkMode ? (
                <IconMoon size="21" stroke="1.5" />
              ) : (
                <IconSun size="21" stroke="1.5" />
              )}
            </Badge>
          </IconButton>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

LandingHeader.propTypes = {
  sx: PropTypes.object,
};

export default LandingHeader;
