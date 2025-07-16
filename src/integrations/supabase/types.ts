export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          date: string
          slowmovingstock: Json | null
          suggestions: string | null
          topproducts: Json | null
          totalearnings: number | null
        }
        Insert: {
          date: string
          slowmovingstock?: Json | null
          suggestions?: string | null
          topproducts?: Json | null
          totalearnings?: number | null
        }
        Update: {
          date?: string
          slowmovingstock?: Json | null
          suggestions?: string | null
          topproducts?: Json | null
          totalearnings?: number | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          budgetthreshold: number | null
          createdat: string | null
          customerid: number
          loyaltypoints: number | null
          name: string | null
          phonenumber: string
        }
        Insert: {
          budgetthreshold?: number | null
          createdat?: string | null
          customerid?: number
          loyaltypoints?: number | null
          name?: string | null
          phonenumber: string
        }
        Update: {
          budgetthreshold?: number | null
          createdat?: string | null
          customerid?: number
          loyaltypoints?: number | null
          name?: string | null
          phonenumber?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          abandonRate: number | null
          batchnumber: string | null
          cartaddcount: number | null
          category: string | null
          closeToExpiry: boolean | null
          cluster: number | null
          conversionRate: number | null
          discount: number | null
          expirydate: string | null
          isonpromotion: boolean | null
          lastupdated: string | null
          location: string | null
          managementTip: string | null
          mrp: number | null
          name: string
          predictedSafeDiscount: number | null
          price: number
          productid: string
          profit: number | null
          qrgenerateddate: string | null
          qrlink: string | null
          restockthreshold: number | null
          salecount: number | null
          salesvelocity: number | null
          scannedcount: number | null
          shelfnumber: string | null
          smartSuggestions: string | null
          stockcount: number
          supplierid: string | null
          viewcount: number | null
        }
        Insert: {
          abandonRate?: number | null
          batchnumber?: string | null
          cartaddcount?: number | null
          category?: string | null
          closeToExpiry?: boolean | null
          cluster?: number | null
          conversionRate?: number | null
          discount?: number | null
          expirydate?: string | null
          isonpromotion?: boolean | null
          lastupdated?: string | null
          location?: string | null
          managementTip?: string | null
          mrp?: number | null
          name: string
          predictedSafeDiscount?: number | null
          price: number
          productid: string
          profit?: number | null
          qrgenerateddate?: string | null
          qrlink?: string | null
          restockthreshold?: number | null
          salecount?: number | null
          salesvelocity?: number | null
          scannedcount?: number | null
          shelfnumber?: string | null
          smartSuggestions?: string | null
          stockcount: number
          supplierid?: string | null
          viewcount?: number | null
        }
        Update: {
          abandonRate?: number | null
          batchnumber?: string | null
          cartaddcount?: number | null
          category?: string | null
          closeToExpiry?: boolean | null
          cluster?: number | null
          conversionRate?: number | null
          discount?: number | null
          expirydate?: string | null
          isonpromotion?: boolean | null
          lastupdated?: string | null
          location?: string | null
          managementTip?: string | null
          mrp?: number | null
          name?: string
          predictedSafeDiscount?: number | null
          price?: number
          productid?: string
          profit?: number | null
          qrgenerateddate?: string | null
          qrlink?: string | null
          restockthreshold?: number | null
          salecount?: number | null
          salesvelocity?: number | null
          scannedcount?: number | null
          shelfnumber?: string | null
          smartSuggestions?: string | null
          stockcount?: number
          supplierid?: string | null
          viewcount?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_password_hash: string | null
          budgetthreshold: number | null
          createdat: string | null
          employeeid: string | null
          id: string
          loyaltypoints: number | null
          name: string | null
          phonenumber: string | null
          role: string | null
        }
        Insert: {
          admin_password_hash?: string | null
          budgetthreshold?: number | null
          createdat?: string | null
          employeeid?: string | null
          id: string
          loyaltypoints?: number | null
          name?: string | null
          phonenumber?: string | null
          role?: string | null
        }
        Update: {
          admin_password_hash?: string | null
          budgetthreshold?: number | null
          createdat?: string | null
          employeeid?: string | null
          id?: string
          loyaltypoints?: number | null
          name?: string | null
          phonenumber?: string | null
          role?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          customerid: number | null
          productid: string | null
          rating: number | null
          reviewid: number
          timestamp: string | null
          userid: string | null
        }
        Insert: {
          comment?: string | null
          customerid?: number | null
          productid?: string | null
          rating?: number | null
          reviewid?: number
          timestamp?: string | null
          userid?: string | null
        }
        Update: {
          comment?: string | null
          customerid?: number | null
          productid?: string | null
          rating?: number | null
          reviewid?: number
          timestamp?: string | null
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "reviews_productid_fkey"
            columns: ["productid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["productid"]
          },
        ]
      }
      transactions: {
        Row: {
          customerid: number | null
          productid: string | null
          quantity: number
          timestamp: string | null
          totalprice: number
          transactionid: number
          userid: string | null
        }
        Insert: {
          customerid?: number | null
          productid?: string | null
          quantity: number
          timestamp?: string | null
          totalprice: number
          transactionid?: number
          userid?: string | null
        }
        Update: {
          customerid?: number | null
          productid?: string | null
          quantity?: number
          timestamp?: string | null
          totalprice?: number
          transactionid?: number
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customerid_fkey"
            columns: ["customerid"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customerid"]
          },
          {
            foreignKeyName: "transactions_productid_fkey"
            columns: ["productid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["productid"]
          },
        ]
      }
      virtual_carts: {
        Row: {
          addedat: string | null
          cartid: number
          phonenumber: string | null
          productid: string | null
          quantity: number
          userid: string | null
        }
        Insert: {
          addedat?: string | null
          cartid?: number
          phonenumber?: string | null
          productid?: string | null
          quantity: number
          userid?: string | null
        }
        Update: {
          addedat?: string | null
          cartid?: number
          phonenumber?: string | null
          productid?: string | null
          quantity?: number
          userid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "virtual_carts_productid_fkey"
            columns: ["productid"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["productid"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
