import express from 'express';
import pool from '../../pgdb/db.js';
import { v4 as uuidv4 } from 'uuid';
import { putObject } from '../../util/putObject.js';
import { deleteObject } from '../../util/deleteObject.js';
import cache from '../../cache/cache.js';
import { protectAdminRoute } from '../../middleware/authMiddleware.js';
import { logAdminActivity } from '../../middleware/adminActivityLogger.js';
import sharp from 'sharp';
import logger from '../../util/logger.js';

const router = express.Router();


router.post('/', protectAdminRoute, logAdminActivity('CREATE_PLAYER', 'Sports'), async (req, res, next) => {
    try {
        const { first_name, last_name, team_id, jersey_number, position, height, weight_kg, age,
            nickname
        } = req.body;

        await cache.invalidatePlayersCache();

        const files = req.files || {};
        const safeNickname = nickname ? nickname : null;

        let final_image_url = req.body.image_url || null;
        let final_audio_url = req.body.intro_audio_url || null;

        if (files.image) {
            const fileName = `players/images/${uuidv4()}.webp`;
            const optimized = await sharp(files.image.data)
                .resize(600, 600, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer();
            const upload = await putObject(optimized, fileName, 'image/webp');
            if (upload) final_image_url = upload.url;
        }
        if (files.audio) {
            const fileName = `players/audio/${uuidv4()}_${files.audio.name}`;
            const upload = await putObject(files.audio.data, fileName, files.audio.mimetype);
            if (upload) final_audio_url = upload.url;
        }

        const result = await pool.query(
            'INSERT INTO sports.players (first_name, last_name, team_id, jersey_number, position, height, weight_kg, age, nickname, image_url, intro_audio_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [first_name, last_name, team_id, jersey_number, Array.isArray(position) ? position : [position], height, weight_kg, age, safeNickname, final_image_url, final_audio_url]
        );

        res.status(201).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
})


router.get('/', async (req, res, next) => {
    try {
        const cachedPlayers = await cache.fetchPlayers();
        if (cachedPlayers) {
            return res.status(200).json({
                status: 'success',
                data: cachedPlayers
            });
        }
        const queryText = `
            SELECT p.*, t.name as team_name 
            FROM sports.players p 
            LEFT JOIN sports.teams t ON p.team_id = t.id 
            ORDER BY p.id DESC
        `;
        const result = await pool.query(queryText);
        await cache.savePlayers(result.rows);
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const cachedPlayer = await cache.fetchPlayerDetail(id);
        if (cachedPlayer) {
            return res.status(200).json({
                status: 'success',
                data: cachedPlayer
            });
        }
        const result = await pool.query('SELECT * FROM sports.players WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Player not found'
            });
        }

        await cache.savePlayerDetail(id, result.rows[0]);

        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', protectAdminRoute, logAdminActivity('UPDATE_PLAYER', 'Sports'), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, team_id, jersey_number, position, height, weight_kg, age,
            nickname
        } = req.body;

        const currentPlayer = await pool.query('SELECT image_url, intro_audio_url FROM sports.players WHERE id = $1', [id]);
        if (currentPlayer.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Player not found' });
        }

        const files = req.files || {};

        const safeNickname = nickname ? nickname : null;
        let final_image_url = req.body.image_url || currentPlayer.rows[0].image_url;
        let final_audio_url = req.body.intro_audio_url || currentPlayer.rows[0].intro_audio_url;

        if (files.image) {
            if (currentPlayer.rows[0].image_url) {
                const oldKey = currentPlayer.rows[0].image_url.split('.com/')[1];
                await deleteObject(oldKey);
            }
            const fileName = `players/images/${uuidv4()}.webp`;
            const optimized = await sharp(files.image.data)
                .resize(600, 600, { fit: 'cover' })
                .webp({ quality: 80 })
                .toBuffer();
            const upload = await putObject(optimized, fileName, 'image/webp');
            if (upload) final_image_url = upload.url;
        }
        if (files.audio) {
            if (currentPlayer.rows[0].intro_audio_url) {
                const oldKey = currentPlayer.rows[0].intro_audio_url.split('.com/')[1];
                await deleteObject(oldKey);
            }
            const fileName = `players/audio/${uuidv4()}_${files.audio.name}`;
            const upload = await putObject(files.audio.data, fileName, files.audio.mimetype);
            if (upload) final_audio_url = upload.url;
        }

        const result = await pool.query(
            'UPDATE sports.players SET first_name = $1, last_name = $2, team_id = $3, jersey_number = $4, position = $5, height = $6, weight_kg = $7, age = $8, nickname = $9, image_url = $10, intro_audio_url = $11 WHERE id = $12 RETURNING *',
            [first_name, last_name, team_id, jersey_number, Array.isArray(position) ? position : [position], height, weight_kg, age, safeNickname, final_image_url, final_audio_url, id]
        );

        await cache.invalidatePlayersCache(id);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Player not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
})

router.delete('/:id', protectAdminRoute, logAdminActivity('DELETE_PLAYER', 'Sports'), async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fetch to clean up files from S3
        const player = await pool.query('SELECT image_url, intro_audio_url FROM sports.players WHERE id = $1', [id]);
        if (player.rows.length > 0) {
            if (player.rows[0].image_url) {
                const key = player.rows[0].image_url.split('.com/')[1];
                await deleteObject(key);
            }
            if (player.rows[0].intro_audio_url) {
                const key = player.rows[0].intro_audio_url.split('.com/')[1];
                await deleteObject(key);
            }
        }

        const result = await pool.query('DELETE FROM sports.players WHERE id = $1 RETURNING *', [id]);

        await cache.invalidatePlayersCache(id);

        if (result.rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Player not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Player deleted successfully'
        });
    } catch (err) {
        next(err);
    }
})

export default router;