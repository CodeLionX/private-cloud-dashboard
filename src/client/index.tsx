import * as React from "react";
import * as ReactDOM from "react-dom";

import {CssBaseline} from "@material-ui/core";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import App from "./App";
import theme from "./theme";

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App/>
    </ThemeProvider>,
    document.getElementById("container")
);
