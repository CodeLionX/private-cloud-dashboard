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

    router.post("/start-minecraft-server", (req, res) => {
        const sessionId: string = req.session.id;
        const room: Namespace = socketServer.in("/priv/" + sessionId);
        const { instanceId, serverIp } = req.body;

        logger.info(`Received request to start minecraft server ${instanceId} on ${serverIp}`);
        let progress = 10;
        room.emit("progress", progress);
        const [stdout, stderr] = ServerManager.testStreaming(instanceId);
        const stream = concatStreams([stdout, stderr]);
        stream.on("data", (data) => {
            data.toString()
                .split(/(\r?\n)/g)
                .map((line: string) => line.trimRight())
                .filter((line: string) => !!line)
                .forEach((line: string) => {
                    if(progress < 85) {
                        progress += 5;
                        room.emit("progress", progress);
                    }
                    room.emit("terminal-data", line);
                });
        });
        stream.on("end", () => {
            logger.info("streamed data!");
            room.emit("progress", 100);
            room.emit("end");
        });
        res.sendStatus(200);
    });

    router.get("/", (req, res) => {
        const sessionId: string = req.session.id;
        const room: string = "/priv/" + req.session.id;

        logger.info(`Request to /api in session ${sessionId}`);
        logger.info(`Sending status to client in room ${room}`);
        socketServer
            .in(room)
            .emit("status", { msg: "/api requested" });
        res.send("Hello world!");
    });

    return router;
};
