import express from 'express';
import pool from '../../pgdb/db.js';
import cache from '../../cache/cache.js';
import { protectAdminRoute } from '../../middleware/authMiddleware.js';
import { logAdminActivity } from '../../middleware/adminActivityLogger.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const cachedGames = await cache.fetchGames();
        if (cachedGames) {
            console.log("Games retrieved from cache");
            return res.status(200).json({
                "status": "success",
                "data": cachedGames
            });
        }

        const queryText = `
            SELECT g.*, 
                   ht.name as home_team_name, ht.logo_url as home_team_logo,
                   at.name as away_team_name, at.logo_url as away_team_logo,
                   l.name as league_name
            FROM sports.games g
            JOIN sports.teams ht ON g.home_team_id = ht.id
            JOIN sports.teams at ON g.away_team_id = at.id
            LEFT JOIN sports.leagues l ON g.league_id = l.id
            ORDER BY g.game_date DESC
        `;
        const result = await pool.query(queryText);
        await cache.saveGames(result.rows);
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching games:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching games'
        });
    }
});

// GET one game
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cachedGame = await cache.fetchGameDetail(id);
        if (cachedGame) {

            return res.status(200).json({
                "status": "success",
                "data": cachedGame
            });
        }
        const queryText = `
            SELECT g.*, 
                   ht.name as home_team_name, ht.logo_url as home_team_logo,
                   at.name as away_team_name, at.logo_url as away_team_logo,
                   l.name as league_name
            FROM sports.games g
            JOIN sports.teams ht ON g.home_team_id = ht.id
            JOIN sports.teams at ON g.away_team_id = at.id
            LEFT JOIN sports.leagues l ON g.league_id = l.id
            WHERE g.id = $1
        `;
        const result = await pool.query(queryText, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Game not found' });
        }
        await cache.saveGameDetail(id, result.rows[0]);
        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error fetching game detail:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching game detail'
        });
    }
});

// CREATE game
router.post('/', protectAdminRoute, logAdminActivity('CREATE_GAME', 'Sports'), async (req, res) => {
    try {

        const { home_team_id, away_team_id, venue, city, game_date, status, home_score, away_score, league_id, our_team } = req.body;
        const queryText = `
            INSERT INTO sports.games (home_team_id, away_team_id, venue, city, game_date, status, home_score, away_score, league_id, our_team)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        const values = [home_team_id, away_team_id, venue, city, game_date, status || 'UPCOMING', home_score || 0, away_score || 0, league_id, our_team];
        const result = await pool.query(queryText, values);
        await cache.invalidateGamesCache();
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating game:', err);

        res.status(500).json({
            status: 'error',
            message: 'Internal server error while creating game'
        });
    }
});

// UPDATE game
router.put('/:id', protectAdminRoute, logAdminActivity('UPDATE_GAME', 'Sports'), async (req, res) => {
    try {
        const { id } = req.params;
        const { home_team_id, away_team_id, venue, city, game_date, status, home_score, away_score, league_id, our_team } = req.body;
        const queryText = `
            UPDATE sports.games 
            SET home_team_id = $1, away_team_id = $2, venue = $3, city = $4, game_date = $5, status = $6, home_score = $7, away_score = $8, league_id = $9, our_team = $10
            WHERE id = $11
            RETURNING *
        `;
        const values = [home_team_id, away_team_id, venue, city, game_date, status, home_score, away_score, league_id, our_team, id];
        const result = await pool.query(queryText, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Game not found' });
        }
        await cache.invalidateGamesCache(id);
        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating game:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while updating game'
        });
    }
});

// DELETE game
router.delete('/:id', protectAdminRoute, logAdminActivity('DELETE_GAME', 'Sports'), async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM sports.games WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Game not found' });
        }
        await cache.invalidateGamesCache(id)
        res.status(200).json({
            status: 'success',
            message: 'Game deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting game:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while deleting game'
        });
    }
});

export default router;
