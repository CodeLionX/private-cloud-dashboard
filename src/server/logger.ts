import winston, {Logger} from "winston";

const environment: string = process.env.NODE_ENV;

export function getLogger(name: string): Logger {
    const log = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        defaultMeta: { service: name },
        transports: [
            new winston.transports.File({ filename: "server.log" })
        ]
    });

    if (environment !== "production") {
        log.add(new winston.transports.Console({
            // simple format: `${info.level}: ${info.message} JSON.stringify({ ...rest })`
            format: winston.format.simple()
        }));
    }
    return log;
}

// default logger
export const logger: Logger = getLogger("server");
