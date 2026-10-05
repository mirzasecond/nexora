import pool from '../db';

export async function equipItem(
  playerId: string,
  itemId: string,
  slot: 'weapon' | 'armor' | 'accessory'
): Promise<void> {
  // Get or create equipment record
  const existing = await pool.query('SELECT * FROM equipment WHERE player_id = $1', [playerId]);

  if (existing.rows[0]) {
    const column = `${slot}_id`;
    await pool.query(
      `UPDATE equipment SET ${column} = $1, updated_at = NOW() WHERE player_id = $2`,
      [itemId, playerId]
    );
  } else {
    const values: Record<string, string> = {};
    values[`${slot}_id`] = itemId;

    await pool.query(
      `INSERT INTO equipment (id, player_id, ${slot}_id)
       VALUES (gen_random_uuid(), $1, $2)`,
      [playerId, itemId]
    );
  }
}

export async function unequipItem(
  playerId: string,
  slot: 'weapon' | 'armor' | 'accessory'
): Promise<void> {
  const column = `${slot}_id`;
  await pool.query(
    `UPDATE equipment SET ${column} = NULL, updated_at = NOW() WHERE player_id = $1`,
    [playerId]
  );
}

export async function getPlayerEquipment(playerId: string) {
  const result = await pool.query(
    `SELECT e.*,
            w.name as weapon_name, a.name as armor_name, ac.name as accessory_name
     FROM equipment e
     LEFT JOIN items w ON e.weapon_id = w.id
     LEFT JOIN items a ON e.armor_id = a.id
     LEFT JOIN items ac ON e.accessory_id = ac.id
     WHERE e.player_id = $1`,
    [playerId]
  );
  return result.rows[0] || null;
}
