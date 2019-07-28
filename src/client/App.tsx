// tslint:disable:no-console
import {
    AppBar,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MuiThemeProvider,
    Toolbar,
    Typography
} from "@material-ui/core";
import {AccountCircle, PowerSettingsNew} from "@material-ui/icons";
import * as React from "react";
import {Socket} from "socket.io-client";
import * as socketio from "socket.io-client";
import {style} from "typestyle";

export interface AppProps { // tslint:disable-line:no-empty-interface
}

export interface AppState { // tslint:disable-line:no-empty-interface
}

export default class App extends React.Component<AppProps, AppState> {

    private readonly socket: typeof Socket;

    constructor(props: AppProps) {
        super(props);
        this.state = {
            loggedIn: false
        };
        this.socket = socketio.connect("http://localhost:8080");
        this.socket.on("connect", () => {
            console.info(`connected to server as ${this.socket.id}`);
        });
        this.socket.on("status", (data: any) => {
            console.info(`Received status from server: ${JSON.stringify(data)}`);
        });
    }

    private logout() {
        // this.setState({
        //     loggedIn: false,
        //     loginData: undefined
        // });
    }

    public render() {
        return (
            <div style={{height: "100%"}}>
                <AppBar position="static" className={style({flexGrow: 1})}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={style({flexGrow: 1})}>
                            Private Cloud Console
                        </Typography>
                        <div>
                            <IconButton
                                aria-owns={open ? "menu-appbar" : undefined}
                                aria-haspopup="true"
                                // onClick={}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <div className={style({
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                })}>
                </div>
            </div>
        );
    }
}
