import {Request, Response, Router} from "express";
import socketio from "socket.io";
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

    router.get("/server/:id", (req, res) => {
        const serverId = req.params.id;
        let serverState: ServerState;
        if (config.instanceIds.includes(serverId)) {
            serverState = ServerManager.describeInstance(serverId);
        } else if (config.minecraftIds.includes(serverId)) {
            serverState = ServerManager.checkMinecraftStatus(serverId);
        } else {
            res.sendStatus(404);
            res.send();
            return;
        }
        setTimeout( () => {
            res.contentType("application/json");
            res.send(serverState);
        }, Math.random() * 10000 + 1000);
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
