import { pb } from '../pocketbase';
import type { Mosque, MosqueFilters, MosqueWithDetails } from '@/types';
import type { Amenity, MosqueAmenity, Activity } from '@/types';

export const mosquesApi = {
  // List mosques with filters
  async list(filters?: MosqueFilters): Promise<Mosque[]> {
    const filterParts: string[] = ['status = "approved"'];
    
    if (filters) {
      if (filters.state && filters.state !== 'all') {
        filterParts.push(`state = "${filters.state}"`);
      }
      
      if (filters.amenities && filters.amenities.length > 0) {
        // This requires a join query - simplified for now
        // In production, you'd need to query mosque_amenities and join
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filterParts.push(`(name ~ "${searchLower}" || address ~ "${searchLower}" || state ~ "${searchLower}")`);
      }
    }
    
    const result = await pb.collection('mosques').getList(1, 50, {
      filter: filterParts.join(' && '),
      sort: filters?.sortBy ? this.getSortString(filters.sortBy) : '-created',
    });
    
    return result.items as unknown as Mosque[];
  },

  // Get single mosque with details
  async get(id: string): Promise<MosqueWithDetails> {
    const mosque = await pb.collection('mosques').getOne(id) as unknown as Mosque;
    
    // Fetch related amenities
    const amenitiesResult = await pb.collection('mosque_amenities').getList(1, 100, {
      filter: `mosque_id = "${id}"`,
      expand: 'amenity_id',
    });
    
    const amenities = amenitiesResult.items.map((item: any) => ({
      ...(item.expand?.amenity_id || {}),
      details: item.details || {},
      verified: item.verified || false,
    })) as (Amenity & { details: any; verified: boolean })[];
    
    // Fetch custom amenities (where amenity_id is null)
    const customAmenities = amenitiesResult.items
      .filter((item: any) => !item.amenity_id)
      .map((item: any) => ({
        id: item.id,
        mosque_id: item.mosque_id,
        amenity_id: null,
        details: item.details || {},
        verified: item.verified || false,
        created: item.created,
        updated: item.updated,
      })) as MosqueAmenity[];
    
    // Fetch activities
    const activitiesResult = await pb.collection('activities').getList(1, 100, {
      filter: `mosque_id = "${id}" && status = "active"`,
      sort: '-created',
    });
    
    const activities = activitiesResult.items as unknown as Activity[];
    
    return {
      ...mosque,
      amenities,
      customAmenities,
      activities,
    };
  },

  // Create mosque (for submissions)
  async create(data: Partial<Mosque>): Promise<Mosque> {
    return await pb.collection('mosques').create(data) as unknown as Mosque;
  },

  // Update mosque
  async update(id: string, data: Partial<Mosque>): Promise<Mosque> {
    return await pb.collection('mosques').update(id, data) as unknown as Mosque;
  },

  // Delete mosque
  async delete(id: string): Promise<boolean> {
    await pb.collection('mosques').delete(id);
    return true;
  },

  // Helper to get sort string
  getSortString(sortBy?: string): string {
    switch (sortBy) {
      case 'alphabetical':
        return 'name';
      case 'most_amenities':
        return '-created'; // Placeholder - would need aggregation
      case 'nearest':
        return '-created'; // Placeholder - would need geospatial query
      default:
        return '-created';
    }
  },
};

