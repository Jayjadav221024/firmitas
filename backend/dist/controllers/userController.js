"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUsers = exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoles = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = require("../models/User.js");
const Role_js_1 = require("../models/Role.js");
const auditService_js_1 = require("../services/auditService.js");
const http_js_1 = require("../utils/http.js");
// Roles
const getRoles = async (req, res) => {
    try {
        const roles = await Role_js_1.Role.find().sort({ createdAt: 1 });
        return res.json({ success: true, data: roles });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getRoles = getRoles;
const createRole = async (req, res) => {
    try {
        const { name, key, description, permissions } = req.body;
        const cleanKey = key || name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const role = await Role_js_1.Role.create({
            name,
            key: cleanKey,
            description,
            permissions,
            isSystem: false
        });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Super Admin',
            action: 'Created Role',
            module: 'roles',
            targetId: String(role._id),
            targetName: role.name
        });
        return res.status(201).json({ success: true, data: role });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createRole = createRole;
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Role'))
            return;
        const { name, description, permissions } = req.body;
        const role = await Role_js_1.Role.findById(id);
        if (!role)
            return res.status(404).json({ success: false, message: 'Role not found' });
        if (role.key === 'super_admin' && permissions) {
            // Keep super admin all true
        }
        else {
            if (name)
                role.name = name;
            if (description !== undefined)
                role.description = description;
            if (permissions)
                role.permissions = permissions;
            await role.save();
        }
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Super Admin',
            action: 'Updated Role',
            module: 'roles',
            targetId: String(role._id),
            targetName: role.name
        });
        return res.json({ success: true, data: role });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'Role'))
            return;
        const role = await Role_js_1.Role.findById(id);
        if (!role)
            return res.status(404).json({ success: false, message: 'Role not found' });
        if (role.isSystem) {
            return res.status(400).json({ success: false, message: 'Cannot delete system-protected role' });
        }
        await Role_js_1.Role.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Role deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteRole = deleteRole;
// Users
const getUsers = async (req, res) => {
    try {
        const users = await User_js_1.User.find().populate('role').sort({ createdAt: -1 });
        const formatted = users.map((u) => ({
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
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getUsers = getUsers;
const createUser = async (req, res) => {
    try {
        const { name, email, password, roleId, isActive } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }
        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required' });
        }
        if (!roleId || !(await Role_js_1.Role.exists({ _id: roleId }).catch(() => null))) {
            return res.status(400).json({ success: false, message: 'A valid role must be selected' });
        }
        const existing = await User_js_1.User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(400).json({ success: false, message: 'Email already registered' });
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = await User_js_1.User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: roleId,
            isActive: isActive !== undefined ? isActive : true
        });
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Super Admin',
            action: 'Created Admin User',
            module: 'users',
            targetId: String(user._id),
            targetName: user.name
        });
        return res.status(201).json({ success: true, data: user });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'User'))
            return;
        const { name, roleId, isActive, password } = req.body;
        const user = await User_js_1.User.findById(id);
        if (!user)
            return res.status(404).json({ success: false, message: 'User not found' });
        if (roleId && !(await Role_js_1.Role.exists({ _id: roleId }).catch(() => null))) {
            return res.status(400).json({ success: false, message: 'A valid role must be selected' });
        }
        if (name)
            user.name = name;
        if (roleId)
            user.role = roleId;
        if (isActive !== undefined)
            user.isActive = isActive;
        if (password) {
            const salt = await bcryptjs_1.default.genSalt(10);
            user.passwordHash = await bcryptjs_1.default.hash(password, salt);
        }
        await user.save();
        await (0, auditService_js_1.logAction)({
            actor: req.user?.name || 'Super Admin',
            action: 'Updated Admin User',
            module: 'users',
            targetId: String(user._id),
            targetName: user.name
        });
        return res.json({ success: true, data: user });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if ((0, http_js_1.rejectInvalidId)(res, id, 'User'))
            return;
        // Don't let an admin delete the account they are signed in with.
        if (req.user?.id === id) {
            return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
        }
        const deleted = await User_js_1.User.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ success: false, message: 'User not found' });
        return res.json({ success: true, message: 'User deleted' });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteUser = deleteUser;
