import {Request, Response, Router} from "express";
import socketio from "socket.io";
import {logger} from "./logger";

export const api = (socketServer: socketio.Server) => {
    const router: Router = Router();

    router.get("/", (req, res) => {
        const sessionId: string = req.session.id;

        logger.info(`Request to /api in session ${sessionId}`);
        socketServer
            .in("/priv" + req.session.id)
            .emit("status", "connected");
        res.send("Hello world!");
    });
    return router;
};
