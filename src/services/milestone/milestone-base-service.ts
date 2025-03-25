
import { supabase } from "@/integrations/supabase/client";

/**
 * Base milestone service class providing common functionality 
 * for all milestone-related services
 */
export class MilestoneBaseService {
  /**
   * Get milestone icons for a set of milestone IDs
   * @param milestoneIds Array of milestone IDs to fetch icons for
   * @returns Promise resolving to an array of objects with ID and icon
   */
  async getMilestoneIcons(milestoneIds: string[]): Promise<{id: string, icon: string}[]> {
    if (!milestoneIds.length) return [];
    
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('id, icon')
        .in('id', milestoneIds);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching milestone icons:', error);
      throw error;
    }
  }
}
