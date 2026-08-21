import { AuditLog } from '../models/Entities.js';

export async function logAction(params: {
  actor: string;
  actorEmail?: string;
  action: string;
  module: string;
  targetId?: string;
  targetName?: string;
  diff?: any;
}) {
  try {
    await AuditLog.create({
      actor: params.actor || 'Super Admin',
      actorEmail: params.actorEmail || 'admin@shreerajtraders.com',
      action: params.action,
      module: params.module,
      targetId: params.targetId || '',
      targetName: params.targetName || '',
      diff: params.diff || null
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
