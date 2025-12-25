import { pb } from '../pocketbase';
import type { Submission } from '@/types';

export const submissionsApi = {
  // List submissions (admin only)
  async list(status?: 'pending' | 'approved' | 'rejected'): Promise<Submission[]> {
    let filter = '';
    if (status) {
      filter = `status = "${status}"`;
    }
    
    const result = await pb.collection('submissions').getList(1, 100, {
      filter,
      sort: '-submitted_at',
    });
    return result.items as unknown as Submission[];
  },

  // Get single submission
  async get(id: string): Promise<Submission> {
    return await pb.collection('submissions').getOne(id) as unknown as Submission;
  },

  // Create submission
  async create(data: Partial<Submission>): Promise<Submission> {
    return await pb.collection('submissions').create(data) as unknown as Submission;
  },

  // Update submission (approve/reject)
  async update(id: string, data: Partial<Submission>): Promise<Submission> {
    return await pb.collection('submissions').update(id, data) as unknown as Submission;
  },

  // Approve submission
  async approve(id: string, reviewedBy: string): Promise<Submission> {
    const submission = await this.get(id);
    
    if (submission.type === 'new_mosque') {
      // Create the mosque
      await pb.collection('mosques').create(submission.data);
    } else if (submission.type === 'edit_mosque' && submission.mosque_id) {
      // Update the mosque
      await pb.collection('mosques').update(submission.mosque_id, submission.data);
    }
    
    // Update submission status
    return await this.update(id, {
      status: 'approved',
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
    });
  },

  // Reject submission
  async reject(id: string, reviewedBy: string, reason: string): Promise<Submission> {
    return await this.update(id, {
      status: 'rejected',
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      rejection_reason: reason,
    });
  },
};

