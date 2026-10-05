import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPlayerByUserId } from '../services/player';
import { getPlayerAchievements, getStatistics } from '../services/achievements';
import pool from '../db';

async function authenticateAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    // In production, check admin flag in user table
    return true;
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
    return false;
  }
}

export async function adminRoutes(fastify: FastifyInstance) {
  // Get leaderboard
  fastify.get('/leaderboard', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await pool.query(
        `SELECT p.id, p.level, p.xp, u.username, s.enemies_defeated
         FROM players p
         JOIN users u ON p.user_id = u.id
         LEFT JOIN statistics s ON p.id = s.player_id
         ORDER BY p.level DESC, p.xp DESC
         LIMIT 100`
      );
      return reply.send(result.rows);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Get player achievements
  fastify.get<{ Params: { playerId: string } }>(
    '/admin/players/:playerId/achievements',
    async (request, reply) => {
      try {
        if (!(await authenticateAdmin(request, reply))) return;

        const { playerId } = request.params as { playerId: string };
        const achievements = await getPlayerAchievements(playerId);
        return reply.send(achievements);
      } catch (err: any) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'Server error' });
      }
    }
  );

  // Get player statistics
  fastify.get<{ Params: { playerId: string } }>(
    '/admin/players/:playerId/stats',
    async (request, reply) => {
      try {
        if (!(await authenticateAdmin(request, reply))) return;

        const { playerId } = request.params as { playerId: string };
        const stats = await getStatistics(playerId);
        return reply.send(stats || {});
      } catch (err: any) {
        fastify.log.error(err);
        return reply.status(500).send({ error: 'Server error' });
      }
    }
  );

  // Get all players
  fastify.get('/admin/players', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!(await authenticateAdmin(request, reply))) return;

      const result = await pool.query(
        `SELECT p.id, u.username, u.email, p.level, p.xp, p.coins, p.created_at
         FROM players p
         JOIN users u ON p.user_id = u.id
         ORDER BY p.created_at DESC
         LIMIT 1000`
      );
      return reply.send(result.rows);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Get server stats
  fastify.get('/admin/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!(await authenticateAdmin(request, reply))) return;

      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      const playerCount = await pool.query('SELECT COUNT(*) FROM players');
      const totalXp = await pool.query('SELECT SUM(xp) as total FROM players');
      const totalCoins = await pool.query('SELECT SUM(coins) as total FROM players');

      return reply.send({
        totalUsers: userCount.rows[0].count,
        totalPlayers: playerCount.rows[0].count,
        totalXp: totalXp.rows[0].total || 0,
        totalCoins: totalCoins.rows[0].total || 0,
        timestamp: new Date(),
      });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });
}
