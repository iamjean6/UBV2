import pool from '../pgdb/db.js';
import logger from '../util/logger.js';

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const stats = await Promise.all([
            pool.query('SELECT COUNT(*) FROM sports.teams'),
            pool.query('SELECT COUNT(*) FROM sports.players'),
            pool.query("SELECT COUNT(*) FROM sports.games WHERE status = 'final'"),
            pool.query('SELECT SUM(stock_quantity) as total_stock FROM ecommerce.product_variants')
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                teamCount: parseInt(stats[0].rows[0].count),
                playerCount: parseInt(stats[1].rows[0].count),
                gamesPlayed: parseInt(stats[2].rows[0].count),
                totalStock: parseInt(stats[3].rows[0].total_stock || 0)
            }
        });
    } catch (err) {
        logger.error('Error fetching dashboard stats:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Get Player Stats Summary (Leaders & Table)
export const getPlayerStatsSummary = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.id,
                p.first_name,
                p.last_name,
                p.image_url,
                COUNT(s.id) as games_played,
                SUM(s.points) as total_points,
                SUM(s.rebounds) as total_rebounds,
                SUM(s.assists) as total_assists,
                SUM(s.steals) as total_steals,
                SUM(s.blocks) as total_blocks,
                SUM(s.turnovers) as total_turnovers,
                SUM(s.fg_made) as total_fg_made,
                SUM(s.fg_attempts) as total_fg_attempts,
                SUM(s.three_pt_made) as total_3p_made,
                SUM(s.three_pt_attempts) as total_3p_attempts,
                SUM(s.ft_made) as total_ft_made,
                SUM(s.ft_attempts) as total_ft_attempts,
                AVG(s.points)::numeric(10,1) as ppg,
                AVG(s.rebounds)::numeric(10,1) as rpg,
                AVG(s.assists)::numeric(10,1) as apg
            FROM sports.players p
            LEFT JOIN sports.player_game_stats s ON p.id = s.player_id
            GROUP BY p.id
        `;
        
        const result = await pool.query(query);
        const players = result.rows.map(p => {
            const fg_pct = p.total_fg_attempts > 0 ? (p.total_fg_made / p.total_fg_attempts * 100).toFixed(1) : '0.0';
            const three_p_pct = p.total_3p_attempts > 0 ? (p.total_3p_made / p.total_3p_attempts * 100).toFixed(1) : '0.0';
            const ft_pct = p.total_ft_attempts > 0 ? (p.total_ft_made / p.total_ft_attempts * 100).toFixed(1) : '0.0';
            
            // Efficiency calculation: (PTS + REB + AST + STL + BLK) - ((FGA - FGM) + (FTA - FTM) + TOV)
            const eff = (
                Number(p.total_points) + 
                Number(p.total_rebounds) + 
                Number(p.total_assists) + 
                Number(p.total_steals) + 
                Number(p.total_blocks)
            ) - (
                (Number(p.total_fg_attempts) - Number(p.total_fg_made)) + 
                (Number(p.total_ft_attempts) - Number(p.total_ft_made)) + 
                Number(p.total_turnovers)
            );

            return {
                ...p,
                fg_pct,
                three_p_pct,
                ft_pct,
                efficiency: eff
            };
        });

        // Calculate Leaders
        const leaders = {
            leadingScorer: [...players].sort((a, b) => b.ppg - a.ppg)[0],
            leadingRebounder: [...players].sort((a, b) => b.rpg - a.rpg)[0],
            leadingPasser: [...players].sort((a, b) => b.apg - a.apg)[0],
            ftShooter: [...players].sort((a, b) => b.ft_pct - a.ft_pct)[0],
            highestEff: [...players].sort((a, b) => b.efficiency - a.efficiency)[0],
            threePtShooter: [...players].sort((a, b) => b.three_p_pct - a.three_p_pct)[0],
            highestFGPct: [...players].sort((a, b) => b.fg_pct - a.fg_pct)[0]
        };

        res.status(200).json({
            status: 'success',
            data: {
                leaders,
                players
            }
        });
    } catch (err) {
        logger.error('Error fetching player stats summary:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Get Admin Activities (Superadmin only)
export const getAdminActivities = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM auth.admin_activities 
            ORDER BY created_at DESC 
            LIMIT 50
        `);
        res.status(200).json({
            status: 'success',
            data: result.rows
        });
    } catch (err) {
        logger.error('Error fetching admin activities:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
// Get System Vitals (Superadmin only)
export const getSystemVitals = async (req, res) => {
    try {
        const start = Date.now();
        await pool.query('SELECT 1');
        const latency = Date.now() - start;

        const memoryUsage = process.memoryUsage();
        
        res.status(200).json({
            status: 'success',
            data: {
                database: 'Connected',
                latency: `${latency}ms`,
                uptime: `${Math.floor(process.uptime() / 60)} mins`,
                memory: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
            }
        });
    } catch (err) {
        logger.error('Error fetching system vitals:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
