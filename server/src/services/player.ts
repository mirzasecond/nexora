import pool from '../db';
import { Player } from '../types';

export async function createPlayer(userId: string): Promise<Player> {
  const result = await pool.query(
    `INSERT INTO players (user_id, level, xp, coins, hp, max_hp, stamina, max_stamina)
     VALUES ($1, 1, 0, 0, 100, 100, 100, 100)
     RETURNING *`,
    [userId]
  );

  const player = result.rows[0];

  // Create empty statistics
  await pool.query(
    `INSERT INTO statistics (player_id)
     VALUES ($1)`,
    [player.id]
  );

  return player;
}

export async function getPlayerByUserId(userId: string): Promise<Player | null> {
  const result = await pool.query(
    'SELECT * FROM players WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function updatePlayerPosition(
  playerId: string,
  x: number,
  y: number,
  z: number
): Promise<void> {
  await pool.query(
    `UPDATE players SET position_x = $1, position_y = $2, position_z = $3, updated_at = NOW()
     WHERE id = $4`,
    [x, y, z, playerId]
  );
}

export async function addPlayerXP(playerId: string, xp: number): Promise<number> {
  const player = await pool.query(
    'SELECT xp, level FROM players WHERE id = $1',
    [playerId]
  );

  if (!player.rows[0]) throw new Error('Player not found');

  const newXp = player.rows[0].xp + xp;
  const xpPerLevel = 100;
  const newLevel = Math.floor(newXp / xpPerLevel) + 1;

  await pool.query(
    `UPDATE players SET xp = $1, level = $2, updated_at = NOW()
     WHERE id = $3`,
    [newXp, newLevel, playerId]
  );

  return newLevel;
}

export async function addPlayerCoins(playerId: string, coins: number): Promise<number> {
  const result = await pool.query(
    `UPDATE players SET coins = coins + $1, updated_at = NOW()
     WHERE id = $2
     RETURNING coins`,
    [coins, playerId]
  );

  return result.rows[0].coins;
}
