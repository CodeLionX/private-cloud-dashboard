import {IconButton, Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Error from "@material-ui/icons/Error";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";
import ServerState from "../../../shared/ServerState";
import {HealthyAvatar, UnhealthyAvatar, useFilledServerCardStyles} from "./ServerCardStyles";

export interface FilledServerCardProps {
    serverState: ServerState;
}

const cardDetails = {
    "instance": {
        avatar: "I",
        title: "GCP Instance",
        imageUrl: "/assets/images/gcp-instance.png"
    },
    "minecraft server": {
        avatar: "MS",
        title: "Minecraft Server",
        imageUrl: "/assets/images/minecraft-cover.jpg"
    },
    "default": {
        avatar: "",
        title: "Server",
        imageUrl: ""
    },
};

export default function FilledServerCard(props: FilledServerCardProps) {
    const classes = useFilledServerCardStyles(props);
    const {statusText, healthy, serverType, name} = props.serverState;
    const {avatar, title, imageUrl} = cardDetails[serverType || "default"];

    return (
        <Card className={classes.paper}>
            <CardHeader className={classes.cardHeader}
                        avatar={
                            healthy && <HealthyAvatar aria-label={serverType}>{avatar}</HealthyAvatar>
                            || <UnhealthyAvatar aria-label={serverType}>{avatar}</UnhealthyAvatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon/>
                            </IconButton>
                        }
                        title={`${title} Status`}
                        subheader={name}
            />
            {imageUrl && <CardMedia
                className={classes.cardMedia}
                image={imageUrl}
                title={title}
            />}
            <CardContent>
                {healthy && <CheckCircle color={"inherit"} /> || <Error color={"error"} />}
                <Typography>
                    {statusText}
                </Typography>
            </CardContent>
        </Card>
    );
}
