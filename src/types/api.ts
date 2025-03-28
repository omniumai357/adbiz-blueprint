import { User } from '@supabase/supabase-js';

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// API Error Response Type
export interface ApiErrorResponse {
  message: string;
  status?: number;
  code?: string;
}

// Auth Types
export interface UserResponse {
  user: User | null;
}

export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: Error | null;
  message?: string;
}

// Profile Types
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  avatar_url: string | null;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Customer Info Types
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  website?: string;
  invoiceDeliveryMethod?: string;
  userId?: string;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  package_id: string | null;
  total_amount: number;
  contact_info: CustomerInfo | null;
  company_info: CompanyInfo | null;
  payment_method: string | null;
  payment_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyInfo {
  name: string;
  website: string;
}

// Package Types
export interface Package {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  features: string[];
  active: boolean | null;
  popular: boolean | null;
  created_at: string;
  updated_at: string;
}

// Milestone Types
export interface Milestone {
  id: string;
  name: string;
  description: string;
  points_required: number;
  reward_type: string;
  reward_value: number;
  is_active: boolean;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

// Create a common interface for milestone data shared between UserMilestone and AvailableReward
export interface CommonMilestoneData {
  milestone_id: string;
  milestone_name: string;
  milestone_description?: string;
  icon?: string;
  is_completed?: boolean;
  reward_claimed?: boolean;
  is_claimed?: boolean;
  completed_at?: string;
  reward_value?: number;
  reward_type?: string;
  pointsRequired?: number;
  isAvailable?: boolean;
}

export interface UserMilestone extends CommonMilestoneData {
  id: string;
  user_id: string;
  current_points: number;
  is_completed: boolean;
  reward_claimed: boolean;
  completed_at: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
  milestone?: Milestone;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  points_earned: number;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

export interface AvailableReward extends CommonMilestoneData {
  completed_at: string;
}

export interface MilestoneProgress {
  milestone_id: string;
  milestone_name: string;
  points_required: number;
  current_points: number;
  progress_percentage: number;
  icon?: string | null;
}

// Payment Types
export interface PaymentProcessParams {
  userId: string;
  points: number;
  activityType: string;
  referenceId?: string;
  referenceType?: string;
}

// File Upload Types
export interface FileUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: Error | null;
}

// API Pagination Types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
