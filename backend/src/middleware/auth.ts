import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    roleId: string;
    roleKey: string;
    permissions: Record<string, any>;
  };
}

/**
 * Signing key for access tokens. There is deliberately no default: a fallback
 * secret means anybody who has read the source can mint valid admin tokens.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set. Refusing to issue or verify tokens.');
  }
  return secret;
}

export function getJwtRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not set. Refusing to issue refresh tokens.');
  }
  return secret;
}

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token missing' });
  }

  let secret: string;
  try {
    secret = getJwtSecret();
  } catch (err: any) {
    console.error('[Auth]', err.message);
    return res.status(500).json({ success: false, message: 'Server authentication is not configured' });
  }

  try {
    // verify() only — never fall back to decode(). decode() does not check the
    // signature, so it would accept a token forged by anyone.
    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      roleId: decoded.roleId,
      roleKey: decoded.roleKey,
      permissions: decoded.permissions || {}
    };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const checkPermission = (moduleName: string, action: string = 'view') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Super admin bypass
    if (req.user.roleKey === 'super_admin') {
      return next();
    }

    const perms = req.user.permissions?.[moduleName];
    if (!perms || !perms[action]) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: You do not have permission to ${action} in ${moduleName}`
      });
    }

    next();
  };
};
