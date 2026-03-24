import pool from '../pgdb/db.js';

export const logAdminActivity = (action, module) => {
    return async (req, res, next) => {
        // We'll capture the original res.send to log after a successful operation
        const originalSend = res.send;

        res.send = function (body) {
            res.send = originalSend;
            
            // Only log successful mutation requests (POST, PUT, DELETE) or specific actions
            if (res.statusCode >= 200 && res.statusCode < 300 && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
                const adminId = req.user?.id;
                const adminUsername = req.user?.name;
                
                if (adminId && adminUsername) {
                    const targetId = req.params.id || req.body.id || null;
                    const details = {
                        method: req.method,
                        url: req.originalUrl,
                        body: req.body,
                        params: req.params,
                        query: req.query
                    };

                    pool.query(`
                        INSERT INTO auth.admin_activities (admin_id, admin_username, action, target_module, target_id, details, ip_address)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `, [adminId, adminUsername, action || req.method, module, targetId, JSON.stringify(details), req.ip])
                    .then(() => {
                        console.log(`\x1b[36m[ADMIN_ACTIVITY]\x1b[0m ${adminUsername} performed ${action || req.method} on ${module} (ID: ${targetId || 'N/A'})`);
                    })
                    .catch(err => console.error('Error logging admin activity:', err));
                }
            }
            
            return res.send(body);
        };

        next();
    };
};
