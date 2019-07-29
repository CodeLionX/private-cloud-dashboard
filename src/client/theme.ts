import {createMuiTheme, Theme} from "@material-ui/core/styles";

export const failureRed = "#9F2D45";
export const successGreen = "#3B9E25";

// Create a theme instance
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
            main: failureRed,
        },
        background: {
            paper: "#DEE7E7",
            default: "#CAD2D2",
        },
    },
});

export default theme;
