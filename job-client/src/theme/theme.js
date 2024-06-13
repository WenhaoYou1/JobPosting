import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // black
      secondary: "#fdd44f", // yellow
      third:"#ffffff" //white
    },
  },
  typography: {
    htmlFontSize: 10,
    h1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      fontSize: "6rem",
    },
    h2: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      fontSize: "4rem",
    },
    h3: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      fontSize: "2.4rem",
    },
    body1: {
      fontSize: "1.8rem",
      fontFamily: '"Open Sans", sans-serif',
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
