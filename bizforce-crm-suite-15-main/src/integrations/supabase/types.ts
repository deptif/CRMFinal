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
      accounts: {
        Row: {
          address: string | null
          annual_revenue: number | null
          created_at: string | null
          email: string | null
          employees: number | null
          id: string
          industry: string | null
          name: string
          owner_id: string | null
          phone: string | null
          tags: string[] | null
          website: string | null
        }
        Insert: {
          address?: string | null
          annual_revenue?: number | null
          created_at?: string | null
          email?: string | null
          employees?: number | null
          id?: string
          industry?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          tags?: string[] | null
          website?: string | null
        }
        Update: {
          address?: string | null
          annual_revenue?: number | null
          created_at?: string | null
          email?: string | null
          employees?: number | null
          id?: string
          industry?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          tags?: string[] | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          owner_id: string | null
          related_id: string | null
          related_to: string | null
          status: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          related_id?: string | null
          related_to?: string | null
          status?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          owner_id?: string | null
          related_id?: string | null
          related_to?: string | null
          status?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_trail: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          object_id: string | null
          object_type: string
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          object_id?: string | null
          object_type: string
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          object_id?: string | null
          object_type?: string
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_trail_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number | null
          conversion_rate: number | null
          created_at: string | null
          end_date: string | null
          id: string
          leads_generated: number | null
          name: string
          owner_id: string | null
          roi: number | null
          start_date: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          budget?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          leads_generated?: number | null
          name: string
          owner_id?: string | null
          roi?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          budget?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          leads_generated?: number | null
          name?: string
          owner_id?: string | null
          roi?: number | null
          start_date?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          account_id: string | null
          account_name: string | null
          case_number: string
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          description: string | null
          id: string
          owner_id: string | null
          priority: string | null
          status: string | null
          subject: string
          type: string | null
        }
        Insert: {
          account_id?: string | null
          account_name?: string | null
          case_number: string
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          priority?: string | null
          status?: string | null
          subject: string
          type?: string | null
        }
        Update: {
          account_id?: string | null
          account_name?: string | null
          case_number?: string
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          owner_id?: string | null
          priority?: string | null
          status?: string | null
          subject?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          account_id: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          owner_id: string | null
          phone: string | null
          tags: string[] | null
          title: string | null
        }
        Insert: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          owner_id?: string | null
          phone?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          owner_id?: string | null
          phone?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_fields: {
        Row: {
          created_at: string | null
          default_value: string | null
          field_label: string
          field_name: string
          field_type: string | null
          id: string
          is_required: boolean | null
          object_type: string
          picklist_values: string[] | null
        }
        Insert: {
          created_at?: string | null
          default_value?: string | null
          field_label: string
          field_name: string
          field_type?: string | null
          id?: string
          is_required?: boolean | null
          object_type: string
          picklist_values?: string[] | null
        }
        Update: {
          created_at?: string | null
          default_value?: string | null
          field_label?: string
          field_name?: string
          field_type?: string | null
          id?: string
          is_required?: boolean | null
          object_type?: string
          picklist_values?: string[] | null
        }
        Relationships: []
      }
      customer_journey_stages: {
        Row: {
          completed_at: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          id: string
          owner_id: string | null
          stage_name: string
          stage_order: number
        }
        Insert: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string | null
          stage_name: string
          stage_order?: number
        }
        Update: {
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string | null
          stage_name?: string
          stage_order?: number
        }
        Relationships: []
      }
      dashboard_widgets: {
        Row: {
          created_at: string | null
          height: number | null
          id: string
          is_visible: boolean | null
          position_x: number | null
          position_y: number | null
          user_id: string | null
          widget_config: Json | null
          widget_type: string
          width: number | null
        }
        Insert: {
          created_at?: string | null
          height?: number | null
          id?: string
          is_visible?: boolean | null
          position_x?: number | null
          position_y?: number | null
          user_id?: string | null
          widget_config?: Json | null
          widget_type: string
          width?: number | null
        }
        Update: {
          created_at?: string | null
          height?: number | null
          id?: string
          is_visible?: boolean | null
          position_x?: number | null
          position_y?: number | null
          user_id?: string | null
          widget_config?: Json | null
          widget_type?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      document_attachments: {
        Row: {
          created_at: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          filename: string
          id: string
          related_id: string | null
          related_to: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          filename: string
          id?: string
          related_id?: string | null
          related_to?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          filename?: string
          id?: string
          related_id?: string | null
          related_to?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_type: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_type?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          configuration: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          name: string
          sync_status: string | null
          type: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name: string
          sync_status?: string | null
          type: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name?: string
          sync_status?: string | null
          type?: string
        }
        Relationships: []
      }
      multi_channel_campaigns: {
        Row: {
          budget: number | null
          channels: string[] | null
          conversion_rate: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          leads_generated: number | null
          name: string
          owner_id: string | null
          responses: number | null
          start_date: string | null
          status: string | null
          target_audience: string | null
        }
        Insert: {
          budget?: number | null
          channels?: string[] | null
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          leads_generated?: number | null
          name: string
          owner_id?: string | null
          responses?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
        }
        Update: {
          budget?: number | null
          channels?: string[] | null
          conversion_rate?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          leads_generated?: number | null
          name?: string
          owner_id?: string | null
          responses?: number | null
          start_date?: string | null
          status?: string | null
          target_audience?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          related_to: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          related_to?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          related_to?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          account_id: string | null
          amount: number | null
          close_date: string | null
          contact_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          owner_id: string | null
          probability: number | null
          stage: string | null
        }
        Insert: {
          account_id?: string | null
          amount?: number | null
          close_date?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
        }
        Update: {
          account_id?: string | null
          amount?: number | null
          close_date?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          probability?: number | null
          stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number | null
          sku: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price?: number | null
          sku?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          sku?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar: string | null
          company: string | null
          created_at: string | null
          department: string | null
          email: string | null
          id: string
          invited_at: string | null
          last_login: string | null
          name: string | null
          phone: string | null
          position: string | null
          role: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          company?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id: string
          invited_at?: string | null
          last_login?: string | null
          name?: string | null
          phone?: string | null
          position?: string | null
          role?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          company?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          id?: string
          invited_at?: string | null
          last_login?: string | null
          name?: string | null
          phone?: string | null
          position?: string | null
          role?: string | null
          status?: string | null
        }
        Relationships: []
      }
      quote_line_items: {
        Row: {
          created_at: string | null
          discount: number | null
          id: string
          product_id: string | null
          product_name: string
          quantity: number | null
          quote_id: string | null
          total: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          discount?: number | null
          id?: string
          product_id?: string | null
          product_name: string
          quantity?: number | null
          quote_id?: string | null
          total?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          discount?: number | null
          id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number | null
          quote_id?: string | null
          total?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_line_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_line_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string | null
          opportunity_name: string | null
          owner_id: string | null
          quote_number: string
          status: string | null
          total_amount: number | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          opportunity_name?: string | null
          owner_id?: string | null
          quote_number: string
          status?: string | null
          total_amount?: number | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          opportunity_name?: string | null
          owner_id?: string | null
          quote_number?: string
          status?: string | null
          total_amount?: number | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_quotas: {
        Row: {
          achieved_amount: number | null
          created_at: string | null
          id: string
          percentage: number | null
          period: string
          quarter: number | null
          quota_amount: number | null
          user_id: string | null
          user_name: string | null
          year: number
        }
        Insert: {
          achieved_amount?: number | null
          created_at?: string | null
          id?: string
          percentage?: number | null
          period: string
          quarter?: number | null
          quota_amount?: number | null
          user_id?: string | null
          user_name?: string | null
          year: number
        }
        Update: {
          achieved_amount?: number | null
          created_at?: string | null
          id?: string
          percentage?: number | null
          period?: string
          quarter?: number | null
          quota_amount?: number | null
          user_id?: string | null
          user_name?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_quotas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee: string | null
          assignee_name: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          labels: string[] | null
          owner_id: string | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          assignee_name?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          labels?: string[] | null
          owner_id?: string | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          assignee_name?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          labels?: string[] | null
          owner_id?: string | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      territories: {
        Row: {
          actual_revenue: number | null
          created_at: string | null
          description: string | null
          id: string
          manager_id: string | null
          manager_name: string | null
          members: string[] | null
          name: string
          region: string | null
          target_revenue: number | null
        }
        Insert: {
          actual_revenue?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          manager_id?: string | null
          manager_name?: string | null
          members?: string[] | null
          name: string
          region?: string | null
          target_revenue?: number | null
        }
        Update: {
          actual_revenue?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          manager_id?: string | null
          manager_name?: string | null
          members?: string[] | null
          name?: string
          region?: string | null
          target_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "territories_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_processes: {
        Row: {
          created_at: string | null
          description: string | null
          executions: number | null
          id: string
          name: string
          object_type: string
          owner_id: string | null
          process_type: string | null
          status: string | null
          steps: number | null
          success_rate: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          executions?: number | null
          id?: string
          name: string
          object_type: string
          owner_id?: string | null
          process_type?: string | null
          status?: string | null
          steps?: number | null
          success_rate?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          executions?: number | null
          id?: string
          name?: string
          object_type?: string
          owner_id?: string | null
          process_type?: string | null
          status?: string | null
          steps?: number | null
          success_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_processes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          configuration: Json | null
          created_at: string | null
          id: string
          process_id: string | null
          step_name: string
          step_order: number
          step_type: string | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          process_id?: string | null
          step_name: string
          step_order: number
          step_type?: string | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          id?: string
          process_id?: string | null
          step_name?: string
          step_order?: number
          step_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "workflow_processes"
            referencedColumns: ["id"]
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
    Enums: {},
  },
} as const
