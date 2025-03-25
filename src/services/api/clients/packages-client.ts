
import { supabaseClient } from "../supabase-client";
import { Package } from "@/types/api";
import { Json } from "@/integrations/supabase/types";

/**
 * Packages API Client
 */
export const packagesClient = {
  /**
   * Get all packages
   */
  getAllPackages: async (): Promise<Package[]> => {
    const { data, error } = await supabaseClient
      .from('packages')
      .select('*')
      .eq('active', true);
      
    if (error) throw error;
    
    // Transform the data to match the Package type
    return (data || []).map((pkg: any) => ({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      category: pkg.category,
      price: pkg.price,
      features: pkg.features as unknown as string[],
      active: pkg.active,
      popular: pkg.popular,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at
    }));
  },
  
  /**
   * Get packages by category
   */
  getPackagesByCategory: async (category: string): Promise<Package[]> => {
    const { data, error } = await supabaseClient
      .from('packages')
      .select('*')
      .eq('category', category)
      .eq('active', true);
      
    if (error) throw error;
    
    // Transform the data to match the Package type
    return (data || []).map((pkg: any) => ({
      id: pkg.id,
      title: pkg.title,
      description: pkg.description,
      category: pkg.category,
      price: pkg.price,
      features: pkg.features as unknown as string[],
      active: pkg.active,
      popular: pkg.popular,
      created_at: pkg.created_at,
      updated_at: pkg.updated_at
    }));
  },
  
  /**
   * Get package by ID
   */
  getPackageById: async (id: string): Promise<Package> => {
    const { data, error } = await supabaseClient
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    // Transform the data to match the Package type
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      features: data.features as unknown as string[],
      active: data.active,
      popular: data.popular,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
};
