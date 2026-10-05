import pool from '../db';

export interface InventoryItem {
  id: string;
  playerId: string;
  itemId: string;
  quantity: number;
}

export async function addItemToInventory(
  playerId: string,
  itemId: string,
  quantity: number = 1
): Promise<InventoryItem> {
  // Check if item already in inventory
  const existing = await pool.query(
    'SELECT * FROM inventory WHERE player_id = $1 AND item_id = $2',
    [playerId, itemId]
  );

  if (existing.rows[0]) {
    // Update quantity
    const result = await pool.query(
      `UPDATE inventory SET quantity = quantity + $1 WHERE player_id = $2 AND item_id = $3
       RETURNING *`,
      [quantity, playerId, itemId]
    );
    return result.rows[0];
  } else {
    // Create new inventory entry
    const result = await pool.query(
      `INSERT INTO inventory (id, player_id, item_id, quantity)
       VALUES (gen_random_uuid(), $1, $2, $3)
       RETURNING *`,
      [playerId, itemId, quantity]
    );
    return result.rows[0];
  }
}

export async function removeItemFromInventory(
  playerId: string,
  itemId: string,
  quantity: number = 1
): Promise<boolean> {
  const result = await pool.query(
    `UPDATE inventory SET quantity = quantity - $1 WHERE player_id = $2 AND item_id = $3
     RETURNING quantity`,
    [quantity, playerId, itemId]
  );

  if (!result.rows[0]) return false;

  // Delete if quantity reaches 0
  if (result.rows[0].quantity <= 0) {
    await pool.query(
      'DELETE FROM inventory WHERE player_id = $1 AND item_id = $2',
      [playerId, itemId]
    );
  }

  return true;
}

export async function getPlayerInventory(playerId: string) {
  const result = await pool.query(
    `SELECT i.*, it.name, it.type, it.rarity, it.description
     FROM inventory i
     JOIN items it ON i.item_id = it.id
     WHERE i.player_id = $1
     ORDER BY it.type, it.name`,
    [playerId]
  );
  return result.rows;
}

export async function getInventoryItem(playerId: string, itemId: string) {
  const result = await pool.query(
    'SELECT * FROM inventory WHERE player_id = $1 AND item_id = $2',
    [playerId, itemId]
  );
  return result.rows[0] || null;
}
