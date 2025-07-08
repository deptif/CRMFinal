export type Database = {
  public: {
    Tables: {
      accounts: {
        // ... existing code ...
      }
      activities: {
        // ... existing code ...
      }
      applications: {
        Row: {
          id: string
          name: string
          api_name: string
          description: string | null
          icon: string | null
          image: string | null
          url: string | null
          owner_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          api_name: string
          description?: string | null
          icon?: string | null
          image?: string | null
          url?: string | null
          owner_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          api_name?: string
          description?: string | null
          icon?: string | null
          image?: string | null
          url?: string | null
          owner_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cases: {
        // ... existing code ...
      }
    }
  }
} 