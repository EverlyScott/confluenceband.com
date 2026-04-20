"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    mode: "dark",

    primary: {
      main: "#6D4AFF", // slightly brighter for contrast
      light: "#9D7BFF",
      dark: "#3F2A99",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#B085FF",
      light: "#D1B3FF",
      dark: "#7A4FCC",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#0F0D14", // darker base → more separation
      paper: "#1F1B2E", // more purple + brighter
    },

    text: {
      primary: "#F2EEFF", // slightly brighter
      secondary: "#C7C0DB",
    },

    divider: "rgba(255, 255, 255, 0.16)",

    error: {
      main: "#FF5370",
    },

    warning: {
      main: "#FFB74D",
    },

    info: {
      main: "#64B5F6",
    },

    success: {
      main: "#81C784",
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // removes MUI gradient overlay
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#25213A", // elevated surface
          border: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A1724",
        },
        notchedOutline: {
          borderColor: "rgba(255,255,255,0.15)",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.16)",
        },
      },
    },
  },
});

export default theme;
