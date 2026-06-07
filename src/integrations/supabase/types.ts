export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          city: string | null
          code: string | null
          company_id: string
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          code?: string | null
          company_id: string
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          code?: string | null
          company_id?: string
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          legal_name: string | null
          logo_url: string | null
          name: string
          phone: string | null
          registration_number: string | null
          tax_number: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          legal_name?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          registration_number?: string | null
          tax_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      competencies: {
        Row: {
          category: string
          competency_code: string
          competency_name_ar: string
          competency_name_en: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          competency_code: string
          competency_name_ar: string
          competency_name_en: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          competency_code?: string
          competency_name_ar?: string
          competency_name_en?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      competency_levels: {
        Row: {
          behavioral_indicators: Json | null
          competency_id: string
          created_at: string | null
          id: string
          level_name: string
          level_number: number
        }
        Insert: {
          behavioral_indicators?: Json | null
          competency_id: string
          created_at?: string | null
          id?: string
          level_name: string
          level_number: number
        }
        Update: {
          behavioral_indicators?: Json | null
          competency_id?: string
          created_at?: string | null
          id?: string
          level_name?: string
          level_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "competency_levels_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          branch_id: string
          code: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_hypotheses: {
        Row: {
          category: string
          confidence_score: number | null
          contradicting_evidence: Json | null
          created_at: string | null
          evidence_score: number | null
          evidence_strength_index: number | null
          hypothesis: string
          id: string
          rank_order: number | null
          reasoning: string | null
          report_id: string
          supporting_evidence: Json | null
          validated_at: string | null
          validation_actions: Json | null
          validation_notes: string | null
          validation_status: string | null
        }
        Insert: {
          category: string
          confidence_score?: number | null
          contradicting_evidence?: Json | null
          created_at?: string | null
          evidence_score?: number | null
          evidence_strength_index?: number | null
          hypothesis: string
          id?: string
          rank_order?: number | null
          reasoning?: string | null
          report_id: string
          supporting_evidence?: Json | null
          validated_at?: string | null
          validation_actions?: Json | null
          validation_notes?: string | null
          validation_status?: string | null
        }
        Update: {
          category?: string
          confidence_score?: number | null
          contradicting_evidence?: Json | null
          created_at?: string | null
          evidence_score?: number | null
          evidence_strength_index?: number | null
          hypothesis?: string
          id?: string
          rank_order?: number | null
          reasoning?: string | null
          report_id?: string
          supporting_evidence?: Json | null
          validated_at?: string | null
          validation_actions?: Json | null
          validation_notes?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_hypotheses_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "diagnostic_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostic_reports: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          deleted_at: string | null
          department_id: string | null
          employee_id: string | null
          evidence_score: number | null
          evidence_summary: string | null
          final_diagnosis: string | null
          generated_by: string | null
          historical_alignment_score: number | null
          id: string
          is_final: boolean | null
          is_manager_reviewed: boolean | null
          manager_review: string | null
          maturity_level: number | null
          performance_summary: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_assessment: string | null
          status: string | null
          team_id: string | null
          title: string
          updated_at: string | null
          validation_status: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          deleted_at?: string | null
          department_id?: string | null
          employee_id?: string | null
          evidence_score?: number | null
          evidence_summary?: string | null
          final_diagnosis?: string | null
          generated_by?: string | null
          historical_alignment_score?: number | null
          id?: string
          is_final?: boolean | null
          is_manager_reviewed?: boolean | null
          manager_review?: string | null
          maturity_level?: number | null
          performance_summary?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_assessment?: string | null
          status?: string | null
          team_id?: string | null
          title: string
          updated_at?: string | null
          validation_status?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          deleted_at?: string | null
          department_id?: string | null
          employee_id?: string | null
          evidence_score?: number | null
          evidence_summary?: string | null
          final_diagnosis?: string | null
          generated_by?: string | null
          historical_alignment_score?: number | null
          id?: string
          is_final?: boolean | null
          is_manager_reviewed?: boolean | null
          manager_review?: string | null
          maturity_level?: number | null
          performance_summary?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_assessment?: string | null
          status?: string | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_reports_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_reports_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnostic_reports_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_competencies: {
        Row: {
          assessed_by: string | null
          assessment_date: string
          competency_id: string
          created_at: string | null
          current_level: number
          employee_id: string
          evidence_reference: string | null
          id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          assessed_by?: string | null
          assessment_date: string
          competency_id: string
          created_at?: string | null
          current_level: number
          employee_id: string
          evidence_reference?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          assessed_by?: string | null
          assessment_date?: string
          competency_id?: string
          created_at?: string | null
          current_level?: number
          employee_id?: string
          evidence_reference?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_competencies_assessed_by_fkey"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_competencies_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          arabic_first_name: string | null
          arabic_last_name: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          employee_code: string | null
          employment_status: string | null
          first_name: string
          hire_date: string | null
          id: string
          is_active: boolean | null
          job_id: string | null
          last_name: string
          manager_id: string | null
          phone: string | null
          team_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          arabic_first_name?: string | null
          arabic_last_name?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          employee_code?: string | null
          employment_status?: string | null
          first_name: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          job_id?: string | null
          last_name: string
          manager_id?: string | null
          phone?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          arabic_first_name?: string | null
          arabic_last_name?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          employee_code?: string | null
          employment_status?: string | null
          first_name?: string
          hire_date?: string | null
          id?: string
          is_active?: boolean | null
          job_id?: string | null
          last_name?: string
          manager_id?: string | null
          phone?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          confidence_weight: number | null
          created_at: string | null
          deleted_at: string | null
          description: string
          employee_id: string | null
          evidence_type: string
          file_url: string | null
          id: string
          is_active: boolean | null
          reliability: string | null
          reliability_score: number | null
          snapshot_id: string | null
          source: string
          source_date: string | null
          submitted_by: string | null
          supporting_value: Json | null
          updated_at: string | null
          verification_date: string | null
          verification_status: string | null
          verified_by: string | null
        }
        Insert: {
          confidence_weight?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description: string
          employee_id?: string | null
          evidence_type: string
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          reliability?: string | null
          reliability_score?: number | null
          snapshot_id?: string | null
          source: string
          source_date?: string | null
          submitted_by?: string | null
          supporting_value?: Json | null
          updated_at?: string | null
          verification_date?: string | null
          verification_status?: string | null
          verified_by?: string | null
        }
        Update: {
          confidence_weight?: number | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          employee_id?: string | null
          evidence_type?: string
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          reliability?: string | null
          reliability_score?: number | null
          snapshot_id?: string | null
          source?: string
          source_date?: string | null
          submitted_by?: string | null
          supporting_value?: Json | null
          updated_at?: string | null
          verification_date?: string | null
          verification_status?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "performance_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      job_competencies: {
        Row: {
          competency_id: string
          created_at: string | null
          id: string
          importance_weight: number | null
          job_id: string
          required_level: number
        }
        Insert: {
          competency_id: string
          created_at?: string | null
          id?: string
          importance_weight?: number | null
          job_id: string
          required_level: number
        }
        Update: {
          competency_id?: string
          created_at?: string | null
          id?: string
          importance_weight?: number | null
          job_id?: string
          required_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_competencies_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_families: {
        Row: {
          code: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_grades: {
        Row: {
          code: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          level: number
          max_salary: number | null
          min_salary: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level: number
          max_salary?: number | null
          min_salary?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          max_salary?: number | null
          min_salary?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_profiles: {
        Row: {
          authorities: Json | null
          code: string | null
          competencies: Json | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          education_level: string | null
          id: string
          is_active: boolean | null
          job_family_id: string | null
          job_grade_id: string | null
          min_experience_years: number | null
          required_behaviors: Json | null
          required_certifications: Json | null
          required_knowledge: Json | null
          required_skills: Json | null
          required_training: Json | null
          responsibilities: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          authorities?: Json | null
          code?: string | null
          competencies?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          education_level?: string | null
          id?: string
          is_active?: boolean | null
          job_family_id?: string | null
          job_grade_id?: string | null
          min_experience_years?: number | null
          required_behaviors?: Json | null
          required_certifications?: Json | null
          required_knowledge?: Json | null
          required_skills?: Json | null
          required_training?: Json | null
          responsibilities?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          authorities?: Json | null
          code?: string | null
          competencies?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          education_level?: string | null
          id?: string
          is_active?: boolean | null
          job_family_id?: string | null
          job_grade_id?: string | null
          min_experience_years?: number | null
          required_behaviors?: Json | null
          required_certifications?: Json | null
          required_knowledge?: Json | null
          required_skills?: Json | null
          required_training?: Json | null
          responsibilities?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_profiles_job_family_id_fkey"
            columns: ["job_family_id"]
            isOneToOne: false
            referencedRelation: "job_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_profiles_job_grade_id_fkey"
            columns: ["job_grade_id"]
            isOneToOne: false
            referencedRelation: "job_grades"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          employee_id: string | null
          id: string
          is_active: boolean | null
          job_profile_id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          job_profile_id: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          job_profile_id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_job_profile_id_fkey"
            columns: ["job_profile_id"]
            isOneToOne: false
            referencedRelation: "job_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi_categories: {
        Row: {
          code: string | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kpi_relationships: {
        Row: {
          child_kpi_id: string
          created_at: string | null
          description: string | null
          id: string
          impact_weight: number | null
          parent_kpi_id: string
          relationship_type: string | null
        }
        Insert: {
          child_kpi_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          impact_weight?: number | null
          parent_kpi_id: string
          relationship_type?: string | null
        }
        Update: {
          child_kpi_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          impact_weight?: number | null
          parent_kpi_id?: string
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_relationships_child_kpi_id_fkey"
            columns: ["child_kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_relationships_parent_kpi_id_fkey"
            columns: ["parent_kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
        ]
      }
      kpis: {
        Row: {
          business_impact: string | null
          category_id: string | null
          code: string | null
          created_at: string | null
          critical_threshold: number | null
          data_source: string | null
          deleted_at: string | null
          description: string | null
          formula_definition: string | null
          id: string
          is_active: boolean | null
          is_higher_better: boolean | null
          measurement_frequency: string | null
          name: string
          owner_id: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
          warning_threshold: number | null
        }
        Insert: {
          business_impact?: string | null
          category_id?: string | null
          code?: string | null
          created_at?: string | null
          critical_threshold?: number | null
          data_source?: string | null
          deleted_at?: string | null
          description?: string | null
          formula_definition?: string | null
          id?: string
          is_active?: boolean | null
          is_higher_better?: boolean | null
          measurement_frequency?: string | null
          name: string
          owner_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          warning_threshold?: number | null
        }
        Update: {
          business_impact?: string | null
          category_id?: string | null
          code?: string | null
          created_at?: string | null
          critical_threshold?: number | null
          data_source?: string | null
          deleted_at?: string | null
          description?: string | null
          formula_definition?: string | null
          id?: string
          is_active?: boolean | null
          is_higher_better?: boolean | null
          measurement_frequency?: string | null
          name?: string
          owner_id?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          warning_threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kpi_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpis_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          is_used: boolean | null
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          is_used?: boolean | null
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          is_used?: boolean | null
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_snapshots: {
        Row: {
          actual_value: number | null
          created_at: string | null
          deleted_at: string | null
          employee_id: string
          gap_percentage: number | null
          gap_value: number | null
          id: string
          job_id: string | null
          kpi_id: string
          notes: string | null
          period: string
          recorded_by: string | null
          status: string | null
          target_value: number | null
          trend: string | null
          updated_at: string | null
          variance_percentage: number | null
        }
        Insert: {
          actual_value?: number | null
          created_at?: string | null
          deleted_at?: string | null
          employee_id: string
          gap_percentage?: number | null
          gap_value?: number | null
          id?: string
          job_id?: string | null
          kpi_id: string
          notes?: string | null
          period: string
          recorded_by?: string | null
          status?: string | null
          target_value?: number | null
          trend?: string | null
          updated_at?: string | null
          variance_percentage?: number | null
        }
        Update: {
          actual_value?: number | null
          created_at?: string | null
          deleted_at?: string | null
          employee_id?: string
          gap_percentage?: number | null
          gap_value?: number | null
          id?: string
          job_id?: string | null
          kpi_id?: string
          notes?: string | null
          period?: string
          recorded_by?: string | null
          status?: string | null
          target_value?: number | null
          trend?: string | null
          updated_at?: string | null
          variance_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_snapshots_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_snapshots_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_snapshots_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_snapshots_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          module: string
          name: string
        }
        Insert: {
          action: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          module: string
          name: string
        }
        Update: {
          action?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          name?: string
        }
        Relationships: []
      }
      process_dependencies: {
        Row: {
          created_at: string | null
          criticality: string | null
          dependency_type: string | null
          depends_on_process_id: string
          description: string | null
          id: string
          process_id: string
        }
        Insert: {
          created_at?: string | null
          criticality?: string | null
          dependency_type?: string | null
          depends_on_process_id: string
          description?: string | null
          id?: string
          process_id: string
        }
        Update: {
          created_at?: string | null
          criticality?: string | null
          dependency_type?: string | null
          depends_on_process_id?: string
          description?: string | null
          id?: string
          process_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_dependencies_depends_on_process_id_fkey"
            columns: ["depends_on_process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "process_dependencies_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_step_competencies: {
        Row: {
          competency_id: string
          created_at: string | null
          id: string
          process_step_id: string
          required_level: number
        }
        Insert: {
          competency_id: string
          created_at?: string | null
          id?: string
          process_step_id: string
          required_level: number
        }
        Update: {
          competency_id?: string
          created_at?: string | null
          id?: string
          process_step_id?: string
          required_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "process_step_competencies_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "process_step_competencies_process_step_id_fkey"
            columns: ["process_step_id"]
            isOneToOne: false
            referencedRelation: "process_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      process_steps: {
        Row: {
          common_errors: Json | null
          created_at: string | null
          deleted_at: string | null
          description: string | null
          evidence_sources: Json | null
          expected_duration: string | null
          id: string
          is_active: boolean | null
          name: string
          process_id: string
          required_skills: Json | null
          required_tools: Json | null
          step_number: number
          updated_at: string | null
        }
        Insert: {
          common_errors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          evidence_sources?: Json | null
          expected_duration?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          process_id: string
          required_skills?: Json | null
          required_tools?: Json | null
          step_number: number
          updated_at?: string | null
        }
        Update: {
          common_errors?: Json | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          evidence_sources?: Json | null
          expected_duration?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          process_id?: string
          required_skills?: Json | null
          required_tools?: Json | null
          step_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_steps_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          code: string | null
          created_at: string | null
          criticality: string | null
          deleted_at: string | null
          department_id: string | null
          description: string | null
          documentation_url: string | null
          failure_modes: Json | null
          id: string
          inputs: Json | null
          is_active: boolean | null
          name: string
          outputs: Json | null
          owner_id: string | null
          risk_level: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          criticality?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          documentation_url?: string | null
          failure_modes?: Json | null
          id?: string
          inputs?: Json | null
          is_active?: boolean | null
          name: string
          outputs?: Json | null
          owner_id?: string | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          criticality?: string | null
          deleted_at?: string | null
          department_id?: string | null
          description?: string | null
          documentation_url?: string | null
          failure_modes?: Json | null
          id?: string
          inputs?: Json | null
          is_active?: boolean | null
          name?: string
          outputs?: Json | null
          owner_id?: string | null
          risk_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processes_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          is_revoked: boolean | null
          token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          is_revoked?: boolean | null
          token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_revoked?: boolean | null
          token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          code: string | null
          created_at: string | null
          deleted_at: string | null
          department_id: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          team_leader_id: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          department_id: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          team_leader_id?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          deleted_at?: string | null
          department_id?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          team_leader_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          language: string | null
          last_login_at: string | null
          last_name: string
          password_changed_at: string | null
          password_hash: string
          phone: string | null
          role_id: string
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_login_at?: string | null
          last_name: string
          password_changed_at?: string | null
          password_hash: string
          phone?: string | null
          role_id: string
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          language?: string | null
          last_login_at?: string | null
          last_name?: string
          password_changed_at?: string | null
          password_hash?: string
          phone?: string | null
          role_id?: string
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
