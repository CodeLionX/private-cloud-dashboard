import {createStyles, Theme} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import styled from "@material-ui/core/styles/styled";
import {Styles} from "@material-ui/core/styles/withStyles";
import {StylesHook} from "@material-ui/styles/makeStyles";
import {failureRed, successGreen} from "../../theme";
import {FilledServerCardProps} from "./FilledServerCard";

const commonStyles = (theme: Theme) => createStyles({
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
    },
    cardHeader: {
        textAlign: "left"
    },
});

export const useServerCardStyles: StylesHook<Styles<Theme, {}, string>> = makeStyles((theme: Theme) =>
    commonStyles(theme)
);

export const useFilledServerCardStyles: StylesHook<Styles<Theme, {}, string>> = makeStyles((theme: Theme) => ({
    ...commonStyles(theme),
    ...createStyles({
        cardMedia: {
            height: 0,
            paddingTop: "56.25%", // 16:9
            opacity: ({serverState: {healthy}}
                          :
                          FilledServerCardProps
            ) =>
                (healthy ? 1 : 0.2),
        }
    }),
}));

export const HealthyAvatar = styled(Avatar)(({theme}) => ({
    color: theme.palette.text.primary,
    backgroundColor: successGreen
}));

export const UnhealthyAvatar = styled(Avatar)(({theme}) => ({
    color: theme.palette.text.primary,
    backgroundColor: failureRed
}));
