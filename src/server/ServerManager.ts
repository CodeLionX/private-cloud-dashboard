import {exec, execSync} from "child_process";
import {Logger} from "winston";
import GCloudDescribeResult from "../shared/GCloudDescribeResult";
import ServerState from "../shared/ServerState";
import {getLogger} from "./logger";

const logger: Logger = getLogger("ServerManager");

const describeCommand = (instanceId: string) =>
    `gcloud compute instances describe ${instanceId} --zone europe-west3-c --format json`;

const stopCommand = (instanceId: string) =>
    `gcloud compute instances stop ${instanceId} --zone europe-west3-c`;

const startCommand = (instanceId: string) =>
    `gcloud compute instances start ${instanceId} --zone europe-west3-c`;

const testDescribeCommand = (instanceId: string) => `cat src/test-describe-${instanceId}.json`;

const checkMinecraftCommand = (ip: string) => `python src/check-minecraft.py -H ${ip} -p 25565`;

export const ServerManager = {
    startInstance: (instanceId: string) => {
        const command = startCommand(instanceId);
        logger.info(`Starting instance ${instanceId} with command: '${command}'`);
        // run command
        return true;
    },
    stopInstance: (instanceId: string) => {
        const command = stopCommand(instanceId);
        logger.info(`Stopping instance ${instanceId} with command: '${command}'`);
        // run command
        return true;
    },
    describeInstance: (instanceId: string) => {
        // const command = statusCommand(instanceId);
        const command = testDescribeCommand(instanceId);
        logger.info(`Getting status from instance ${instanceId} with command: '${command}'`);
        const stdout = execSync(command).toString();
        const status = JSON.parse(stdout) as GCloudDescribeResult;
        const result: ServerState = {
            id: status.id,
            name: status.name,
            serverType: "instance",
            healthy: status.status === "RUNNING",
            statusText: `Instance is ${status.status}`
        };
        return result;
    },
    checkMinecraftStatus: (ip: string) => {
        const command = checkMinecraftCommand(ip);
        logger.info(`Getting status of minecraft server with ${ip} with command: '${command}'`);
        let healthy: boolean;
        let message: string;
        try {
            healthy = true;
            message = execSync(command).toString();
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
    testStreaming: (instanceId: string) => {
        const command = `cat src/test-describe-minecraft.json`;
        const process = exec(command);
        return process.stdout;
    }
};
