import {Request, Response, Router} from "express";
import socketio from "socket.io";
import {logger} from "./logger";

export const api = (socketServer: socketio.Server) => {
    const router: Router = Router();

    router.get("/", (req, res) => {
        logger.info(`Request to /api in session ${req.session.id}`);
        res.send("Hello world!");
    });
    return router;
};
