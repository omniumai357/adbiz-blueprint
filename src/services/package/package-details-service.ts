
import { supabase } from "@/integrations/supabase/client";
import { PackageDetails } from "@/types/checkout";

/**
 * Service for fetching and manipulating package details
 */
export const packageDetailsService = {
  /**
   * Fetches a package by its ID
   * @param packageId The ID of the package to fetch
   * @returns Promise resolving to the package details
   */
  async getPackageById(packageId: string): Promise<PackageDetails> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .single();
      
    if (error) {
      console.error("Error fetching package:", error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      features: data.features || [],
      category: data.category
    };
  },
  
  /**
   * Fetches all available packages
   * @returns Promise resolving to an array of package details
   */
  async getAllPackages(): Promise<PackageDetails[]> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('active', true);
      
    if (error) {
      console.error("Error fetching packages:", error);
      throw error;
    }
    
    return data.map((pkg: any) => ({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      features: pkg.features || [],
      category: pkg.category
    }));
  }
};
