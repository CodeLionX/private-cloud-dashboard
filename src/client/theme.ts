import {createMuiTheme, Theme} from "@material-ui/core/styles";

// Create a theme instance.
const theme: Theme = createMuiTheme({
    palette: {
        primary: {
            light: "#584257",
            main: "#452D44",
            dark: "#331832"
        },
        secondary: {
            main: "#1B5299",
        },
        error: {
            main: "#9F2D45",
        },
        background: {
            paper: "#DEE7E7",
            default: "#CAD2D2"
        },

    },
});

export default theme;
