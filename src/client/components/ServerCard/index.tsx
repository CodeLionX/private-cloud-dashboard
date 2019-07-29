import useAxios from "axios-hooks";
import * as React from "react";
import ServerState from "../../../shared/ServerState";
import ErroneousServerCard from "./ErroneousServerCard";
import FilledServerCard from "./FilledServerCard";
import LoadingServerCard from "./LoadingServerCard";

export interface ServerCardProps {
    serverId: string;
}

export default function ServerCard(props: ServerCardProps) {
    const {serverId} = props;

    const [{data, loading, error}] = useAxios<ServerState>(`/api/server/${serverId}`);

    if (loading) {
        return <LoadingServerCard serverId={serverId}/>;
    }
    if (error) {
        return <ErroneousServerCard serverId={serverId} error={error.toString()}/>;
    }
    return <FilledServerCard serverState={data}/>;
}
