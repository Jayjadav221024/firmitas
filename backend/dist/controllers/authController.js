"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
const auth_js_1 = require("../middleware/auth.js");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }
        const user = await User_js_1.User.findOne({ email: email.toLowerCase() }).populate('role');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const role = user.role;
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
        const accessToken = jsonwebtoken_1.default.sign(tokenPayload, (0, auth_js_1.getJwtSecret)(), { expiresIn: '1d' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: String(user._id) }, (0, auth_js_1.getJwtRefreshSecret)(), { expiresIn: '7d' });
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
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        const user = await User_js_1.User.findById(req.user.id).populate('role');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const role = user.role;
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
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getMe = getMe;
