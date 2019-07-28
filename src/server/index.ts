import dotenv from "dotenv";
import express from "express";

// configuration and settings
dotenv.config();
const host: string = process.env.SERVER_IP; // host ip to bind to
const port: number = parseInt(process.env.SERVER_PORT, 10); // port to listen

const app = express();

// route handlers
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// start the Express server
app.listen(port, host, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
