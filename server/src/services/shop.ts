import pool from '../db';

const SHOP_PRICES: Record<string, number> = {
  potion_health: 50,
  potion_stamina: 50,
  iron_sword: 500,
  rare_sword: 1500,
  leather_armor: 300,
  rare_armor: 1000,
};

export async function buyItem(
  playerId: string,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; message?: string; newCoins?: number }> {
  // Get player coins
  const player = await pool.query('SELECT coins FROM players WHERE id = $1', [playerId]);
  if (!player.rows[0]) return { success: false, message: 'Player not found' };

  const itemName = Object.keys(SHOP_PRICES).find((k) => k === itemId) || itemId;
  const price = SHOP_PRICES[itemName];
  if (!price) return { success: false, message: 'Item not found in shop' };

  const totalCost = price * quantity;
  if (player.rows[0].coins < totalCost) {
    return { success: false, message: 'Insufficient coins' };
  }

  // Deduct coins
  const coinsResult = await pool.query(
    `UPDATE players SET coins = coins - $1 WHERE id = $2 RETURNING coins`,
    [totalCost, playerId]
  );

  // Add item to inventory
  await pool.query(
    `INSERT INTO inventory (id, player_id, item_id, quantity)
     VALUES (gen_random_uuid(), $1, $2, $3)
     ON CONFLICT (player_id, item_id) DO UPDATE SET quantity = quantity + $3`,
    [playerId, itemId, quantity]
  );

  return { success: true, newCoins: coinsResult.rows[0].coins };
}

export async function sellItem(
  playerId: string,
  itemId: string,
  quantity: number
): Promise<{ success: boolean; message?: string; newCoins?: number }> {
  // Check inventory
  const invResult = await pool.query(
    'SELECT quantity FROM inventory WHERE player_id = $1 AND item_id = $2',
    [playerId, itemId]
  );

  if (!invResult.rows[0] || invResult.rows[0].quantity < quantity) {
    return { success: false, message: 'Insufficient items in inventory' };
  }

  const itemName = Object.keys(SHOP_PRICES).find((k) => k === itemId) || itemId;
  const price = SHOP_PRICES[itemName] || 10; // Default sell price
  const sellPrice = Math.floor(price * 0.7); // Sell at 70% of buy price
  const totalRevenue = sellPrice * quantity;

  // Add coins
  const coinsResult = await pool.query(
    `UPDATE players SET coins = coins + $1 WHERE id = $2 RETURNING coins`,
    [totalRevenue, playerId]
  );

  // Remove from inventory
  await pool.query(
    `UPDATE inventory SET quantity = quantity - $1 WHERE player_id = $2 AND item_id = $3`,
    [quantity, playerId, itemId]
  );

  // Delete if quantity is 0
  await pool.query(
    'DELETE FROM inventory WHERE quantity <= 0',
  );

  return { success: true, newCoins: coinsResult.rows[0].coins };
}

export function getShopItems() {
  return Object.entries(SHOP_PRICES).map(([id, price]) => ({
    id,
    price,
  }));
}
