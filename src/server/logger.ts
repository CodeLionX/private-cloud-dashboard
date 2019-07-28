import winston from "winston";

const environment: string = process.env.NODE_ENV;

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.File({ filename: "server.log" })
    ]
});

if (environment !== "production") {
    logger.add(new winston.transports.Console({
        // simple format: `${info.level}: ${info.message} JSON.stringify({ ...rest })`
        format: winston.format.simple()
    }));
}
