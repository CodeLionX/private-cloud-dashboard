import { red } from "@material-ui/core/colors";
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
            default: "#DEE7E7",
            paper: "#CAD2D2"
        },

    },
});

export default theme;