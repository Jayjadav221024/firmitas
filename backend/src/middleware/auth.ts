import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';

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

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'shreeraj_super_secret_jwt_key_2026';

  try {
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    next();
  } catch (err) {
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
