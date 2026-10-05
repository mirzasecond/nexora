import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPlayerByUserId } from '../services/player';
import pool from '../db';

interface QuestParams {
  questId: string;
}

async function authenticateRequest(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
    throw err;
  }
}

export async function questRoutes(fastify: FastifyInstance) {
  // Get available quests
  fastify.get('/quests', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await pool.query('SELECT * FROM quests LIMIT 20');
      return reply.send(result.rows);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Get player quests
  fastify.get('/player/quests', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const result = await pool.query(
        `SELECT pq.*, q.title, q.description, q.xp_reward, q.coin_reward
         FROM player_quests pq
         JOIN quests q ON pq.quest_id = q.id
         WHERE pq.player_id = $1`,
        [player.id]
      );

      return reply.send(result.rows);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Accept quest
  fastify.post<{ Params: QuestParams }>('/quests/:questId/accept', async (request, reply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;
      const params = request.params as QuestParams;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      // Check if quest already accepted
      const existing = await pool.query(
        'SELECT * FROM player_quests WHERE player_id = $1 AND quest_id = $2',
        [player.id, params.questId]
      );

      if (existing.rows.length > 0) {
        return reply.status(400).send({ error: 'Quest already accepted' });
      }

      // Add quest to player
      await pool.query(
        `INSERT INTO player_quests (player_id, quest_id, status)
         VALUES ($1, $2, 'ACTIVE')`,
        [player.id, params.questId]
      );

      return reply.send({ success: true });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Complete quest
  fastify.post<{ Params: QuestParams }>('/quests/:questId/complete', async (request, reply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;
      const params = request.params as QuestParams;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      // Get quest reward
      const quest = await pool.query('SELECT * FROM quests WHERE id = $1', [params.questId]);
      if (!quest.rows[0]) return reply.status(404).send({ error: 'Quest not found' });

      // Update quest status
      await pool.query(
        `UPDATE player_quests SET status = 'COMPLETED', completed_at = NOW()
         WHERE player_id = $1 AND quest_id = $2`,
        [player.id, params.questId]
      );

      return reply.send({
        success: true,
        reward: {
          xp: quest.rows[0].xp_reward,
          coins: quest.rows[0].coin_reward,
        },
      });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });
}
