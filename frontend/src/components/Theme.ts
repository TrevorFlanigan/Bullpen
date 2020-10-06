import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const palette = {
  primary: { main: "#000000", contrastText: "#ffffff", light: "#ff3333" },
  secondary: { main: "#ffffff", contrastText: "#ffffff" },
  dark: "#ff3333",
};

const typography = {
  fontFamily: [
    "Spartan",
    "Open Sans",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
};

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 1050,
    lg: 1130,
    xl: 1680,
  },
};

const name = "Theme";
let Theme = createMuiTheme({
  palette,
  typography,
  breakpoints,
  overrides: {},
});
Theme = responsiveFontSizes(Theme);

export default Theme;
