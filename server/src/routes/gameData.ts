import { FastifyInstance } from 'fastify';
import pool from '../db';

export async function gameDataRoutes(fastify: FastifyInstance) {
  // Get NPCs
  fastify.get('/game/npcs', async () => {
    const result = await pool.query('SELECT * FROM npcs LIMIT 50');
    return result.rows;
  });

  // Get enemies
  fastify.get('/game/enemies', async () => {
    const result = await pool.query('SELECT * FROM enemies');
    return result.rows;
  });

  // Get items
  fastify.get('/game/items', async () => {
    const result = await pool.query('SELECT * FROM items');
    return result.rows;
  });
}
