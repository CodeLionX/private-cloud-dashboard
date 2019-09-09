import { exec } from "child_process";
import { Namespace } from "socket.io";
import { Stream } from "stream";
import util from "util";
import { Logger } from "winston";
import concatStreams from "../shared/concatStreams";
import GCloudDescribeResult from "../shared/GCloudDescribeResult";
import ServerState from "../shared/ServerState";
import { getLogger } from "./logger";

const pExec = util.promisify(exec);

const logger: Logger = getLogger("ServerManager");

const describeCommand = (instanceId: string) =>
    `gcloud compute instances describe ${instanceId} --zone europe-west3-c --format json`;

const stopCommand = (instanceId: string) =>
    `gcloud compute instances stop ${instanceId} --zone europe-west3-c`;

const startCommand = (instanceId: string) =>
    `gcloud compute instances start ${instanceId} --zone europe-west3-c`;

const testDescribeCommand = (instanceId: string) => `cat src/test-describe-${instanceId}.json`;

const checkMinecraftCommand = (ip: string) =>
    `python src/check-minecraft.py -H ${ip} -p 25565 --motd 'What the turtle?!'`;

const startMinecraftServerCommand = "/home/sebastian.schmidl/management/start-minecraft-server.sh";
const stopMinecraftServerCommand = "/home/sebastian.schmidl/management/stop-minecraft-server.sh";

function pipeStreamsThroughWS(streams: Stream[], room: Namespace) {
    const stream = concatStreams(streams);
    let progress = 5;
    room.emit("progress", progress);
    stream.on("data", (data: any) => {
        data.toString()
            .split(/(\r?\n)/g)
            .map((line: string) => line.trimRight())
            .filter((line: string) => !!line)
            .forEach((line: string) => {
                if (progress <= 90) {
                    progress += 2;
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
}

export const ServerManager = {
    startInstanceStreaming: (instanceId: string, room: Namespace) => {
        const command = startCommand(instanceId);
        logger.info(`Starting instance ${instanceId} with command: '${command}'`);

        const process = exec(command);
        pipeStreamsThroughWS([process.stdout, process.stderr], room);
    },
    stopInstanceStreaming: (instanceId: string, room: Namespace) => {
        const command = stopCommand(instanceId);
        logger.info(`Stopping instance ${instanceId} with command: '${command}'`);

        const process = exec(command);
        pipeStreamsThroughWS([process.stdout, process.stderr], room);
    },
    describeInstance: async (instanceId: string) => {
        const command = testDescribeCommand(instanceId);
        logger.info(`Getting status from instance ${instanceId} with command: '${command}'`);
        const { stdout } = await pExec(command);
        const status = JSON.parse(stdout.toString()) as GCloudDescribeResult;
        const result: ServerState = {
            id: status.id,
            name: status.name,
            serverType: "instance",
            healthy: status.status === "RUNNING",
            statusText: `Instance is ${status.status}`
        };
        return result;
    },
    checkMinecraftStatus: async (ip: string) => {
        const command = checkMinecraftCommand(ip);
        logger.info(`Getting status of minecraft server with ${ip} with command: '${command}'`);
        let healthy: boolean;
        let message: string;

        try {
            healthy = true;
            const { stdout, stderr } = await pExec(command);
            message = stdout.toString();
            const errorMessage = stderr.toString();
            if (errorMessage) {
                healthy = false;
                message = errorMessage;
            }
        } catch (error) {
            healthy = false;
            message = error.stdout.toString();
        }
        return {
            id: ip,
            name: `minecraft-${ip}`,
            serverType: "minecraft server",
            statusText: message,
            healthy,
        } as ServerState;
    },
    startMinecraftServerStreaming: (ip: string, room: Namespace) => {
        logger.info(`Starting instance ${ip} with command: '${startMinecraftServerCommand}'`);

        const process = exec(startMinecraftServerCommand);
        pipeStreamsThroughWS([process.stdout, process.stderr], room);
    },
    stopMinecraftServerStreaming: (ip: string, room: Namespace) => {
        logger.info(`Starting instance ${ip} with command: '${stopMinecraftServerCommand}'`);

        const process = exec(stopMinecraftServerCommand);
        pipeStreamsThroughWS([process.stdout, process.stderr], room);
    },
    testStreaming: (instanceId: string) => {
        const command = `npm i`;
        const process = exec(command);
        return [process.stdout, process.stderr];
    }
};
