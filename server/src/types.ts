export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Player {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  coins: number;
  hp: number;
  max_hp: number;
  stamina: number;
  max_stamina: number;
  position_x: number;
  position_y: number;
  position_z: number;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  user_id: string;
  username: string;
}
