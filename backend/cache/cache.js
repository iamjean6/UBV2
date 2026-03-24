import { getUserDataKey, CacheKeys } from "./keys.js"
import { setQuery, getQuery } from "./query.js";
import cache from "./index.js";

async function saveTeams(teams) {
    const key = CacheKeys.TEAMS_ALL;
    return await setQuery(key, teams, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchTeams() {
    const key = CacheKeys.TEAMS_ALL;
    return await getQuery(key);
}

async function saveTeamDetail(id, team) {
    const key = `${CacheKeys.TEAM_DETAIL}:${id}`;
    return await setQuery(key, team, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchTeamDetail(id) {
    const key = `${CacheKeys.TEAM_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidateTeamsCache(id = null) {
    await cache.del(CacheKeys.TEAMS_ALL);
    if (id) {
        await cache.del(`${CacheKeys.TEAM_DETAIL}:${id}`);
    }
}

async function savePlayers(players) {
    const key = CacheKeys.PLAYERS_ALL;
    return await setQuery(key, players, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchPlayers() {
    const key = CacheKeys.PLAYERS_ALL;
    return await getQuery(key);
}

async function savePlayerDetail(id, player) {
    const key = `${CacheKeys.PLAYER_DETAIL}:${id}`;
    return await setQuery(key, player, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchPlayerDetail(id) {
    const key = `${CacheKeys.PLAYER_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidatePlayersCache(id = null) {
    await cache.del(CacheKeys.PLAYERS_ALL);
    if (id) {
        await cache.del(`${CacheKeys.PLAYER_DETAIL}:${id}`);
    }
}

async function saveGames(games) {
    const key = CacheKeys.GAMES_ALL;
    return await setQuery(key, games, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchGames() {
    const key = CacheKeys.GAMES_ALL;
    return await getQuery(key);
}

async function saveGameDetail(id, game) {
    const key = `${CacheKeys.GAME_DETAIL}:${id}`;
    return await setQuery(key, game, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchGameDetail(id) {
    const key = `${CacheKeys.GAME_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidateGamesCache(id = null) {
    await cache.del(CacheKeys.GAMES_ALL);
    if (id) {
        await cache.del(`${CacheKeys.GAME_DETAIL}:${id}`);
    }
}

async function savePlayerStats(playerStats) {
    const key = CacheKeys.STATS_ALL;
    return await setQuery(key, playerStats, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchPlayerStats() {
    const key = CacheKeys.STATS_ALL;
    return await getQuery(key);
}

async function savePlayerStatsDetail(id, playerStats) {
    const key = `${CacheKeys.STATS_DETAIL}:${id}`;
    return await setQuery(key, playerStats, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchPlayerStatsDetail(id) {
    const key = `${CacheKeys.STATS_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidatePlayerStatsCache(id = null) {
    await cache.del(CacheKeys.STATS_ALL);
    if (id) {
        await cache.del(`${CacheKeys.STATS_DETAIL}:${id}`);
    }
}

async function saveTeamStats(teamStats) {
    const key = CacheKeys.TEAM_STATS_ALL;
    return await setQuery(key, teamStats, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchTeamStats() {
    const key = CacheKeys.TEAM_STATS_ALL;
    return await getQuery(key);
}

async function saveTeamStatsDetail(id, teamStats) {
    const key = `${CacheKeys.TEAM_STATS_DETAIL}:${id}`;
    return await setQuery(key, teamStats, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchTeamStatsDetail(id) {
    const key = `${CacheKeys.TEAM_STATS_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidateTeamStatsCache(id = null) {
    await cache.del(CacheKeys.TEAM_STATS_ALL);
    if (id) {
        await cache.del(`${CacheKeys.TEAM_STATS_DETAIL}:${id}`);
    }
}

async function saveProfiles(profiles) {
    const key = CacheKeys.PROFILES_ALL;
    return await setQuery(key, profiles, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchProfiles() {
    const key = CacheKeys.PROFILES_ALL;
    return await getQuery(key);
}

async function saveProfileDetail(id, profile) {
    const key = `${CacheKeys.PROFILE_DETAIL}:${id}`;
    return await setQuery(key, profile, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchProfileDetail(id) {
    const key = `${CacheKeys.PROFILE_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidateProfilesCache(id = null) {
    await cache.del(CacheKeys.PROFILES_ALL);
    if (id) {
        await cache.del(`${CacheKeys.PROFILE_DETAIL}:${id}`);
    }
}

async function saveLeagues(leagues) {
    const key = CacheKeys.LEAGUES_ALL;
    return await setQuery(key, leagues, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchLeagues() {
    const key = CacheKeys.LEAGUES_ALL;
    return await getQuery(key);
}

async function saveLeagueDetail(id, league) {
    const key = `${CacheKeys.LEAGUE_DETAIL}:${id}`;
    return await setQuery(key, league, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchLeagueDetail(id) {
    const key = `${CacheKeys.LEAGUE_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidateLeaguesCache(id = null) {
    await cache.del(CacheKeys.LEAGUES_ALL);
    if (id) {
        await cache.del(`${CacheKeys.LEAGUE_DETAIL}:${id}`);
    }
}

async function saveUser(userId, todos) {
    const key = getUserDataKey(userId);
    return await setQuery(key, { data: todos }, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchUser(userId) {
    const key = getUserDataKey(userId);
    const result = await getQuery(key);
    if (!result) return null;
    return result.data;
}

async function deleteUser(userId) {
    const key = getUserDataKey(userId);
    return await setQuery(key, null, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function savePrograms(page, limit, programs) {
    const key = `${CacheKeys.PROGRAMS_ALL}:page:${page}:limit:${limit}`;
    return await setQuery(key, programs, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchPrograms(page, limit) {
    const key = `${CacheKeys.PROGRAMS_ALL}:page:${page}:limit:${limit}`;
    return await getQuery(key);
}

async function saveProgramDetail(id, program) {
    const key = `${CacheKeys.PROGRAM_DETAIL}:${id}`;
    return await setQuery(key, program, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchProgramDetail(id) {
    const key = `${CacheKeys.PROGRAM_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidateProgramsCache(id = null) {
    await cache.del(CacheKeys.PROGRAMS_ALL);
    if (id) {
        await cache.del(`${CacheKeys.PROGRAM_DETAIL}:${id}`);
    }
}

// --- Products Cache ---
async function saveProducts(products) {
    const key = CacheKeys.PRODUCTS_ALL;
    return await setQuery(key, products, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchProducts() {
    const key = CacheKeys.PRODUCTS_ALL;
    return await getQuery(key);
}

async function saveProductDetail(slug, product) {
    const key = `${CacheKeys.PRODUCT_DETAIL}:${slug}`;
    return await setQuery(key, product, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchProductDetail(slug) {
    const key = `${CacheKeys.PRODUCT_DETAIL}:${slug}`;
    return await getQuery(key);
}

async function invalidateProductsCache(slug = null) {
    await cache.del(CacheKeys.PRODUCTS_ALL);
    if (slug) {
        await cache.del(`${CacheKeys.PRODUCT_DETAIL}:${slug}`);
    }
}

// --- Player Averages Cache ---
async function savePlayerAverages(id, averages) {
    const key = `${CacheKeys.PLAYER_AVERAGES}:${id}`;
    return await setQuery(key, averages, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchPlayerAverages(id) {
    const key = `${CacheKeys.PLAYER_AVERAGES}:${id}`;
    return await getQuery(key);
}

async function invalidatePlayerAveragesCache(id) {
    const key = `${CacheKeys.PLAYER_AVERAGES}:${id}`;
    await cache.del(key);
}

// --- Features Cache ---
async function saveFeatures(page, limit, features) {
    const key = `${CacheKeys.FEATURES_ALL}:page:${page}:limit:${limit}`;
    return await setQuery(key, features, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchFeatures(page, limit) {
    const key = `${CacheKeys.FEATURES_ALL}:page:${page}:limit:${limit}`;
    return await getQuery(key);
}

async function saveFeatureDetail(id, feature) {
    const key = `${CacheKeys.FEATURE_DETAIL}:${id}`;
    return await setQuery(key, feature, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchFeatureDetail(id) {
    const key = `${CacheKeys.FEATURE_DETAIL}:${id}`;
    return await getQuery(key);
}

async function invalidateFeaturesCache(id = null) {
    await cache.del(CacheKeys.FEATURES_ALL);
    if (id) {
        await cache.del(`${CacheKeys.FEATURE_DETAIL}:${id}`);
        await cache.del(`${CacheKeys.FEATURE_LIKES}:${id}`);
    }
}

async function saveFeatureLikes(id, likes) {
    const key = `${CacheKeys.FEATURE_LIKES}:${id}`;
    return await setQuery(key, likes, new Date(Date.now() + Number(process.env.CONTENT_CACHE_DURATION)));
}

async function fetchFeatureLikes(id) {
    const key = `${CacheKeys.FEATURE_LIKES}:${id}`;
    return await getQuery(key);
}

export default {
    saveUser,
    fetchUser,
    deleteUser,
    savePrograms,
    fetchPrograms,
    saveProgramDetail,
    fetchProgramDetail,
    invalidateProgramsCache,
    saveTeams,
    fetchTeams,
    saveTeamDetail,
    fetchTeamDetail,
    invalidateTeamsCache,
    savePlayers,
    fetchPlayers,
    savePlayerDetail,
    fetchPlayerDetail,
    invalidatePlayersCache,
    saveGames,
    fetchGames,
    saveGameDetail,
    fetchGameDetail,
    invalidateGamesCache,
    savePlayerStats,
    fetchPlayerStats,
    savePlayerStatsDetail,
    fetchPlayerStatsDetail,
    invalidatePlayerStatsCache,
    saveTeamStats,
    fetchTeamStats,
    saveTeamStatsDetail,
    fetchTeamStatsDetail,
    invalidateTeamStatsCache,
    saveProfiles,
    fetchProfiles,
    saveProfileDetail,
    fetchProfileDetail,
    invalidateProfilesCache,
    saveLeagues,
    fetchLeagues,
    saveLeagueDetail,
    fetchLeagueDetail,
    invalidateLeaguesCache,
    saveProducts,
    fetchProducts,
    saveProductDetail,
    fetchProductDetail,
    invalidateProductsCache,
    savePlayerAverages,
    fetchPlayerAverages,
    invalidatePlayerAveragesCache,
    saveFeatures,
    fetchFeatures,
    saveFeatureDetail,
    fetchFeatureDetail,
    invalidateFeaturesCache,
    saveFeatureLikes,
    fetchFeatureLikes
}