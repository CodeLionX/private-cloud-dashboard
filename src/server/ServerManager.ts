import {exec, execSync} from "child_process";
import util from "util";
import {Logger} from "winston";
import GCloudDescribeResult from "../shared/GCloudDescribeResult";
import ServerState from "../shared/ServerState";
import {getLogger} from "./logger";

const pExec = util.promisify(exec);

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
    describeInstance: async (instanceId: string) => {
        const command = describeCommand(instanceId);
        logger.info(`Getting status from instance ${instanceId} with command: '${command}'`);
        const {stdout} = await pExec(command);
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
            const {stdout, stderr} = await pExec(command);
            message = stdout.toString();
            const errorMessage = stderr.toString();
            if(errorMessage) {
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
    testStreaming: (instanceId: string) => {
        const command = `bash /home/sebastian.schmidl/management/start-server.sh`;
        const process = exec(command);
        return [process.stdout, process.stderr];
    }
};
