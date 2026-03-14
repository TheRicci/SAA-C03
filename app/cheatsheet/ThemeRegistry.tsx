"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

type ThemeRegistryProps = {
  children: React.ReactNode;
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0073bb",
    },
    warning: {
      main: "#d9822b",
      light: "#fff4e5",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#16191f",
      secondary: "#5f6b7a",
    },
    divider: "#d1d5db",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "\"Amazon Ember\", \"Helvetica Neue\", Arial, sans-serif",
  },
});

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: theme.palette.background.default,
              backgroundImage: "none",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
