import express from 'express'
import pool from '../../pgdb/db.js'
import cache from '../../cache/cache.js'
import logger from '../../util/logger.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const cachedLeagues = await cache.fetchLeagues();
        if (cachedLeagues) {
            return res.status(200).json({
                status: 'success',
                data: cachedLeagues
            });
        }
        const result = await pool.query('SELECT * FROM sports.leagues ORDER BY id DESC');
        await cache.saveLeagues(result.rows);
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        logger.error('Error fetching leagues:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching leagues'
        });
    }
})

router.post('/', async (req, res) => {
    try {
        const { name, season, created_at } = req.body;
        const result = await pool.query(
            'INSERT INTO sports.leagues (name, season, created_at) VALUES ($1, $2, $3) RETURNING *',
            [name, season, created_at]
        )
        await cache.invalidateLeaguesCache();
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        })
    } catch (err) {
        logger.error('Error creating league:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while creating league'
        })
    }
})
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, season, created_at } = req.body;
        const result = await pool.query(
            'UPDATE sports.leagues SET name = $1, season = $2, created_at = $3 WHERE id = $4 RETURNING *',
            [name, season, created_at, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "League not found"
            })
        }
        await cache.invalidateLeaguesCache(id);
        res.status(200).json({
            status: "success",
            data: result.rows[0]
        })
    } catch (err) {
        logger.error('Error updating league:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while updating league'
        });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM sports.leagues WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "League not found"
            })
        }
        await cache.invalidateLeaguesCache(id);
        res.status(200).json({
            status: "success",
            message: "League deleted successfully"
        })
    } catch (err) {
        logger.error('Error deleting league:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while deleting league'
        });
    }
})

export default router;