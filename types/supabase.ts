export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      callouts: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          date_end: string | null
          date_start: string | null
          deleted: boolean | null
          description: string | null
          exposed_to_smoke: boolean | null
          exposed_to_smoke_time: number | null
          exposed_to_toxic_smoke: number | null
          id: number
          latitude: string | null
          longitude: string | null
          time_end: string | null
          time_start: string | null
          type: string | null
          users: string[] | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_end?: string | null
          date_start?: string | null
          deleted?: boolean | null
          description?: string | null
          exposed_to_smoke?: boolean | null
          exposed_to_smoke_time?: number | null
          exposed_to_toxic_smoke?: number | null
          id?: number
          latitude?: string | null
          longitude?: string | null
          time_end?: string | null
          time_start?: string | null
          type?: string | null
          users?: string[] | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_end?: string | null
          date_start?: string | null
          deleted?: boolean | null
          description?: string | null
          exposed_to_smoke?: boolean | null
          exposed_to_smoke_time?: number | null
          exposed_to_toxic_smoke?: number | null
          id?: number
          latitude?: string | null
          longitude?: string | null
          time_end?: string | null
          time_start?: string | null
          type?: string | null
          users?: string[] | null
          zip?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          abbrivation: string | null
          address: string | null
          city: string | null
          code: string | null
          code_full: string | null
          code_prefix: string | null
          created_at: string | null
          id: number
          invite_code: string | null
          latitude: string | null
          longitude: string | null
          name: string | null
          zip: string | null
        }
        Insert: {
          abbrivation?: string | null
          address?: string | null
          city?: string | null
          code?: string | null
          code_full?: string | null
          code_prefix?: string | null
          created_at?: string | null
          id?: number
          invite_code?: string | null
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          zip?: string | null
        }
        Update: {
          abbrivation?: string | null
          address?: string | null
          city?: string | null
          code?: string | null
          code_full?: string | null
          code_prefix?: string | null
          created_at?: string | null
          id?: number
          invite_code?: string | null
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      stations: {
        Row: {
          address: string | null
          city: string | null
          code: string | null
          code_full: string | null
          code_prefix: string | null
          created_at: string | null
          id: number
          invite_code: string | null
          latitude: string | null
          longitude: string | null
          name: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string | null
          code_full?: string | null
          code_prefix?: string | null
          created_at?: string | null
          id?: number
          invite_code?: string | null
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string | null
          code_full?: string | null
          code_prefix?: string | null
          created_at?: string | null
          id?: number
          invite_code?: string | null
          latitude?: string | null
          longitude?: string | null
          name?: string | null
          zip?: string | null
        }
        Relationships: []
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
