/**
 * Hand-written placeholder mirroring supabase/schema.sql.
 * Replace with `npm run db:types` output once the project is live.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "PRINCESS" | "KNIGHT";
export type WishPriority = "WANT" | "REALLY_WANT" | "MUST_HAVE";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: UserRole;
          special_dates: Json;
          created_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role: UserRole;
          special_dates?: Json;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          role?: UserRole;
          special_dates?: Json;
          created_at?: string | null;
        };
        Relationships: [];
      };
      pings: {
        Row: {
          id: string;
          from_user: string;
          type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user: string;
          type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_user?: string;
          type?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pings_from_user_fkey";
            columns: ["from_user"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      wish_items: {
        Row: {
          id: string;
          title: string;
          url: string | null;
          image_url: string | null;
          price: number | null;
          currency: string | null;
          priority: WishPriority;
          note: string | null;
          is_secretly_buying: boolean;
          is_gifted: boolean;
          gifted_at: string | null;
          gift_message: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url?: string | null;
          image_url?: string | null;
          price?: number | null;
          currency?: string | null;
          priority?: WishPriority;
          note?: string | null;
          is_secretly_buying?: boolean;
          is_gifted?: boolean;
          gifted_at?: string | null;
          gift_message?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string | null;
          image_url?: string | null;
          price?: number | null;
          currency?: string | null;
          priority?: WishPriority;
          note?: string | null;
          is_secretly_buying?: boolean;
          is_gifted?: boolean;
          gifted_at?: string | null;
          gift_message?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wish_items_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      wish_priority: WishPriority;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type WishRow = Database["public"]["Tables"]["wish_items"]["Row"];
export type WishInsert = Database["public"]["Tables"]["wish_items"]["Insert"];
export type WishUpdate = Database["public"]["Tables"]["wish_items"]["Update"];
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
