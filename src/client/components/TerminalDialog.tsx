import React, { useState } from "react";
import { Button, Grid, createStyles, Theme } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TerminalDisplay from "./TerminalDisplay";
import ServerDetails from "../../shared/ServerDetails";

export interface TerminalDialogProps {
    serverDetails: ServerDetails;
    onSocketOpen: () => Promise<void>;
    createOpened?: boolean;
    onClose?: () => void;
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
    const { serverDetails, onSocketOpen, createOpened = false, onClose = () => { } } = props;
    const classes = useStyles(props)
    const [isOpen, setOpen] = useState(createOpened);
    const [progress, setProgress] = useState(0);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        onClose();
    }

    function handleSocketConnect(term) {
        onSocketOpen().catch((error: any) => {
            if(error.message.includes("403")) {
                term.writeln(`Action involving ${serverDetails.serverType}-${serverDetails.id} not allowed!`);
            } else {
                term.writeln(`Action involving ${serverDetails.serverType}-${serverDetails.id} failed: ${error}`);
            }
            setProgress(100);
        });
    }

    return (
        <React.Fragment>
            {!createOpened && <Button variant={"contained"} color="primary" onClick={handleClickOpen}>
                Start {serverDetails.serverType}
            </Button>
            }
            <Dialog
                fullWidth={true}
                maxWidth={"lg"}
                open={isOpen}
                onClose={handleClose}
                aria-labelledby={`Starting ${serverDetails.serverType}`}
            >
                <DialogTitle id="dialog-title">Starting {serverDetails.serverType}</DialogTitle>
                <DialogContent dividers>
                    <Grid container
                        spacing={0}
                        direction="row"
                        justify="space-between"
                        alignItems="stretch">
                        <Grid item>
                            <DialogContentText className={classes.dialogText}>
                                {serverDetails.serverType} is being started. Progress:
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
                        onProgress={setProgress}
                        onSocketConnect={handleSocketConnect}
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
