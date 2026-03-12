"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type ThemeRegistryProps = {
  children: React.ReactNode;
};

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f4f6fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#101828",
      secondary: "#475467",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "Roboto, \"Helvetica Neue\", Arial, sans-serif",
  },
});

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
