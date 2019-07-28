import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, {Application, RequestHandler} from "express";
import session from "express-session";
import * as http from "http";
import {Server} from "http";
import path from "path";

// tslint:disable:no-console

// configuration and settings
dotenv.config();
const environment: string = process.env.NODE_ENV;
const host: string = process.env.SERVER_IP; // host ip to bind to
const port: number = parseInt(process.env.SERVER_PORT, 10); // port to listen
const sessionSecret: string = process.env.SESSION_SECRET;

// server definition
const sessionMiddleware: RequestHandler = session({
    resave: false,
    saveUninitialized: true,
    secret: sessionSecret,
});

const app: Application = express();
app.use(sessionMiddleware);

// static route to UI
app.get("/", express.static(path.join(process.cwd(), "dist", "static")));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// route handlers for API
app.get("/api", (req, res) => {
    console.log(`Request to /api in session ${req.session.id}`);
    res.send("Hello world!");
});

// start the servers
const httpServer: Server = http.createServer(app);
httpServer.listen(port, host, () => {
    console.log(`server started at http://${host}:${port}`);
});
