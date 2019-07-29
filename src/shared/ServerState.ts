export type ServerType = "instance" | "minecraft server";

export default interface ServerState {
    id: string;
    serverType: ServerType;
    name: string;
    statusText: string;
    healthy: boolean;
}
