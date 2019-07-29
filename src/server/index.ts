import bodyParser from "body-parser";
import express, {Application, RequestHandler} from "express";
import session from "express-session";
import * as http from "http";
import {Server} from "http";
import socketio from "socket.io";
import XTermSize from "../shared/XTermSize";
import {api} from "./api";
import {config} from "./config";
import {logger} from "./logger";

// server definition
const sessionMiddleware: RequestHandler = session({
    resave: false,
    saveUninitialized: true,
    secret: config.sessionSecret,
});
const app: Application = express();

app.use(sessionMiddleware);
app.use("/", express.static(config.pathToStatic));
logger.info(`Serving static files from ${config.pathToStatic}`);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// create the servers
const httpServer: Server = http.createServer(app);
const socketServer: socketio.Server = socketio(httpServer, { cookie: false });

// use same session handling in web socket
socketServer.use((socket, next) => {
    sessionMiddleware(socket.request, {} as any, next);
});

// handle incoming sockets
socketServer.sockets.on("connection", (socket) => {
    const sessionId: string = socket.request.session.id;
    logger.info(`Moving socket ${socket.id} to room /priv/${sessionId}`);
    socket.join("/priv/" + sessionId);
    socket.on("resize", (data: XTermSize) => {
        logger.info(`Client requests to resize to ${JSON.stringify(data)}`);
    });
});

// route handlers for API
app.use("/api", api(socketServer));

// start server
httpServer.listen(config.port, config.host, () => {
    logger.info(`server started at http://${config.host}:${config.port}`);
});
