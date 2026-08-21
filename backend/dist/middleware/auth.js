"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = exports.authenticateJWT = void 0;
exports.getJwtSecret = getJwtSecret;
exports.getJwtRefreshSecret = getJwtRefreshSecret;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Signing key for access tokens. There is deliberately no default: a fallback
 * secret means anybody who has read the source can mint valid admin tokens.
 */
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set. Refusing to issue or verify tokens.');
    }
    return secret;
}
function getJwtRefreshSecret() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not set. Refusing to issue refresh tokens.');
    }
    return secret;
}
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
    }
    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }
    let secret;
    try {
        secret = getJwtSecret();
    }
    catch (err) {
        console.error('[Auth]', err.message);
        return res.status(500).json({ success: false, message: 'Server authentication is not configured' });
    }
    try {
        // verify() only — never fall back to decode(). decode() does not check the
        // signature, so it would accept a token forged by anyone.
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            roleId: decoded.roleId,
            roleKey: decoded.roleKey,
            permissions: decoded.permissions || {}
        };
        return next();
    }
    catch {
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
