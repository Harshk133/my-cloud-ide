import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1e1e1e",
      paper: "#252526",
    },
    text: {
      primary: "#d4d4d4",
      secondary: "#9cdcfe",
    },
  },
});

export default theme;
