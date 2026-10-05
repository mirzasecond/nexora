import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getPlayerByUserId } from '../services/player';
import { getPlayerInventory, addItemToInventory, removeItemFromInventory } from '../services/inventory';
import { getPlayerEquipment, equipItem, unequipItem } from '../services/equipment';
import { buyItem, sellItem, getShopItems } from '../services/shop';

async function authenticateRequest(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
    throw err;
  }
}

interface BuyItemBody {
  itemId: string;
  quantity: number;
}

interface SellItemBody {
  itemId: string;
  quantity: number;
}

interface EquipItemBody {
  itemId: string;
  slot: 'weapon' | 'armor' | 'accessory';
}

export async function inventoryRoutes(fastify: FastifyInstance) {
  // Get player inventory
  fastify.get('/inventory', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const inventory = await getPlayerInventory(player.id);
      return reply.send(inventory);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Get player equipment
  fastify.get('/equipment', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const equipment = await getPlayerEquipment(player.id);
      return reply.send(equipment || {});
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Equip item
  fastify.post<{ Body: EquipItemBody }>('/equipment/equip', async (request, reply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const { itemId, slot } = request.body;
      if (!itemId || !slot) {
        return reply.status(400).send({ error: 'Missing itemId or slot' });
      }

      // Verify item in inventory
      const inventory = await getPlayerInventory(player.id);
      if (!inventory.find((i) => i.item_id === itemId)) {
        return reply.status(400).send({ error: 'Item not in inventory' });
      }

      await equipItem(player.id, itemId, slot);
      return reply.send({ success: true });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Unequip item
  fastify.post<{ Body: any }>('/equipment/unequip', async (request, reply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const body = request.body as { slot: string };
      const { slot } = body;
      if (!slot) return reply.status(400).send({ error: 'Missing slot' });

      await unequipItem(player.id, slot as any);
      return reply.send({ success: true });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Get shop items
  fastify.get('/shop/items', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const items = getShopItems();
      return reply.send(items);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Buy item
  fastify.post<{ Body: BuyItemBody }>('/shop/buy', async (request, reply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const { itemId, quantity } = request.body;
      if (!itemId || !quantity) {
        return reply.status(400).send({ error: 'Missing itemId or quantity' });
      }

      const result = await buyItem(player.id, itemId, quantity);
      if (!result.success) {
        return reply.status(400).send({ error: result.message });
      }

      return reply.send(result);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });

  // Sell item
  fastify.post<{ Body: SellItemBody }>('/shop/sell', async (request, reply) => {
    try {
      await authenticateRequest(request, reply);
      const payload = request.user as any;

      const player = await getPlayerByUserId(payload.user_id);
      if (!player) return reply.status(404).send({ error: 'Player not found' });

      const { itemId, quantity } = request.body;
      if (!itemId || !quantity) {
        return reply.status(400).send({ error: 'Missing itemId or quantity' });
      }

      const result = await sellItem(player.id, itemId, quantity);
      if (!result.success) {
        return reply.status(400).send({ error: result.message });
      }

      return reply.send(result);
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Server error' });
    }
  });
}
