// tslint:disable:no-console
import { AppBar, createStyles, Theme, Toolbar, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useAxios from "axios-hooks";
import * as React from "react";
import ServerCard from "./components/ServerCard/";

export interface AppProps { // tslint:disable-line:no-empty-interface
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        body: {
            height: "100%",
            width: "100%",
            flexGrow: 1
        },
        shared: {},
        grid: {
            padding: theme.spacing(2),
        },
        gridItem: {
            margin: theme.spacing(2)
        }
    }),
);

export default function App(props: AppProps) {
    const classes = useStyles(props);
    const [{ data }] = useAxios<string[]>("/api/servers");

    return (
        <div className={classes.body}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Private Cloud Console
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container
                spacing={0}
                direction="row"
                justify="space-evenly"
                alignItems="center"
                className={classes.grid}
            >
                {data && data.map((serverId) => (
                    <Grid item xs={8} sm={4} lg={2} key={serverId} className={classes.gridItem}>
                        <ServerCard serverId={serverId} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
