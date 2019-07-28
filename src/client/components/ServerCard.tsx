import {createStyles, IconButton, Theme, Typography} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import * as React from "react";

type ServerType = "instance" | "minecraft server";

interface ServerCardProps {
    serverType: ServerType;
    statusText: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: "center",
        },
        avatar: {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.default
        },
        cardHeader: {
            textAlign: "left"
        },
        cardMedia: {
            height: 0,
            paddingTop: "56.25%", // 16:9
        },
    }),
);

const cardDetails = {
    "instance": {
        avatar: "I",
        title: "GCP Instance",
        description: "vpn-server",
        imageUrl: "/assets/images/gcp-instance.png"
    },
    "minecraft server": {
        avatar: "MS",
        title: "Minecraft Server",
        description: "minecraft",
        imageUrl: "/assets/images/minecraft-cover.jpg"
    }
};

export default function ServerCard(props: ServerCardProps) {
    const classes = useStyles(props);
    const {statusText, serverType} = props;
    const {avatar, title, description, imageUrl} = cardDetails[serverType];

    return (
        <Card className={classes.paper}>
            <CardHeader className={classes.cardHeader}
                        avatar={
                            <Avatar aria-label={serverType} className={classes.avatar}>
                                {avatar}
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon/>
                            </IconButton>
                        }
                        title={`${title} Status`}
                        subheader={description}
            />
            <CardMedia
                className={classes.cardMedia}
                image={imageUrl}
                title={title}
            />
            <CardContent>
                <Typography>
                    {statusText}
                </Typography>
            </CardContent>
        </Card>
    );
}
