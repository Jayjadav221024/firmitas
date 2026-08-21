import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { AuthRequest, getJwtSecret, getJwtRefreshSecret } from '../middleware/auth.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('role');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const role = user.role as any;
    if (!role) {
      return res.status(403).json({ success: false, message: 'Account has no role assigned' });
    }

    const tokenPayload = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      roleId: String(role._id),
      roleKey: role.key,
      permissions: role.permissions
    };

    const accessToken = jwt.sign(tokenPayload, getJwtSecret(), { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: String(user._id) }, getJwtRefreshSecret(), { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roleId: role._id,
        roleName: role.name,
        roleKey: role.key,
        permissions: role.permissions
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const user = await User.findById(req.user.id).populate('role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const role = user.role as any;
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roleId: role._id,
        roleName: role.name,
        roleKey: role.key,
        permissions: role.permissions
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
