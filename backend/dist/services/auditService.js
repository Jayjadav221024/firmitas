"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = logAction;
const Entities_js_1 = require("../models/Entities.js");
async function logAction(params) {
    try {
        await Entities_js_1.AuditLog.create({
            actor: params.actor || 'Super Admin',
            actorEmail: params.actorEmail || 'admin@shreerajtraders.com',
            action: params.action,
            module: params.module,
            targetId: params.targetId || '',
            targetName: params.targetName || '',
            diff: params.diff || null
        });
    }
    catch (err) {
        console.error('Failed to write audit log:', err);
    }
}
