import { createClient } from "redis";
import dotenv from "dotenv";
import logger from "../util/logger.js";
dotenv.config();

const url = process.env.REDIS_URL || `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const client = createClient({
    url: url,
    socket: {
        // Essential for TLS if URL starts with rediss://
        tls: url.startsWith('rediss://'),
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000)
    }
});

client.on("connect", () => logger.info("Redis client connecting"));
client.on("ready", () => logger.info("Redis client ready"));
client.on("error", (err) => logger.error("Redis client error", err));
client.on("end", () => logger.info("Redis client disconnected"));
client.on("reconnecting", () => logger.info("Redis client reconnecting"));



async function connect() {
    try {
        await client.connect();
    } catch (err) {
        logger.error("Error connecting to Redis:", err);
        setTimeout(connect, 5000)
    }
}
connect()

process.on("SIGINT", async () => {
    await client.disconnect()
})

export default client;