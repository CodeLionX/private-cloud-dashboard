import {Router} from "express";
import socketio, {Namespace} from "socket.io";
import concatStreams from "../shared/concatStreams";
import ServerState from "../shared/ServerState";
import {config} from "./config";
import {logger} from "./logger";
import {ServerManager} from "./ServerManager";

export const api = (socketServer: socketio.Server) => {
    const router: Router = Router();

    router.get("/servers", (req, res) => {
        const servers = [
            ...config.instanceIds,
            ...config.minecraftIds
        ];
        res.contentType("application/json");
        res.send(servers);
    });

    router.get("/server/:id", async (req, res) => {
        const serverId = req.params.id;
        let serverState: ServerState;
        if (config.instanceIds.includes(serverId)) {
            serverState = await ServerManager.describeInstance(serverId);
        } else if (config.minecraftIds.includes(serverId)) {
            serverState = await ServerManager.checkMinecraftStatus(serverId);
        } else {
            res.sendStatus(404);
            res.send();
            return;
        }

        res.contentType("application/json");
        res.send(serverState);
    });

    router.post("/start-server", (req, res) => {
        const sessionId: string = req.session.id;
        const room: Namespace = socketServer.in("/priv/" + sessionId);
        const { serverId } = req.body;

        logger.info(`Received request to start server with serverId ${serverId}`);

        if (config.instanceIds.includes(serverId)) {
            ServerManager.startInstanceStreaming(serverId, room);
        } else if (config.minecraftIds.includes(serverId)) {
            ServerManager.startMinecraftServerStreaming(serverId, room);
        } else {
            res.sendStatus(404);
            res.send();
            return;
        }
        res.sendStatus(200);
    });

    router.post("stop-server", (req, res) => {
        const { serverId } = req.body;

        if (serverId === "8827462774056320514") {
            res.statusCode = 403;
            res.send("Can not stop the vpn-server itself!");
            return;
        }

        const sessionId: string = req.session.id;
        const room: Namespace = socketServer.in("/priv/" + sessionId);

        logger.info(`Received request to stop server with serverId ${serverId}`);

        if (config.instanceIds.includes(serverId)) {
            ServerManager.stopInstanceStreaming(serverId, room);
        } else if (config.minecraftIds.includes(serverId)) {
            ServerManager.stopMinecraftServerStreaming(serverId, room);
        } else {
            res.sendStatus(404);
            res.send();
            return;
        }
        res.sendStatus(200);
    });

    return router;
};
