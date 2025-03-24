
import { supabase } from '@/integrations/supabase/client';

interface UpdateMilestoneProgressParams {
  userId: string;
  points: number;
  activityType: string;
  referenceId?: string;
  referenceType?: string;
}

export function useUpdateMilestoneProgress() {
  const updateProgress = async ({
    userId,
    points,
    activityType,
    referenceId,
    referenceType
  }: UpdateMilestoneProgressParams) => {
    if (!userId) return { success: false };

    try {
      const { error } = await supabase.rpc('update_user_milestone_progress', {
        p_user_id: userId,
        p_points: points,
        p_activity_type: activityType,
        p_reference_id: referenceId,
        p_reference_type: referenceType
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating milestone progress:', error);
      return { success: false, error };
    }
  };

  return { updateProgress };
}
