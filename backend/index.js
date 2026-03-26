import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import logger from './util/logger.js';
import { getPrograms, getOneProgram, createProgram, updateProgram, deleteProgram } from './controller/programController.js';
import playersRouter from './routes/sports_routes/players.js';
import teamsRouter from './routes/sports_routes/teams.js';
import gamesRouter from './routes/sports_routes/games.js';
import statsRouter from './routes/sports_routes/player_stats.js';
import profilesRouter from './routes/sports_routes/player_profiles.js';
import leagueRouter from './routes/sports_routes/league.js';
import authRouter from './routes/auth/routes.js';
import productsRouter from './routes/ecommerce/products.js';
import ordersRouter from './routes/ecommerce/orders.js';
import { mockPaymentCallback } from './controller/mockPayment.js';
import featuresRouter from './routes/features.js';
import adminRouter from './routes/admin.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: false
}));

// Logging Middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Test Route
app.get('/', (req, res) => {
    res.send('Server is up and running');
});

// Routes
app.get('/api/programs', getPrograms);
app.get('/api/programs/:id', getOneProgram);
app.post('/api/programs', createProgram);
app.put('/api/programs/:id', updateProgram);
app.delete('/api/programs/:id', deleteProgram);


app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/games', gamesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/leagues', leagueRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/features', featuresRouter);
app.use('/api/admin', adminRouter);
app.post('/api/payments/mock-callback', mockPaymentCallback);




import errorHandler from './middleware/errorHandler.js';

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        logger.info('Connected to MongoDB');
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error('Database connection error:', err);
    });

// Global Error Handler (Must be last)
app.use(errorHandler);
