import { pb } from '../pocketbase';
import type { Amenity } from '@/types';

export const amenitiesApi = {
  // List all amenities
  async list(): Promise<Amenity[]> {
    try {
      const result = await pb.collection('amenities').getList(1, 100, {
        sort: 'order',
      });
      return result.items as unknown as Amenity[];
    } catch (error: any) {
      console.error('Error fetching amenities:', error);
      // If 403 Forbidden, the collection permissions need to be set to allow public read
      if (error.status === 403) {
        throw new Error('Amenities collection is not publicly accessible. Please configure PocketBase permissions to allow public read access.');
      }
      throw new Error(error.message || 'Failed to fetch amenities. Please check your connection.');
    }
  },

  // Get single amenity
  async get(id: string): Promise<Amenity> {
    return await pb.collection('amenities').getOne(id) as unknown as Amenity;
  },
};

