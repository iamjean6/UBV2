import express from 'express';
import pool from '../../pgdb/db.js';
import cache from '../../cache/cache.js';
import logger from '../../util/logger.js';

const router = express.Router();

// GET profile by player_id
router.get('/:player_id', async (req, res) => {
    try {
        const { player_id } = req.params;
        const cachedProfile = await cache.fetchProfileDetail(player_id);
        if (cachedProfile) {
            return res.status(200).json({
                status: 'success',
                data: cachedProfile
            });
        }
        const result = await pool.query('SELECT * FROM sports.player_profiles WHERE player_id = $1', [player_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Profile not found' });
        }
        await cache.saveProfileDetail(player_id, result.rows[0]);
        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        logger.error('Error fetching player profile:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching player profile'
        });
    }
});

// UPSERT profile
router.post('/', async (req, res) => {
    try {
        const { player_id, bio, personal_life, pro_career } = req.body;
        const queryText = `
            INSERT INTO sports.player_profiles (player_id, bio, personal_life, pro_career, updated_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (player_id) DO UPDATE SET
                bio = EXCLUDED.bio,
                personal_life = EXCLUDED.personal_life,
                pro_career = EXCLUDED.pro_career,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        const result = await pool.query(queryText, [player_id, bio, personal_life, pro_career]);
        await cache.invalidateProfilesCache(player_id);
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        logger.error('Error saving player profile:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while saving player profile'
        });
    }
});

export default router;
