import express from 'express';
import pool from '../../pgdb/db.js';
import cache from '../../cache/cache.js';
import logger from '../../util/logger.js';

const router = express.Router();

// GET all stats for a specific game
router.get('/game/:game_id', async (req, res) => {
    try {
        const { game_id } = req.params;
        const cachedStats = await cache.fetchPlayerStatsDetail(game_id);
        if (cachedStats) {
            return res.status(200).json({
                status: 'success',
                data: cachedStats
            });
        }
        const queryText = `
            SELECT s.*, p.first_name, p.last_name, p.jersey_number, p.image_url
            FROM sports.player_game_stats s
            JOIN sports.players p ON s.player_id = p.id
            WHERE s.game_id = $1
        `;
        const result = await pool.query(queryText, [game_id]);
        await cache.savePlayerStatsDetail(game_id, result.rows);
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        logger.error('Error fetching game stats:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching game stats'
        });
    }
});

// GET all stats for a specific player
router.get('/player/:player_id', async (req, res) => {
    try {
        const { player_id } = req.params;
        const queryText = `
            SELECT s.*, g.game_date, g.venue, 
                   ht.name as home_team, at.name as away_team
            FROM sports.player_game_stats s
            JOIN sports.games g ON s.game_id = g.id
            JOIN sports.teams ht ON g.home_team_id = ht.id
            JOIN sports.teams at ON g.away_team_id = at.id
            WHERE s.player_id = $1
            ORDER BY g.game_date DESC
        `;
        const result = await pool.query(queryText, [player_id]);
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        logger.error('Error fetching player stats:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching player stats'
        });
    }
});

// GET player averages per league
router.get('/player/:player_id/averages', async (req, res) => {
    try {
        const { player_id } = req.params;

        // Check cache first
        const cachedAverages = await cache.fetchPlayerAverages(player_id);
        if (cachedAverages) {
            return res.status(200).json({
                status: 'success',
                data: cachedAverages
            });
        }

        const queryText = `
            SELECT 
                l.id as league_id,
                l.name as league_name,
                l.season,
                COUNT(s.game_id) as games_played,
                ROUND(AVG(s.minutes_played), 1) as avg_minutes,
                ROUND(AVG(s.points), 1) as ppg,
                ROUND(AVG(s.offensive_rebounds), 1) as orpg,
                ROUND(AVG(s.defensive_rebounds), 1) as drpg,
                ROUND(AVG(s.rebounds), 1) as rpg,
                ROUND(AVG(s.assists), 1) as apg,
                ROUND(AVG(s.steals), 1) as spg,
                ROUND(AVG(s.blocks), 1) as bpg,
                ROUND(AVG(s.turnovers), 1) as topg,
                ROUND(AVG(s.fouls), 1) as fpg,
                ROUND(AVG(s.fg_made), 1) as fgm_pg,
                ROUND(AVG(s.fg_attempts), 1) as fga_pg,
                ROUND(AVG(s.ft_made), 1) as ftm_pg,
                ROUND(AVG(s.ft_attempts), 1) as fta_pg,
                ROUND(AVG(s.three_pt_made), 1) as tpm_pg,
                ROUND(AVG(s.three_pt_attempts), 1) as tpa_pg
            FROM sports.player_game_stats s
            JOIN sports.games g ON s.game_id = g.id
            JOIN sports.leagues l ON g.league_id = l.id
            WHERE s.player_id = $1
            GROUP BY l.id, l.name, l.season
        `;
        const result = await pool.query(queryText, [player_id]);

        // Save to cache
        await cache.savePlayerAverages(player_id, result.rows);

        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        logger.error('Error calculating player averages:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while calculating player averages'
        });
    }
});

// CREATE or UPDATE stats (Upsert pattern since it's UNIQUE on game_id, player_id)
router.post('/', async (req, res) => {
    try {
        const {
            game_id, player_id, minutes_played, points, 
            offensive_rebounds, defensive_rebounds,
            assists, steals, blocks, turnovers, fouls,
            fg_made, fg_attempts, ft_made, ft_attempts, three_pt_made, three_pt_attempts
        } = req.body;

        const total_rebounds = (parseInt(offensive_rebounds) || 0) + (parseInt(defensive_rebounds) || 0);

        const queryText = `
            INSERT INTO sports.player_game_stats 
                (game_id, player_id, minutes_played, points, rebounds, offensive_rebounds, defensive_rebounds, 
                 assists, steals, blocks, turnovers, fouls,
                 fg_made, fg_attempts, ft_made, ft_attempts, three_pt_made, three_pt_attempts)
            VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            ON CONFLICT (game_id, player_id) DO UPDATE SET
                minutes_played = EXCLUDED.minutes_played,
                points = EXCLUDED.points,
                rebounds = EXCLUDED.rebounds,
                offensive_rebounds = EXCLUDED.offensive_rebounds,
                defensive_rebounds = EXCLUDED.defensive_rebounds,
                assists = EXCLUDED.assists,
                steals = EXCLUDED.steals,
                blocks = EXCLUDED.blocks,
                turnovers = EXCLUDED.turnovers,
                fouls = EXCLUDED.fouls,
                fg_made = EXCLUDED.fg_made,
                fg_attempts = EXCLUDED.fg_attempts,
                ft_made = EXCLUDED.ft_made,
                ft_attempts = EXCLUDED.ft_attempts,
                three_pt_made = EXCLUDED.three_pt_made,
                three_pt_attempts = EXCLUDED.three_pt_attempts
            RETURNING *
        `;

        const values = [
            game_id, player_id, minutes_played || 0, points || 0, total_rebounds,
            offensive_rebounds || 0, defensive_rebounds || 0,
            assists || 0, steals || 0, blocks || 0, turnovers || 0, fouls || 0,
            fg_made || 0, fg_attempts || 0, ft_made || 0, ft_attempts || 0,
            three_pt_made || 0, three_pt_attempts || 0
        ];

        const result = await pool.query(queryText, values);
        await cache.invalidatePlayerStatsCache(game_id);
        await cache.invalidatePlayerAveragesCache(player_id);
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        logger.error('Error saving player stats:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while saving player stats'
        });
    }
});

// DELETE stats
router.delete('/:game_id/:player_id', async (req, res) => {
    try {
        const { game_id, player_id } = req.params;
        const result = await pool.query(
            'DELETE FROM sports.player_game_stats WHERE game_id = $1 AND player_id = $2 RETURNING *',
            [game_id, player_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Stats not found' });
        }
        await cache.invalidatePlayerStatsCache(game_id);
        await cache.invalidatePlayerAveragesCache(player_id);
        res.status(200).json({
            status: 'success',
            message: 'Stats deleted successfully'
        });
    } catch (err) {
        logger.error('Error deleting player stats:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while deleting player stats'
        });
    }
});

export default router;
