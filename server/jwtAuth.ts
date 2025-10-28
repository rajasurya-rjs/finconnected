import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET (or SESSION_SECRET) must be set');
}

export function signJwt(payload: Record<string, any>, expiresIn = '7d') {
  return (jwt as any).sign(payload, JWT_SECRET!, { expiresIn });
}

export const authenticateJWT: RequestHandler = async (req, res, next) => {
  // First look for Authorization header
  const auth = req.headers.authorization as string | undefined;
  let token: string | undefined;

  if (auth && auth.startsWith('Bearer ')) {
    token = auth.slice(7);
  } else if (req.headers.cookie) {
    // Fallback: try to read token from cookie named 'token'
    const raw = req.headers.cookie.split(';').map(s => s.trim());
    for (const part of raw) {
      if (part.startsWith('token=')) {
        token = decodeURIComponent(part.split('=')[1] || '');
        break;
      }
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = (jwt as any).verify(token, JWT_SECRET!) as Record<string, any>;
    const userId = payload.userId || payload.sub;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach a minimal user object to the request
    (req as any).user = { id: user.id, ...payload };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export async function loginOrCreateUserByEmail(email: string, firstName?: string, lastName?: string, profileImageUrl?: string) {
  let user = await storage.getUserByEmail(email);
  if (!user) {
    user = await storage.upsertUser({ email, firstName, lastName, profileImageUrl });
  }
  return user;
}
