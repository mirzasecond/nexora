import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { registerSchema, loginSchema } from '../validation';
import { createUser, getUserByUsername, getUserByEmail, verifyPassword } from '../services/auth';
import { createPlayer, getPlayerByUserId } from '../services/player';

export async function authRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post<{ Body: any }>('/auth/register', async (request, reply) => {
    try {
      const input = registerSchema.parse(request.body);

      // Check if user exists
      const existingUser = await getUserByUsername(input.username);
      if (existingUser) {
        return reply.status(400).send({ error: 'Username already taken' });
      }

      const existingEmail = await getUserByEmail(input.email);
      if (existingEmail) {
        return reply.status(400).send({ error: 'Email already registered' });
      }

      // Create user
      const user = await createUser(input.username, input.email, input.password);

      // Create player
      await createPlayer(user.id);

      // Generate token
      const token = fastify.jwt.sign({ user_id: user.id, username: user.username });

      return reply.send({
        user: { id: user.id, username: user.username, email: user.email },
        token,
      });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(400).send({ error: err.message });
    }
  });

  // Login
  fastify.post<{ Body: any }>('/auth/login', async (request, reply) => {
    try {
      const input = loginSchema.parse(request.body);

      // Find user
      let user = await getUserByUsername(input.username_or_email);
      if (!user) {
        user = await getUserByEmail(input.username_or_email);
      }

      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const valid = await verifyPassword(input.password, user.password_hash);
      if (!valid) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Get player
      const player = await getPlayerByUserId(user.id);

      // Generate token
      const token = fastify.jwt.sign({ user_id: user.id, username: user.username });

      return reply.send({
        user: { id: user.id, username: user.username, email: user.email },
        player,
        token,
      });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(400).send({ error: err.message });
    }
  });

  // Get current user
  fastify.get('/auth/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as any;
      const user = { user_id: payload.user_id, username: payload.username };
      return reply.send(user);
    } catch (err) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}
