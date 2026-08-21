import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { AuthRequest } from '../middleware/auth.js';
import { logAction } from '../services/auditService.js';
import { rejectInvalidId } from '../utils/http.js';

// Roles
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });
    return res.json({ success: true, data: roles });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createRole = async (req: AuthRequest, res: Response) => {
  try {
    const { name, key, description, permissions } = req.body;
    const cleanKey = key || name.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    const role = await Role.create({
      name,
      key: cleanKey,
      description,
      permissions,
      isSystem: false
    });

    await logAction({
      actor: req.user?.name || 'Super Admin',
      action: 'Created Role',
      module: 'roles',
      targetId: String(role._id),
      targetName: role.name
    });

    return res.status(201).json({ success: true, data: role });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'Role')) return;

    const { name, description, permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

    if (role.key === 'super_admin' && permissions) {
      // Keep super admin all true
    } else {
      if (name) role.name = name;
      if (description !== undefined) role.description = description;
      if (permissions) role.permissions = permissions;
      await role.save();
    }

    await logAction({
      actor: req.user?.name || 'Super Admin',
      action: 'Updated Role',
      module: 'roles',
      targetId: String(role._id),
      targetName: role.name
    });

    return res.json({ success: true, data: role });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'Role')) return;

    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'Cannot delete system-protected role' });
    }

    await Role.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Role deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate('role').sort({ createdAt: -1 });
    const formatted = users.map((u: any) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      avatar: u.avatar,
      roleId: u.role?._id,
      roleName: u.role?.name || 'No Role',
      roleKey: u.role?.key,
      isActive: u.isActive,
      createdAt: u.createdAt
    }));
    return res.json({ success: true, data: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, roleId, isActive } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }
    if (!roleId || !(await Role.exists({ _id: roleId }).catch(() => null))) {
      return res.status(400).json({ success: false, message: 'A valid role must be selected' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: roleId,
      isActive: isActive !== undefined ? isActive : true
    });

    await logAction({
      actor: req.user?.name || 'Super Admin',
      action: 'Created Admin User',
      module: 'users',
      targetId: String(user._id),
      targetName: user.name
    });

    return res.status(201).json({ success: true, data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'User')) return;

    const { name, roleId, isActive, password } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (roleId && !(await Role.exists({ _id: roleId }).catch(() => null))) {
      return res.status(400).json({ success: false, message: 'A valid role must be selected' });
    }

    if (name) user.name = name;
    if (roleId) user.role = roleId;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }
    await user.save();

    await logAction({
      actor: req.user?.name || 'Super Admin',
      action: 'Updated Admin User',
      module: 'users',
      targetId: String(user._id),
      targetName: user.name
    });

    return res.json({ success: true, data: user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (rejectInvalidId(res, id, 'User')) return;

    // Don't let an admin delete the account they are signed in with.
    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, message: 'User deleted' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
