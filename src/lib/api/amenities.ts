import { pb } from '../pocketbase';
import type { Amenity } from '@/types';

export const amenitiesApi = {
  // List all amenities
  async list(): Promise<Amenity[]> {
    const result = await pb.collection('amenities').getList(1, 100, {
      sort: 'order',
    });
    return result.items as unknown as Amenity[];
  },

  // Get single amenity
  async get(id: string): Promise<Amenity> {
    return await pb.collection('amenities').getOne(id) as unknown as Amenity;
  },
};

