import cache from "./index.js"
import logger from "../util/logger.js"

export async function setQuery(key, value, expireAt) {
    try {
        const json = JSON.stringify(value)
        if (expireAt) {
            const ttlMs = expireAt - Date.now()
            return await cache.set(key, json, {
                EX: Math.ceil(ttlMs / 1000)
            })
        }
    } catch (err) {
        logger.warn(`Redis cache unavailable during SET for ${key}: ${err.message}`)
        return null
    }
}

export async function getQuery(key) {
    try {
        const type = await cache.type(key)
        if (type !== "string") return null

        const json = await cache.get(key)
        if (json) return JSON.parse(json)
        return null
    } catch (err) {
        logger.warn(`Redis cache bypass during GET for ${key}: ${err.message}`)
        return null
    }
} 