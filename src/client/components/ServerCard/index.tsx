import useAxios from "axios-hooks";
import * as React from "react";
import { useState } from "react";
import ServerState from "../../../shared/ServerState";
import ErroneousServerCard from "./ErroneousServerCard";
import FilledServerCard from "./FilledServerCard";
import LoadingServerCard from "./LoadingServerCard";
import TerminalDialog from "../TerminalDialog";
import ServerDetails from "../../../shared/ServerDetails";

export interface ServerCardProps {
    serverId: string;
}

export default function ServerCard(props: ServerCardProps) {
    const { serverId } = props;

    const [serverDetails, setServerDetails] = useState(null);
    const [{ data, loading, error }, refetch] = useAxios<ServerState>(`/api/server/${serverId}`);

    function handleDialogClose() {
        setServerDetails(null);
        refetch();
    }

    if (loading) {
        return <LoadingServerCard serverId={serverId} />;
    }
    if (error) {
        return <ErroneousServerCard serverId={serverId} error={error.toString()} />;
    }
    return (<>
        <FilledServerCard
            serverState={data}
            onRefreshClick={refetch}
            onStartClick={(details: ServerDetails) => { setServerDetails(details); console.info(`Request to start ${JSON.stringify(details)}`); }}
            onStopClick={(details: ServerDetails) => console.info(`Request to stop ${JSON.stringify(details)}`)}
        />
        {serverDetails && <TerminalDialog serverDetails={serverDetails} createOpened={true} onClose={handleDialogClose}/>}
    </>);
}
