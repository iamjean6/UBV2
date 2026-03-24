import { createClient } from "redis";
import dotenv from "dotenv";
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

client.on("connect", () => console.log("Redis client connecting"));
client.on("ready", () => console.log("Redis client ready"));
client.on("error", (err) => console.error("Redis client error", err));
client.on("end", () => console.log("Redis client disconnected"));
client.on("reconnecting", () => console.log("Redis client reconnecting"));



async function connect() {
    try {
        await client.connect();
    } catch (err) {
        console.error("Error connecting to Redis:", err);
        setTimeout(connect, 5000)
    }
}
connect()

process.on("SIGINT", async () => {
    await client.disconnect()
})

export default client;