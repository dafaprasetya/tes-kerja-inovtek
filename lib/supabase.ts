import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string
          title: string
          department: string
          location: string
          type: string
          status: 'open' | 'closed' | 'draft'
          description: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>
      }
      candidates: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          position: string
          status: 'applied' | 'interview' | 'hired' | 'rejected'
          job_id: string
          applied_at: string
          avatar_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['candidates']['Row'], 'id' | 'applied_at'>
        Update: Partial<Database['public']['Tables']['candidates']['Insert']>
      }
    }
  }
}
