import express from 'express'
import pool from '../../pgdb/db.js'
import cache from '../../cache/cache.js'
import { v4 as uuidv4 } from 'uuid'
import { putObject } from '../../util/putObject.js'
import { deleteObject } from '../../util/deleteObject.js'
import { protectAdminRoute } from '../../middleware/authMiddleware.js'
import { logAdminActivity } from '../../middleware/adminActivityLogger.js'
import sharp from 'sharp'
import logger from '../../util/logger.js';

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const cachedTeams = await cache.fetchTeams();
        if (cachedTeams) {
            return res.status(200).json({
                status: 'success',
                data: cachedTeams
            });
        }
        const result = await pool.query('SELECT * FROM sports.teams ORDER BY id DESC');
        await cache.saveTeams(result.rows);
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        logger.error('Error fetching teams:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching teams'
        });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cachedTeam = await cache.fetchTeamDetail(id);
        if (cachedTeam) {
            return res.status(200).json({
                status: 'success',
                data: cachedTeam
            });
        }
        const result = await pool.query('SELECT * FROM sports.teams WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Team not found' });
        }
        await cache.saveTeamDetail(id, result.rows[0]);
        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        logger.error('Error fetching team detail:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while fetching team detail'
        });
    }
});

router.post('/', protectAdminRoute, logAdminActivity('CREATE_TEAM', 'Sports'), async (req, res) => {
    try {
        const { name, city } = req.body;
        const files = req.files || {};
        let final_logo_url = req.body.logo_url || null;

        if (files.logo) {
            const fileName = `teams/logos/${uuidv4()}.webp`;
            const optimized = await sharp(files.logo.data)
                .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp({ quality: 80 })
                .toBuffer();
            const upload = await putObject(optimized, fileName, 'image/webp');
            if (upload) final_logo_url = upload.url;
        }

        const result = await pool.query(
            'INSERT INTO sports.teams (name, city, logo_url) VALUES ($1, $2, $3) RETURNING *',
            [name, city, final_logo_url]
        )
        await cache.invalidateTeamsCache();
        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        })
    } catch (err) {
        logger.error('Error creating teams:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while creating team'
        })
    }
})

router.put('/:id', protectAdminRoute, logAdminActivity('UPDATE_TEAM', 'Sports'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city } = req.body;

        const currentTeam = await pool.query('SELECT logo_url FROM sports.teams WHERE id = $1', [id]);
        if (currentTeam.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Team not found' });
        }

        const files = req.files || {};
        let final_logo_url = req.body.logo_url || currentTeam.rows[0].logo_url;

        if (files.logo) {
            // Delete old logo if it exists
            if (currentTeam.rows[0].logo_url) {
                const oldKey = currentTeam.rows[0].logo_url.split('.com/')[1];
                await deleteObject(oldKey);
            }
            const fileName = `teams/logos/${uuidv4()}.webp`;
            const optimized = await sharp(files.logo.data)
                .resize(400, 400, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp({ quality: 80 })
                .toBuffer();
            const upload = await putObject(optimized, fileName, 'image/webp');
            if (upload) final_logo_url = upload.url;
        }

        const result = await pool.query(
            'UPDATE sports.teams SET name = $1, city = $2, logo_url = $3 WHERE id = $4 RETURNING *',
            [name, city, final_logo_url, id]
        )
        await cache.invalidateTeamsCache(id);
        res.status(200).json({
            status: "success",
            data: result.rows[0]
        })
    } catch (err) {
        logger.error('Error updating team:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while updating team'
        });
    }
})

router.delete('/:id', protectAdminRoute, logAdminActivity('DELETE_TEAM', 'Sports'), async (req, res) => {
    try {
        const { id } = req.params;

        // Clean up S3 logo
        const team = await pool.query('SELECT logo_url FROM sports.teams WHERE id = $1', [id]);
        if (team.rows.length > 0 && team.rows[0].logo_url) {
            const key = team.rows[0].logo_url.split('.com/')[1];
            await deleteObject(key);
        }

        const result = await pool.query(
            'DELETE FROM sports.teams WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Team not found"
            })
        }
        await cache.invalidateTeamsCache(id);
        res.status(200).json({
            status: "success",
            message: "Team deleted successfully"
        })
    } catch (err) {
        logger.error('Error deleting team:', err);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error while deleting team'
        });
    }
})

export default router;
