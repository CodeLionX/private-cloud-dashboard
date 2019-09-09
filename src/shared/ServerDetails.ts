import { ServerType } from "./ServerState";

export default interface ServerDetails {
    id: string;
    name: string;
    serverType: ServerType;
}
