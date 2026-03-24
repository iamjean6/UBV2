export const CacheKeys = {
  USER_DATA: "user_data",
  USER_PROFILE: "user_profile",
  USER_SETTINGS: "user_settings",
  PROGRAMS_ALL: "programs:all",
  PROGRAM_DETAIL: "programs:detail",
  PLAYERS_ALL: "players:all",
  PLAYER_DETAIL: "players:detail",
  TEAMS_ALL: "teams:all",
  TEAM_DETAIL: "teams:detail",
  GAMES_ALL: "games:all",
  GAME_DETAIL: "games:detail",
  STATS_ALL: "stats:all",
  STATS_DETAIL: "stats:detail",
  TEAM_STATS_ALL: "team_stats:all",
  TEAM_STATS_DETAIL: "team_stats:detail",
  PROFILES_ALL: "profiles:all",
  PROFILE_DETAIL: "profiles:detail",
  LEAGUES_ALL: "leagues:all",
  LEAGUE_DETAIL: "leagues:detail",
  PRODUCTS_ALL: "products:all",
  PRODUCT_DETAIL: "products:detail",
  PLAYER_AVERAGES: "player_averages",
  FEATURES_ALL: "features:all",
  FEATURE_DETAIL: "features:detail",
  FEATURE_LIKES: "features:likes",
};

function getCacheKey(key, userId) {
  return `${key}:${userId}`;
}

export function getUserDataKey(userId) {
  return getCacheKey(CacheKeys.USER_DATA, userId);
}