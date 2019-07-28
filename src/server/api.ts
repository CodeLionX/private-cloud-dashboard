import {Request, Response, Router} from "express";
import socketio from "socket.io";
import {logger} from "./logger";

export const api = (socketServer: socketio.Server) => {
    const router: Router = Router();

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
