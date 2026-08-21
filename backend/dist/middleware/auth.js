"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'shreeraj_super_secret_jwt_key_2026';
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.authenticateJWT = authenticateJWT;
const checkPermission = (moduleName, action = 'view') => {
    return (req, res, next) => {
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
exports.checkPermission = checkPermission;
