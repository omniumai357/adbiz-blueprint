
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCheckoutAuth() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    checkUser();
  }, []);

  return { userId };
}
