import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, {Application, RequestHandler} from "express";
import session from "express-session";
import * as http from "http";
import {Server} from "http";
import path from "path";
import socketio from "socket.io";
import {api} from "./api";
import {logger} from "./logger";

// configuration and settings
dotenv.config();
const environment: string = process.env.NODE_ENV;
const host: string = process.env.SERVER_IP; // host ip to bind to
const port: number = parseInt(process.env.SERVER_PORT, 10); // port to listen
const sessionSecret: string = process.env.SESSION_SECRET;

const pathToStatic: string = path.join(process.cwd(), "dist", "static");
logger.info(`Serving static files from ${pathToStatic}`);

// server definition
const sessionMiddleware: RequestHandler = session({
    resave: false,
    saveUninitialized: true,
    secret: sessionSecret,
});
const app: Application = express();

app.use(sessionMiddleware);
app.use("/", express.static(pathToStatic));
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
});

// route handlers for API
app.use("/api", api(socketServer));

// start server
httpServer.listen(port, host, () => {
    logger.info(`server started at http://${host}:${port}`);
});
