// tslint:disable:no-console
import {AppBar, createStyles, Theme, Toolbar, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import {Socket} from "socket.io-client";
import ServerCard from "./components/ServerCard";

export interface AppProps { // tslint:disable-line:no-empty-interface
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        shared: {},
        grid: {
            flexGrow: 1,
            padding: theme.spacing(2),
        },
        gridItem: {
            margin: theme.spacing(2)
        }
    }),
);

export default function App(props: AppProps) {
    const classes = useStyles(props);

    return (
        <div style={{height: "100%", width: "100%", flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Private Cloud Console
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container spacing={0} className={classes.grid}>
                {[1, 2].map((i) => (
                    <React.Fragment key={i}>
                        <Grid item xs={6} sm={3} key={i} className={classes.gridItem}>
                            <ServerCard serverType={"instance"} statusText={"Healthy"}/>
                        </Grid>
                        <Grid item xs={6} sm={3} key={100 + i} className={classes.gridItem}>
                            <ServerCard serverType={"minecraft server"} statusText={"Healthy"}/>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </div>
    );
}

// let socket: typeof Socket;
// socket = socketio.connect("http://localhost:8080");
// socket.on("connect", () => {
//     console.info(`connected to server as ${this.socket.id}`);
// });
// socket.on("status", (data: any) => {
//     console.info(`Received status from server: ${JSON.stringify(data)}`);
// });
