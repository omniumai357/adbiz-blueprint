export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_questionnaires: {
        Row: {
          brand_colors: Json | null
          business_description: string
          business_license_number: string | null
          business_name: string
          business_size: string | null
          contact_info: Json
          created_at: string
          has_business_license: boolean | null
          has_logo: boolean | null
          id: string
          industry: string
          marketing_goals: string[]
          mission_statement: string | null
          need_logo_design: boolean | null
          other_industry: string | null
          service_area: string
          slogan: string | null
          social_media: Json | null
          target_audience: string | null
          unique_selling_points: string | null
          updated_at: string
          uploaded_files: Json | null
          user_id: string
          years_in_business: string | null
        }
        Insert: {
          brand_colors?: Json | null
          business_description: string
          business_license_number?: string | null
          business_name: string
          business_size?: string | null
          contact_info: Json
          created_at?: string
          has_business_license?: boolean | null
          has_logo?: boolean | null
          id?: string
          industry: string
          marketing_goals: string[]
          mission_statement?: string | null
          need_logo_design?: boolean | null
          other_industry?: string | null
          service_area: string
          slogan?: string | null
          social_media?: Json | null
          target_audience?: string | null
          unique_selling_points?: string | null
          updated_at?: string
          uploaded_files?: Json | null
          user_id: string
          years_in_business?: string | null
        }
        Update: {
          brand_colors?: Json | null
          business_description?: string
          business_license_number?: string | null
          business_name?: string
          business_size?: string | null
          contact_info?: Json
          created_at?: string
          has_business_license?: boolean | null
          has_logo?: boolean | null
          id?: string
          industry?: string
          marketing_goals?: string[]
          mission_statement?: string | null
          need_logo_design?: boolean | null
          other_industry?: string | null
          service_area?: string
          slogan?: string | null
          social_media?: Json | null
          target_audience?: string | null
          unique_selling_points?: string | null
          updated_at?: string
          uploaded_files?: Json | null
          user_id?: string
          years_in_business?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          current_uses: number | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          max_uses: number | null
          updated_at: string
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          max_uses?: number | null
          updated_at?: string
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          max_uses?: number | null
          updated_at?: string
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          delivery_method: string
          delivery_status: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          items: Json
          order_id: string | null
          sent_at: string | null
          sms_sent_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          delivery_method?: string
          delivery_status?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          items: Json
          order_id?: string | null
          sent_at?: string | null
          sms_sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          delivery_method?: string
          delivery_status?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          items?: Json
          order_id?: string | null
          sent_at?: string | null
          sms_sent_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          description: string
          icon: string | null
          id: string
          is_active: boolean
          name: string
          points_required: number
          reward_type: string
          reward_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          points_required: number
          reward_type: string
          reward_value: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          points_required?: number
          reward_type?: string
          reward_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          company_info: Json | null
          contact_info: Json | null
          created_at: string
          id: string
          package_id: string | null
          payment_id: string | null
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company_info?: Json | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          package_id?: string | null
          payment_id?: string | null
          payment_method?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company_info?: Json | null
          contact_info?: Json | null
          created_at?: string
          id?: string
          package_id?: string | null
          payment_id?: string | null
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean | null
          category: string
          created_at: string
          description: string
          features: Json
          id: string
          popular: boolean | null
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string
          description: string
          features: Json
          id?: string
          popular?: boolean | null
          price: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string
          description?: string
          features?: Json
          id?: string
          popular?: boolean | null
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          points_earned: number
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          points_earned: number
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          points_earned?: number
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_milestones: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          current_points: number
          id: string
          is_completed: boolean
          milestone_id: string
          reward_claimed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          current_points?: number
          id?: string
          is_completed?: boolean
          milestone_id: string
          reward_claimed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          current_points?: number
          id?: string
          is_completed?: boolean
          milestone_id?: string
          reward_claimed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_random_coupon_code: {
        Args: {
          length?: number
        }
        Returns: string
      }
      get_user_available_rewards: {
        Args: {
          p_user_id: string
        }
        Returns: {
          milestone_id: string
          milestone_name: string
          milestone_description: string
          reward_type: string
          reward_value: number
          completed_at: string
          is_claimed: boolean
        }[]
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      update_user_milestone_progress: {
        Args: {
          p_user_id: string
          p_points: number
          p_activity_type: string
          p_reference_id?: string
          p_reference_type?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
