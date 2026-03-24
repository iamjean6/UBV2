import cache from "./index.js"

export async function setQuery(key, value, expireAt) {
    const json = JSON.stringify(value)
    if (expireAt) {
        const ttlMs = expireAt - Date.now()
        return await cache.set(key, json, {
            EX: Math.ceil(ttlMs / 1000) // Redis EX accepts seconds, so we convert milliseconds to seconds
        })
    }
}

export async function getQuery(key) {
    const type = await cache.type(key)
    if (type !== "string") return null

    const json = await cache.get(key)
    if (json) return JSON.parse(json)
    return null
} 