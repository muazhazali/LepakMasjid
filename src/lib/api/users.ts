import { pb } from '../pocketbase';
import type { User } from '@/types';

export const usersApi = {
  // List users (admin only)
  async list(): Promise<User[]> {
    const result = await pb.collection('users').getList(1, 100, {
      sort: '-created',
    });
    return result.items as unknown as User[];
  },

  // Get single user
  async get(id: string): Promise<User> {
    return await pb.collection('users').getOne(id) as unknown as User;
  },

  // Update user
  async update(id: string, data: Partial<User>): Promise<User> {
    return await pb.collection('users').update(id, data) as unknown as User;
  },

  // Ban user (set verified to false or add banned flag)
  async ban(id: string): Promise<User> {
    return await this.update(id, { verified: false });
  },

  // Unban user
  async unban(id: string): Promise<User> {
    return await this.update(id, { verified: true });
  },
};

