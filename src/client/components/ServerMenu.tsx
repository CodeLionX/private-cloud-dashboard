import * as React from "react";
import { useState, MouseEventHandler } from "react";
import { IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export interface ServerMenuProps {
    displayStart: boolean;
    displayStop: boolean;
    onRefreshClick: () => void;
    onStartClick: () => void;
    onStopClick: () => void;
};

export default function ServerMenu({ onRefreshClick, onStartClick, onStopClick, displayStart, displayStop }: ServerMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function handleStart() {
        handleClose();
        onStartClick();
    }

    function handleStop() {
        handleClose();
        onStopClick();
    }

    return (
        <div>
            <IconButton aria-label="settings" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="settings-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={onRefreshClick}>Refresh</MenuItem>
                {displayStart && <MenuItem onClick={handleStart}>Start server</MenuItem>}
                {displayStop && <MenuItem onClick={handleStop}>Stop server</MenuItem>}
            </Menu>
        </div>
    );
}