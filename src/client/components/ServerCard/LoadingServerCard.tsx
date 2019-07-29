import {Typography} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import {useServerCardStyles} from "./ServerCardStyles";

export interface LoadingServerCardProps {
    serverId: string;
}

export default function LoadingServerCard(props: LoadingServerCardProps) {
    const classes = useServerCardStyles(props);
    const {serverId} = props;

    return (
        <Card className={classes.paper}>
            <CardHeader className={classes.cardHeader}
                        avatar={<Avatar aria-label={serverId}/>}
                        title={`Server Status`}
                        subheader={serverId}
            />
            <CardContent>
                <CircularProgress color="primary"/>
                <Typography>Loading server status</Typography>
            </CardContent>
        </Card>
    );
}
