import {Typography} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Error from "@material-ui/icons/Error";
import * as React from "react";
import {useServerCardStyles} from "./ServerCardStyles";

export interface ErroneousServerCardProps {
    serverId: string;
    error: string;
}

export default function ErroneousServerCard(props: ErroneousServerCardProps) {
    const classes = useServerCardStyles(props);
    const {serverId, error} = props;

    return (
        <Card className={classes.paper}>
            <CardHeader className={classes.cardHeader}
                        avatar={<Avatar aria-label={serverId}/>}
                        title="Server Status"
                        subheader={serverId}
            />
            <CardContent>
                <Error color={"error"} />
                <Typography>
                    {error}
                </Typography>
            </CardContent>
        </Card>
    );
}
