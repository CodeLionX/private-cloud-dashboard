import axios from "axios";
import useAxios from "axios-hooks";
import * as React from "react";
import { useState } from "react";
import ServerState from "../../../shared/ServerState";
import ErroneousServerCard from "./ErroneousServerCard";
import FilledServerCard from "./FilledServerCard";
import LoadingServerCard from "./LoadingServerCard";
import TerminalDialog from "../TerminalDialog";
import ServerDetails from "../../../shared/ServerDetails";

type ActionType = "START" | "STOP" | null;

export interface ServerCardProps {
    serverId: string;
}

export default function ServerCard(props: ServerCardProps) {
    const { serverId } = props;

    const [actionType, setActionType] = useState<ActionType>(null)
    const [{ data, loading, error }, refetch] = useAxios<ServerState>(`/api/server/${serverId}`);

    async function handleDialogOpen() {
        if (actionType === "START") {
            await axios.post("/api/start-server", {
                serverId: data.id
            });
        } else if (actionType === "STOP") {
            await axios.post("/api/stop-server", {
                serverId: data.id
            })
        }
    }
    function handleDialogClose() {
        setActionType(null);
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
            onStartClick={() => {
                setActionType("START");
                console.info(`Request to start ${JSON.stringify(data)}`);
            }}
            onStopClick={() => {
                setActionType("STOP");
                console.info(`Request to stop ${JSON.stringify(data)}`);
            }}
        />
        {actionType && <TerminalDialog
            serverDetails={data}
            createOpened={true}
            onSocketOpen={handleDialogOpen}
            onClose={handleDialogClose} />}
    </>);
}
