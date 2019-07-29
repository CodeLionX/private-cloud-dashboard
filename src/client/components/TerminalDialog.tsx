import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, {useState} from "react";
import TerminalDisplay from "./TerminalDisplay";

export default function TerminalDialog() {
    const [isOpen, setOpen] = useState(false);

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
                <DialogContent>
                    <DialogContentText>
                        Minecraft Server is being started. Progress:
                    </DialogContentText>
                    <TerminalDisplay instanceId={"1116322196404956169"} serverIp={"10.0.0.3"}/>
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
