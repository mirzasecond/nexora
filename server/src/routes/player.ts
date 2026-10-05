import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPlayerByUserId, updatePlayerPosition, addPlayerXP, addPlayerCoins } from '../services/player';

interface PositionBody {
  x: number;
  y: number;
  z: number;
}

interface XpBody {
  amount: number;
}

interface CoinsBody {
  amount: number;
}

async function authenticateRequest(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
    throw err;
  }
}

export async function playerRoutes(fastify: FastifyInstance) {
  // Get player data
  fastify.get('/player', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      return reply.send(player);
    } catch (err: any) {
      if (!reply.sent) {
        return reply.status(500).send({ error: 'Server error' });
      }
    }
  });

  // Update player position (periodic, not every frame)
  fastify.post<{ Body: PositionBody }>('/player/position', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const body = request.body as PositionBody;
      const { x, y, z } = body;
      if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
        return reply.status(400).send({ error: 'Invalid position' });
      }

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      await updatePlayerPosition(player.id, x, y, z);
      return reply.send({ success: true });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Add XP (called when defeating enemy, completing quest, etc)
  fastify.post<{ Body: XpBody }>('/player/xp', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const body = request.body as XpBody;
      const { amount } = body;
      if (typeof amount !== 'number' || amount < 0) {
        return reply.status(400).send({ error: 'Invalid XP amount' });
      }

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      const newLevel = await addPlayerXP(player.id, amount);
      return reply.send({ success: true, newLevel });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Add coins
  fastify.post<{ Body: CoinsBody }>('/player/coins', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const body = request.body as CoinsBody;
      const { amount } = body;
      if (typeof amount !== 'number' || amount < 0) {
        return reply.status(400).send({ error: 'Invalid coin amount' });
      }

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) {
        return reply.status(404).send({ error: 'Player not found' });
      }

      const newCoins = await addPlayerCoins(player.id, amount);
      return reply.send({ success: true, coins: newCoins });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });
}
