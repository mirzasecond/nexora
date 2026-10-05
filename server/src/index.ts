import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { playerRoutes } from './routes/player';
import { questRoutes } from './routes/quests';
import { gameDataRoutes } from './routes/gameData';
import { inventoryRoutes } from './routes/inventory';
import { adminRoutes } from './routes/admin';
import { runMigrations } from './migrations';

dotenv.config();

const fastify = Fastify({ logger: true });
const port = parseInt(process.env.PORT || '3001', 10);
const host = '0.0.0.0';

fastify.register(cors, { origin: '*' });
fastify.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret-key-must-be-at-least-32-chars' });

// Health check
fastify.get('/', async () => ({ message: 'NEXORA Server', status: 'online' }));

// Register routes
fastify.register(authRoutes);
fastify.register(playerRoutes);
fastify.register(questRoutes);
fastify.register(gameDataRoutes);
fastify.register(inventoryRoutes);
fastify.register(adminRoutes);

// Start server with migrations
const start = async () => {
  try {
    console.log('🔄 Running database migrations...');
    await runMigrations();
    console.log('✅ Migrations completed');

    await fastify.listen({ port, host });
    console.log(`🎮 NEXORA Server listening at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

