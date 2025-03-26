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
        }
        Insert: {
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
        }
        Update: {
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
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: string
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
          name?: string | null
          organization?: string | null
          phone?: string | null
          trial_blogs_remaining?: number | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
        Args: {
          user_id_param: string
        }
        Returns: boolean
      }
      get_all_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
        }[]
      }
      get_user_roles: {
        Args: {
          user_id_param: string
        }
        Returns: {
          role: string
        }[]
      }
    }
    Enums: {
      "Blog Creation Status":
        | "Create Blog Now"
        | "Create Blog Later"
        | "No Action"
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
