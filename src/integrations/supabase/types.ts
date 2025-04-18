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
      "Blog Creation": {
        Row: {
          "Blog Creation Status": Database["public"]["Enums"]["Blog Creation Status"]
          "blog creation workflow execution id": string | null
          created_at: string
          Discription: string | null
          "Final Article": string | null
          "Final Title": string | null
          "Goal of the Article": string | null
          "Hidden Insight": string | null
          id: number
          "Image Prompt": string | null
          Keywords: string | null
          "Meta Description": string | null
          "options for blog title and description data": Json[] | null
          "primary keyword": string | null
          "Search Intent": string | null
          "selected blog title, discription": Json[] | null
          "Semantic Analysis": string | null
          "Target Audience": string | null
          Title: string | null
          Tone: string | null
          "workflow execution id": string
          "Writing Style": string | null
        }
        Insert: {
          "Blog Creation Status"?: Database["public"]["Enums"]["Blog Creation Status"]
          "blog creation workflow execution id"?: string | null
          created_at?: string
          Discription?: string | null
          "Final Article"?: string | null
          "Final Title"?: string | null
          "Goal of the Article"?: string | null
          "Hidden Insight"?: string | null
          id?: number
          "Image Prompt"?: string | null
          Keywords?: string | null
          "Meta Description"?: string | null
          "options for blog title and description data"?: Json[] | null
          "primary keyword"?: string | null
          "Search Intent"?: string | null
          "selected blog title, discription"?: Json[] | null
          "Semantic Analysis"?: string | null
          "Target Audience"?: string | null
          Title?: string | null
          Tone?: string | null
          "workflow execution id": string
          "Writing Style"?: string | null
        }
        Update: {
          "Blog Creation Status"?: Database["public"]["Enums"]["Blog Creation Status"]
          "blog creation workflow execution id"?: string | null
          created_at?: string
          Discription?: string | null
          "Final Article"?: string | null
          "Final Title"?: string | null
          "Goal of the Article"?: string | null
          "Hidden Insight"?: string | null
          id?: number
          "Image Prompt"?: string | null
          Keywords?: string | null
          "Meta Description"?: string | null
          "options for blog title and description data"?: Json[] | null
          "primary keyword"?: string | null
          "Search Intent"?: string | null
          "selected blog title, discription"?: Json[] | null
          "Semantic Analysis"?: string | null
          "Target Audience"?: string | null
          Title?: string | null
          Tone?: string | null
          "workflow execution id"?: string
          "Writing Style"?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          categories: string[] | null
          content: Json
          created_at: string
          editor_id: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_original: boolean
          language_code: string
          meta_description: string | null
          original_id: string | null
          parent_version: number | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          tags: string[] | null
          title: string
          updated_at: string
          version_number: number
        }
        Insert: {
          author_id?: string | null
          categories?: string[] | null
          content?: Json
          created_at?: string
          editor_id?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id: string
          is_original?: boolean
          language_code: string
          meta_description?: string | null
          original_id?: string | null
          parent_version?: number | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
          version_number?: number
        }
        Update: {
          author_id?: string | null
          categories?: string[] | null
          content?: Json
          created_at?: string
          editor_id?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_original?: boolean
          language_code?: string
          meta_description?: string | null
          original_id?: string | null
          parent_version?: number | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      "Google Custom Search Data": {
        Row: {
          "AI suggested data:title, description and other": Json[] | null
          "category of keyword": Json[] | null
          countryCode: string | null
          created_at: string
          "historical keyword search data": Json[] | null
          id: number
          "keyword clusters": Json[] | null
          "organic Results": Json[] | null
          "people also ask": Json[] | null
          "piller and supporting content": Json[] | null
          "related queries": Json[] | null
          requestId: string
          searchQuery: string | null
          uuid: string
          "workflow execution id": string
        }
        Insert: {
          "AI suggested data:title, description and other"?: Json[] | null
          "category of keyword"?: Json[] | null
          countryCode?: string | null
          created_at?: string
          "historical keyword search data"?: Json[] | null
          id?: number
          "keyword clusters"?: Json[] | null
          "organic Results"?: Json[] | null
          "people also ask"?: Json[] | null
          "piller and supporting content"?: Json[] | null
          "related queries"?: Json[] | null
          requestId: string
          searchQuery?: string | null
          uuid?: string
          "workflow execution id": string
        }
        Update: {
          "AI suggested data:title, description and other"?: Json[] | null
          "category of keyword"?: Json[] | null
          countryCode?: string | null
          created_at?: string
          "historical keyword search data"?: Json[] | null
          id?: number
          "keyword clusters"?: Json[] | null
          "organic Results"?: Json[] | null
          "people also ask"?: Json[] | null
          "piller and supporting content"?: Json[] | null
          "related queries"?: Json[] | null
          requestId?: string
          searchQuery?: string | null
          uuid?: string
          "workflow execution id"?: string
        }
        Relationships: []
      }
      "Primary Research Table": {
        Row: {
          auto_complete: Json[] | null
          created_at: string
          Depth: number | null
          "execution Id": string | null
          id: number
          Laungage: string | null
          Limit: number | null
          Location: string | null
          "Primary Keyword": string | null
          Trigger: Database["public"]["Enums"]["Trigger for Primary Keyword"]
          uuid: string
          webhook_response: Json | null
          workflow_execution_id: string | null
        }
        Insert: {
          auto_complete?: Json[] | null
          created_at?: string
          Depth?: number | null
          "execution Id"?: string | null
          id?: number
          Laungage?: string | null
          Limit?: number | null
          Location?: string | null
          "Primary Keyword"?: string | null
          Trigger?: Database["public"]["Enums"]["Trigger for Primary Keyword"]
          uuid?: string
          webhook_response?: Json | null
          workflow_execution_id?: string | null
        }
        Update: {
          auto_complete?: Json[] | null
          created_at?: string
          Depth?: number | null
          "execution Id"?: string | null
          id?: number
          Laungage?: string | null
          Limit?: number | null
          Location?: string | null
          "Primary Keyword"?: string | null
          Trigger?: Database["public"]["Enums"]["Trigger for Primary Keyword"]
          uuid?: string
          webhook_response?: Json | null
          workflow_execution_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          language: string | null
          name: string | null
          organization: string | null
          phone: string | null
          trial_blogs_remaining: number | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id: string
          language?: string | null
          name?: string | null
          organization?: string | null
          phone?: string | null
          trial_blogs_remaining?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          language?: string | null
          name?: string | null
          organization?: string | null
          phone?: string | null
          trial_blogs_remaining?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          period: string
          plan_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          period: string
          plan_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          period?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          user_id?: string
        }
        Relationships: []
      }
      translation_workflows: {
        Row: {
          blog_id: string
          completed_languages: string[]
          created_at: string
          id: string
          initiated_by: string | null
          request_payload: Json | null
          requested_languages: string[]
          response_payload: Json | null
          status: Database["public"]["Enums"]["translation_status"]
          updated_at: string
          webhook_execution_id: string | null
        }
        Insert: {
          blog_id: string
          completed_languages?: string[]
          created_at?: string
          id?: string
          initiated_by?: string | null
          request_payload?: Json | null
          requested_languages?: string[]
          response_payload?: Json | null
          status?: Database["public"]["Enums"]["translation_status"]
          updated_at?: string
          webhook_execution_id?: string | null
        }
        Update: {
          blog_id?: string
          completed_languages?: string[]
          created_at?: string
          id?: string
          initiated_by?: string | null
          request_payload?: Json | null
          requested_languages?: string[]
          response_payload?: Json | null
          status?: Database["public"]["Enums"]["translation_status"]
          updated_at?: string
          webhook_execution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "translation_workflows_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "valid_blog_reference"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_admin_role: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      get_all_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
        }[]
      }
      get_user_roles: {
        Args: { user_id_param: string }
        Returns: {
          role: string
        }[]
      }
      has_role: {
        Args: { user_id_param: string; role_param: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
      "Blog Creation Status":
        | "Create Blog Now"
        | "Create Blog Later"
        | "No Action"
      blog_post_status: "draft" | "pending_review" | "published" | "archived"
      translation_status:
        | "pending"
        | "in_progress"
        | "review_needed"
        | "approved"
        | "rejected"
      "Trigger for Primary Keyword":
        | "Not Started"
        | "Get the Past Search Data"
        | "Already Got Search Data"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "moderator"],
      "Blog Creation Status": [
        "Create Blog Now",
        "Create Blog Later",
        "No Action",
      ],
      blog_post_status: ["draft", "pending_review", "published", "archived"],
      translation_status: [
        "pending",
        "in_progress",
        "review_needed",
        "approved",
        "rejected",
      ],
      "Trigger for Primary Keyword": [
        "Not Started",
        "Get the Past Search Data",
        "Already Got Search Data",
      ],
    },
  },
} as const
