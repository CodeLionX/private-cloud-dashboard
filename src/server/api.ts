import {Request, Response, Router} from "express";
import socketio from "socket.io";

export const api = (socketServer: socketio.Server) => {
    const router: Router = Router();

    router.get("/", (req, res) => {
        console.log(`Request to /api in session ${req.session.id}`);
        res.send("Hello world!");
    });
    return router;
};
