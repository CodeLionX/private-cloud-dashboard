import {strict} from "assert";
import dotenv from "dotenv";
import path from "path";

const assert = strict;

// configuration and settings
dotenv.config();
const environment: string = process.env.NODE_ENV;
assert(environment, "Env. variable NODE_ENV not defined!");

const host: string = process.env.SERVER_IP; // host ip to bind to
assert(host, "Env. variable SERVER_IP not defined!");

const port: number = parseInt(process.env.SERVER_PORT, 10); // port to listen
assert(port, "Env. variable SERVER_PORT not defined!");
assert(port >= 0 && port <= 65535, "Env. variable SERVER_PORT must be between 0 and 65535!");

const sessionSecret: string = process.env.SESSION_SECRET;
assert(sessionSecret, "Env. variable SESSION_SECRET is not defined!");

// default values
const pathToStatic: string = path.join(process.cwd(), "dist", "static");

const instanceIds: string[] = [
    "8827462774056320514", // vpn-server
    "1116322196404956169", // minecraft
];

const minecraftIds: string[] = [
    "10.0.0.2"
];

export const config = {
    environment,
    host,
    port,
    sessionSecret,
    pathToStatic,
    instanceIds,
    minecraftIds
};
