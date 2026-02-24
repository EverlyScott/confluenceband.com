"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
