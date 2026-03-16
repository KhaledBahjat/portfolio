import { supabase } from '@/lib/supabase/supabase';
import { getDocument } from '@/lib/supabase/database';

const TABLE = 'visitor_stats';
const DOC_ID = 'visitor_count';

/**
 * Interface for visitor stats
 */
export interface VisitorStats {
  id: string;
  count: number;
  updated_at: string;
}

/**
 * Fetches the current visitor count from Supabase.
 * @returns The current count or 0 if not found.
 */
export const getVisitorCount = async (): Promise<number> => {
  try {
    const data = await getDocument(TABLE, DOC_ID);
    return data?.count || 0;
  } catch (error) {
    console.error('❌ Error fetching visitor count:', error);
    return 0;
  }
};

/**
 * Atomically increments the visitor count in Supabase using an RPC call.
 * @returns The new visitor count.
 */
export const incrementVisitorCount = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('increment_visitor_count', { increment_by: 1 });
    
    if (error) {
      throw error;
    }
    
    return data || 0;
  } catch (error) {
    console.error('❌ Error incrementing visitor count:', error);
    // Fallback: return current count if increment fails
    return await getVisitorCount();
  }
};
