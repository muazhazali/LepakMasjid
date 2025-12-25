import { pb } from '../pocketbase';
import type { AuditLog } from '@/types';

export const auditApi = {
  // List audit logs (admin only)
  async list(filters?: {
    action?: string;
    entityType?: string;
    actorId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AuditLog[]> {
    const filterParts: string[] = [];
    
    if (filters?.action) {
      filterParts.push(`action = "${filters.action}"`);
    }
    
    if (filters?.entityType) {
      filterParts.push(`entity_type = "${filters.entityType}"`);
    }
    
    if (filters?.actorId) {
      filterParts.push(`actor_id = "${filters.actorId}"`);
    }
    
    if (filters?.startDate) {
      filterParts.push(`timestamp >= "${filters.startDate}"`);
    }
    
    if (filters?.endDate) {
      filterParts.push(`timestamp <= "${filters.endDate}"`);
    }
    
    const result = await pb.collection('audit_logs').getList(1, 100, {
      filter: filterParts.length > 0 ? filterParts.join(' && ') : undefined,
      sort: '-timestamp',
    });
    return result.items as unknown as AuditLog[];
  },

  // Get single audit log
  async get(id: string): Promise<AuditLog> {
    return await pb.collection('audit_logs').getOne(id) as unknown as AuditLog;
  },

  // Create audit log (typically done server-side via hooks)
  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    return await pb.collection('audit_logs').create(data) as unknown as AuditLog;
  },
};

