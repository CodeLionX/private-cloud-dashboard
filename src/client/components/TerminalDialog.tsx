import {Button, Grid, createStyles, Theme} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, {useState} from "react";
import TerminalDisplay from "./TerminalDisplay";

export interface TerminalDialogProps { // tslint:disable-line:no-empty-interface
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialogText: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        progressIndicator: {
            margin: theme.spacing(2)
        }
    }),
);

export default function TerminalDialog(props: TerminalDialogProps) {
    const classes = useStyles(props)
    const [isOpen, setOpen] = useState(false);
    const [progress, setProgress] = useState(0);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <Button variant={"contained"} color="primary" onClick={handleClickOpen}>
                Start Minecraft server
            </Button>
            <Dialog
                fullWidth={true}
                maxWidth={"lg"}
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="Starting Minecraft Server"
            >
                <DialogTitle id="dialog-title">Starting Minecraft Server</DialogTitle>
                <DialogContent dividers>
                    <Grid container
                        spacing={0}
                        direction="row"
                        justify="space-between"
                        alignItems="stretch">
                        <Grid item>
                            <DialogContentText className={classes.dialogText}>
                                Minecraft Server is being started. Progress:
                            </DialogContentText>
                        </Grid>
                        <Grid item>
                            {(progress > 0)
                                ? <CircularProgress value={progress} variant="determinate" color="primary" className={classes.progressIndicator} />
                                : <CircularProgress color="primary" className={classes.progressIndicator} />
                            }
                        </Grid>
                    </Grid>
                    <TerminalDisplay
                        instanceId={"1116322196404956169"}
                        serverIp={"10.0.0.3"}
                        onProgress={setProgress}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
