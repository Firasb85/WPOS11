export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      action_plans: {
        Row: {
          action_number: number;
          case_id: string;
          completed_at: string | null;
          created_at: string | null;
          description: string;
          end_date: string | null;
          id: string;
          owner_id: string | null;
          progress: number | null;
          result: string | null;
          start_date: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          action_number: number;
          case_id: string;
          completed_at?: string | null;
          created_at?: string | null;
          description: string;
          end_date?: string | null;
          id?: string;
          owner_id?: string | null;
          progress?: number | null;
          result?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          action_number?: number;
          case_id?: string;
          completed_at?: string | null;
          created_at?: string | null;
          description?: string;
          end_date?: string | null;
          id?: string;
          owner_id?: string | null;
          progress?: number | null;
          result?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string | null;
          description: string | null;
          entity_id: string | null;
          entity_type: string;
          id: string;
          ip_address: string | null;
          new_values: Json | null;
          old_values: Json | null;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string | null;
          description?: string | null;
          entity_id?: string | null;
          entity_type: string;
          id?: string;
          ip_address?: string | null;
          new_values?: Json | null;
          old_values?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string | null;
          description?: string | null;
          entity_id?: string | null;
          entity_type?: string;
          id?: string;
          ip_address?: string | null;
          new_values?: Json | null;
          old_values?: Json | null;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      branches: {
        Row: {
          address: string | null;
          city: string | null;
          code: string | null;
          company_id: string;
          country: string | null;
          created_at: string | null;
          deleted_at: string | null;
          email: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          phone: string | null;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          code?: string | null;
          company_id: string;
          country?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          phone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          code?: string | null;
          company_id?: string;
          country?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          phone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      case_interventions: {
        Row: {
          case_id: string;
          cost: number | null;
          created_at: string | null;
          custom_description: string | null;
          duration: string | null;
          effectiveness_score: number | null;
          end_date: string | null;
          id: string;
          intervention_id: string | null;
          outcome: string | null;
          owner_id: string | null;
          start_date: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          case_id: string;
          cost?: number | null;
          created_at?: string | null;
          custom_description?: string | null;
          duration?: string | null;
          effectiveness_score?: number | null;
          end_date?: string | null;
          id?: string;
          intervention_id?: string | null;
          outcome?: string | null;
          owner_id?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          case_id?: string;
          cost?: number | null;
          created_at?: string | null;
          custom_description?: string | null;
          duration?: string | null;
          effectiveness_score?: number | null;
          end_date?: string | null;
          id?: string;
          intervention_id?: string | null;
          outcome?: string | null;
          owner_id?: string | null;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      cases: {
        Row: {
          case_number: string;
          closure_date: string | null;
          created_at: string | null;
          created_by: string | null;
          deleted_at: string | null;
          department_id: string | null;
          description: string | null;
          diagnostic_report_id: string | null;
          due_date: string | null;
          employee_id: string;
          id: string;
          manager_id: string | null;
          priority: string | null;
          root_cause_category: string | null;
          root_cause_code: string | null;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          case_number: string;
          closure_date?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          department_id?: string | null;
          description?: string | null;
          diagnostic_report_id?: string | null;
          due_date?: string | null;
          employee_id: string;
          id?: string;
          manager_id?: string | null;
          priority?: string | null;
          root_cause_category?: string | null;
          root_cause_code?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          case_number?: string;
          closure_date?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          department_id?: string | null;
          description?: string | null;
          diagnostic_report_id?: string | null;
          due_date?: string | null;
          employee_id?: string;
          id?: string;
          manager_id?: string | null;
          priority?: string | null;
          root_cause_category?: string | null;
          root_cause_code?: string | null;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          deleted_at: string | null;
          email: string | null;
          id: string;
          is_active: boolean | null;
          legal_name: string | null;
          logo_url: string | null;
          name: string;
          phone: string | null;
          registration_number: string | null;
          tax_number: string | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          legal_name?: string | null;
          logo_url?: string | null;
          name: string;
          phone?: string | null;
          registration_number?: string | null;
          tax_number?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_active?: boolean | null;
          legal_name?: string | null;
          logo_url?: string | null;
          name?: string;
          phone?: string | null;
          registration_number?: string | null;
          tax_number?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      competencies: {
        Row: {
          category: string;
          competency_code: string;
          competency_name_ar: string;
          competency_name_en: string;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          category: string;
          competency_code: string;
          competency_name_ar: string;
          competency_name_en: string;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          category?: string;
          competency_code?: string;
          competency_name_ar?: string;
          competency_name_en?: string;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      competency_levels: {
        Row: {
          behavioral_indicators: Json | null;
          competency_id: string;
          created_at: string | null;
          id: string;
          level_name: string;
          level_number: number;
        };
        Insert: {
          behavioral_indicators?: Json | null;
          competency_id: string;
          created_at?: string | null;
          id?: string;
          level_name: string;
          level_number: number;
        };
        Update: {
          behavioral_indicators?: Json | null;
          competency_id?: string;
          created_at?: string | null;
          id?: string;
          level_name?: string;
          level_number?: number;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          branch_id: string;
          code: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          manager_id: string | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          branch_id: string;
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          manager_id?: string | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          branch_id?: string;
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          manager_id?: string | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      diagnostic_hypotheses: {
        Row: {
          category: string;
          confidence_score: number | null;
          contradicting_evidence: Json | null;
          created_at: string | null;
          evidence_score: number | null;
          evidence_strength_index: number | null;
          hypothesis: string;
          id: string;
          rank_order: number | null;
          reasoning: string | null;
          report_id: string;
          supporting_evidence: Json | null;
          validated_at: string | null;
          validation_actions: Json | null;
          validation_notes: string | null;
          validation_status: string | null;
        };
        Insert: {
          category: string;
          confidence_score?: number | null;
          contradicting_evidence?: Json | null;
          created_at?: string | null;
          evidence_score?: number | null;
          evidence_strength_index?: number | null;
          hypothesis: string;
          id?: string;
          rank_order?: number | null;
          reasoning?: string | null;
          report_id: string;
          supporting_evidence?: Json | null;
          validated_at?: string | null;
          validation_actions?: Json | null;
          validation_notes?: string | null;
          validation_status?: string | null;
        };
        Update: {
          category?: string;
          confidence_score?: number | null;
          contradicting_evidence?: Json | null;
          created_at?: string | null;
          evidence_score?: number | null;
          evidence_strength_index?: number | null;
          hypothesis?: string;
          id?: string;
          rank_order?: number | null;
          reasoning?: string | null;
          report_id?: string;
          supporting_evidence?: Json | null;
          validated_at?: string | null;
          validation_actions?: Json | null;
          validation_notes?: string | null;
          validation_status?: string | null;
        };
        Relationships: [];
      };
      diagnostic_reports: {
        Row: {
          confidence_score: number | null;
          created_at: string | null;
          deleted_at: string | null;
          department_id: string | null;
          employee_id: string | null;
          evidence_score: number | null;
          evidence_summary: string | null;
          final_diagnosis: string | null;
          generated_by: string | null;
          historical_alignment_score: number | null;
          id: string;
          is_final: boolean | null;
          is_manager_reviewed: boolean | null;
          manager_review: string | null;
          maturity_level: number | null;
          performance_summary: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          risk_assessment: string | null;
          status: string | null;
          team_id: string | null;
          title: string;
          updated_at: string | null;
          validation_status: string | null;
        };
        Insert: {
          confidence_score?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          department_id?: string | null;
          employee_id?: string | null;
          evidence_score?: number | null;
          evidence_summary?: string | null;
          final_diagnosis?: string | null;
          generated_by?: string | null;
          historical_alignment_score?: number | null;
          id?: string;
          is_final?: boolean | null;
          is_manager_reviewed?: boolean | null;
          manager_review?: string | null;
          maturity_level?: number | null;
          performance_summary?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          risk_assessment?: string | null;
          status?: string | null;
          team_id?: string | null;
          title: string;
          updated_at?: string | null;
          validation_status?: string | null;
        };
        Update: {
          confidence_score?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          department_id?: string | null;
          employee_id?: string | null;
          evidence_score?: number | null;
          evidence_summary?: string | null;
          final_diagnosis?: string | null;
          generated_by?: string | null;
          historical_alignment_score?: number | null;
          id?: string;
          is_final?: boolean | null;
          is_manager_reviewed?: boolean | null;
          manager_review?: string | null;
          maturity_level?: number | null;
          performance_summary?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          risk_assessment?: string | null;
          status?: string | null;
          team_id?: string | null;
          title?: string;
          updated_at?: string | null;
          validation_status?: string | null;
        };
        Relationships: [];
      };
      employee_competencies: {
        Row: {
          assessed_by: string | null;
          assessment_date: string;
          competency_id: string;
          created_at: string | null;
          current_level: number;
          employee_id: string;
          evidence_reference: string | null;
          id: string;
          notes: string | null;
          updated_at: string | null;
        };
        Insert: {
          assessed_by?: string | null;
          assessment_date: string;
          competency_id: string;
          created_at?: string | null;
          current_level: number;
          employee_id: string;
          evidence_reference?: string | null;
          id?: string;
          notes?: string | null;
          updated_at?: string | null;
        };
        Update: {
          assessed_by?: string | null;
          assessment_date?: string;
          competency_id?: string;
          created_at?: string | null;
          current_level?: number;
          employee_id?: string;
          evidence_reference?: string | null;
          id?: string;
          notes?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      employees: {
        Row: {
          arabic_first_name: string | null;
          arabic_last_name: string | null;
          created_at: string | null;
          deleted_at: string | null;
          email: string | null;
          employee_code: string | null;
          employment_status: string | null;
          first_name: string;
          hire_date: string | null;
          id: string;
          is_active: boolean | null;
          job_id: string | null;
          last_name: string;
          manager_id: string | null;
          phone: string | null;
          team_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          arabic_first_name?: string | null;
          arabic_last_name?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          employee_code?: string | null;
          employment_status?: string | null;
          first_name: string;
          hire_date?: string | null;
          id?: string;
          is_active?: boolean | null;
          job_id?: string | null;
          last_name: string;
          manager_id?: string | null;
          phone?: string | null;
          team_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          arabic_first_name?: string | null;
          arabic_last_name?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string | null;
          employee_code?: string | null;
          employment_status?: string | null;
          first_name?: string;
          hire_date?: string | null;
          id?: string;
          is_active?: boolean | null;
          job_id?: string | null;
          last_name?: string;
          manager_id?: string | null;
          phone?: string | null;
          team_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      evidence: {
        Row: {
          confidence_weight: number | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string;
          employee_id: string | null;
          evidence_type: string;
          file_url: string | null;
          id: string;
          is_active: boolean | null;
          reliability: string | null;
          reliability_score: number | null;
          snapshot_id: string | null;
          source: string;
          source_date: string | null;
          submitted_by: string | null;
          supporting_value: Json | null;
          updated_at: string | null;
          verification_date: string | null;
          verification_status: string | null;
          verified_by: string | null;
        };
        Insert: {
          confidence_weight?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description: string;
          employee_id?: string | null;
          evidence_type: string;
          file_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          reliability?: string | null;
          reliability_score?: number | null;
          snapshot_id?: string | null;
          source: string;
          source_date?: string | null;
          submitted_by?: string | null;
          supporting_value?: Json | null;
          updated_at?: string | null;
          verification_date?: string | null;
          verification_status?: string | null;
          verified_by?: string | null;
        };
        Update: {
          confidence_weight?: number | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string;
          employee_id?: string | null;
          evidence_type?: string;
          file_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          reliability?: string | null;
          reliability_score?: number | null;
          snapshot_id?: string | null;
          source?: string;
          source_date?: string | null;
          submitted_by?: string | null;
          supporting_value?: Json | null;
          updated_at?: string | null;
          verification_date?: string | null;
          verification_status?: string | null;
          verified_by?: string | null;
        };
        Relationships: [];
      };
      follow_ups: {
        Row: {
          case_id: string;
          check_in_date: string;
          conducted_at: string | null;
          conducted_by: string | null;
          created_at: string | null;
          follow_up_type: string;
          id: string;
          improvement_pct: number | null;
          kpi_value_after: number | null;
          kpi_value_before: number | null;
          notes: string | null;
          result: string | null;
          status: string | null;
        };
        Insert: {
          case_id: string;
          check_in_date: string;
          conducted_at?: string | null;
          conducted_by?: string | null;
          created_at?: string | null;
          follow_up_type: string;
          id?: string;
          improvement_pct?: number | null;
          kpi_value_after?: number | null;
          kpi_value_before?: number | null;
          notes?: string | null;
          result?: string | null;
          status?: string | null;
        };
        Update: {
          case_id?: string;
          check_in_date?: string;
          conducted_at?: string | null;
          conducted_by?: string | null;
          created_at?: string | null;
          follow_up_type?: string;
          id?: string;
          improvement_pct?: number | null;
          kpi_value_after?: number | null;
          kpi_value_before?: number | null;
          notes?: string | null;
          result?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      interventions: {
        Row: {
          code: string | null;
          created_at: string | null;
          description: string | null;
          expected_outcome: string | null;
          id: string;
          is_active: boolean | null;
          name_ar: string | null;
          name_en: string;
          success_metrics: Json | null;
          type: string;
          typical_cost: number | null;
          typical_duration: string | null;
          updated_at: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          description?: string | null;
          expected_outcome?: string | null;
          id?: string;
          is_active?: boolean | null;
          name_ar?: string | null;
          name_en: string;
          success_metrics?: Json | null;
          type: string;
          typical_cost?: number | null;
          typical_duration?: string | null;
          updated_at?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          description?: string | null;
          expected_outcome?: string | null;
          id?: string;
          is_active?: boolean | null;
          name_ar?: string | null;
          name_en?: string;
          success_metrics?: Json | null;
          type?: string;
          typical_cost?: number | null;
          typical_duration?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      job_competencies: {
        Row: {
          competency_id: string;
          created_at: string | null;
          id: string;
          importance_weight: number | null;
          job_id: string;
          required_level: number;
        };
        Insert: {
          competency_id: string;
          created_at?: string | null;
          id?: string;
          importance_weight?: number | null;
          job_id: string;
          required_level: number;
        };
        Update: {
          competency_id?: string;
          created_at?: string | null;
          id?: string;
          importance_weight?: number | null;
          job_id?: string;
          required_level?: number;
        };
        Relationships: [];
      };
      job_families: {
        Row: {
          code: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          name_ar: string | null;
          updated_at: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          name_ar?: string | null;
          updated_at?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          name_ar?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      job_grades: {
        Row: {
          code: string | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          level: number;
          name: string;
          name_ar: string | null;
          salary_max: number | null;
          salary_min: number | null;
          updated_at: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          level: number;
          name: string;
          name_ar?: string | null;
          salary_max?: number | null;
          salary_min?: number | null;
          updated_at?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          level?: number;
          name?: string;
          name_ar?: string | null;
          salary_max?: number | null;
          salary_min?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      job_profiles: {
        Row: {
          certifications: Json | null;
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          family_id: string | null;
          grade_id: string | null;
          id: string;
          requirements: string | null;
          skills: Json | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          certifications?: Json | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          family_id?: string | null;
          grade_id?: string | null;
          id?: string;
          requirements?: string | null;
          skills?: Json | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          certifications?: Json | null;
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          family_id?: string | null;
          grade_id?: string | null;
          id?: string;
          requirements?: string | null;
          skills?: Json | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          employee_id: string | null;
          id: string;
          is_active: boolean | null;
          job_profile_id: string;
          status: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          employee_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          job_profile_id: string;
          status?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          employee_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          job_profile_id?: string;
          status?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      kpi_categories: {
        Row: {
          code: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      kpi_relationships: {
        Row: {
          child_kpi_id: string;
          created_at: string | null;
          id: string;
          impact_weight: number | null;
          parent_kpi_id: string;
          relationship_type: string | null;
        };
        Insert: {
          child_kpi_id: string;
          created_at?: string | null;
          id?: string;
          impact_weight?: number | null;
          parent_kpi_id: string;
          relationship_type?: string | null;
        };
        Update: {
          child_kpi_id?: string;
          created_at?: string | null;
          id?: string;
          impact_weight?: number | null;
          parent_kpi_id?: string;
          relationship_type?: string | null;
        };
        Relationships: [];
      };
      kpis: {
        Row: {
          category_id: string | null;
          code: string;
          created_at: string | null;
          critical_threshold: number | null;
          id: string;
          is_higher_better: boolean | null;
          measurement_frequency: string;
          name: string;
          owner_id: string | null;
          target_value: number | null;
          unit: string | null;
          updated_at: string | null;
          warning_threshold: number | null;
        };
        Insert: {
          category_id?: string | null;
          code: string;
          created_at?: string | null;
          critical_threshold?: number | null;
          id?: string;
          is_higher_better?: boolean | null;
          measurement_frequency: string;
          name: string;
          owner_id?: string | null;
          target_value?: number | null;
          unit?: string | null;
          updated_at?: string | null;
          warning_threshold?: number | null;
        };
        Update: {
          category_id?: string | null;
          code?: string;
          created_at?: string | null;
          critical_threshold?: number | null;
          id?: string;
          is_higher_better?: boolean | null;
          measurement_frequency?: string;
          name?: string;
          owner_id?: string | null;
          target_value?: number | null;
          unit?: string | null;
          updated_at?: string | null;
          warning_threshold?: number | null;
        };
        Relationships: [];
      };
      password_reset_tokens: {
        Row: {
          created_at: string | null;
          expires_at: string;
          id: string;
          is_used: boolean | null;
          token: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          expires_at: string;
          id?: string;
          is_used?: boolean | null;
          token: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          expires_at?: string;
          id?: string;
          is_used?: boolean | null;
          token?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      performance_snapshots: {
        Row: {
          actual_value: number | null;
          created_at: string | null;
          employee_id: string | null;
          gap_percentage: number | null;
          gap_value: number | null;
          id: string;
          kpi_id: string | null;
          period: string | null;
          status: string | null;
          target_value: number | null;
          trend: string | null;
        };
        Insert: {
          actual_value?: number | null;
          created_at?: string | null;
          employee_id?: string | null;
          gap_percentage?: number | null;
          gap_value?: number | null;
          id?: string;
          kpi_id?: string | null;
          period?: string | null;
          status?: string | null;
          target_value?: number | null;
          trend?: string | null;
        };
        Update: {
          actual_value?: number | null;
          created_at?: string | null;
          employee_id?: string | null;
          gap_percentage?: number | null;
          gap_value?: number | null;
          id?: string;
          kpi_id?: string | null;
          period?: string | null;
          status?: string | null;
          target_value?: number | null;
          trend?: string | null;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          action: string;
          code: string;
          created_at: string | null;
          description: string | null;
          id: string;
          module: string;
          name: string;
        };
        Insert: {
          action: string;
          code: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          module: string;
          name: string;
        };
        Update: {
          action?: string;
          code?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          module?: string;
          name?: string;
        };
        Relationships: [];
      };
      process_dependencies: {
        Row: {
          created_at: string | null;
          criticality: string | null;
          dependency_type: string | null;
          depends_on_process_id: string;
          id: string;
          process_id: string;
        };
        Insert: {
          created_at?: string | null;
          criticality?: string | null;
          dependency_type?: string | null;
          depends_on_process_id: string;
          id?: string;
          process_id: string;
        };
        Update: {
          created_at?: string | null;
          criticality?: string | null;
          dependency_type?: string | null;
          depends_on_process_id?: string;
          id?: string;
          process_id?: string;
        };
        Relationships: [];
      };
      process_step_competencies: {
        Row: {
          competency_id: string;
          created_at: string | null;
          id: string;
          process_step_id: string;
          required_level: number;
        };
        Insert: {
          competency_id: string;
          created_at?: string | null;
          id?: string;
          process_step_id: string;
          required_level: number;
        };
        Update: {
          competency_id?: string;
          created_at?: string | null;
          id?: string;
          process_step_id?: string;
          required_level?: number;
        };
        Relationships: [];
      };
      process_steps: {
        Row: {
          common_errors: Json | null;
          created_at: string | null;
          description: string | null;
          expected_duration: string | null;
          id: string;
          name: string;
          process_id: string;
          required_tools: Json | null;
          step_number: number;
        };
        Insert: {
          common_errors?: Json | null;
          created_at?: string | null;
          description?: string | null;
          expected_duration?: string | null;
          id?: string;
          name: string;
          process_id: string;
          required_tools?: Json | null;
          step_number: number;
        };
        Update: {
          common_errors?: Json | null;
          created_at?: string | null;
          description?: string | null;
          expected_duration?: string | null;
          id?: string;
          name?: string;
          process_id?: string;
          required_tools?: Json | null;
          step_number?: number;
        };
        Relationships: [];
      };
      processes: {
        Row: {
          code: string;
          created_at: string | null;
          criticality: string | null;
          deleted_at: string | null;
          department_id: string | null;
          description: string | null;
          documentation_url: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          owner_id: string | null;
          risk_level: string | null;
          updated_at: string | null;
          version: number | null;
        };
        Insert: {
          code: string;
          created_at?: string | null;
          criticality?: string | null;
          deleted_at?: string | null;
          department_id?: string | null;
          description?: string | null;
          documentation_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          owner_id?: string | null;
          risk_level?: string | null;
          updated_at?: string | null;
          version?: number | null;
        };
        Update: {
          code?: string;
          created_at?: string | null;
          criticality?: string | null;
          deleted_at?: string | null;
          department_id?: string | null;
          description?: string | null;
          documentation_url?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          owner_id?: string | null;
          risk_level?: string | null;
          updated_at?: string | null;
          version?: number | null;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          created_at: string | null;
          id: string;
          permission_id: string;
          role_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          permission_id: string;
          role_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          permission_id?: string;
          role_id?: string;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          created_at: string | null;
          deleted_at: string | null;
          description: string | null;
          id: string;
          is_system: boolean | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_system?: boolean | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          id?: string;
          is_system?: boolean | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          created_at: string | null;
          expires_at: string;
          id: string;
          ip_address: string | null;
          is_revoked: boolean | null;
          token: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          expires_at: string;
          id?: string;
          ip_address?: string | null;
          is_revoked?: boolean | null;
          token: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          expires_at?: string;
          id?: string;
          ip_address?: string | null;
          is_revoked?: boolean | null;
          token?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          code: string | null;
          created_at: string | null;
          deleted_at: string | null;
          department_id: string;
          description: string | null;
          id: string;
          is_active: boolean | null;
          leader_id: string | null;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          department_id: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          leader_id?: string | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          department_id?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          leader_id?: string | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          deleted_at: string | null;
          email: string;
          first_name: string;
          id: string;
          is_active: boolean | null;
          language: string | null;
          last_login_at: string | null;
          last_name: string;
          password_changed_at: string | null;
          password_hash: string;
          phone: string | null;
          role_id: string;
          theme: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email: string;
          first_name: string;
          id?: string;
          is_active?: boolean | null;
          language?: string | null;
          last_login_at?: string | null;
          last_name: string;
          password_changed_at?: string | null;
          password_hash: string;
          phone?: string | null;
          role_id: string;
          theme?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          is_active?: boolean | null;
          language?: string | null;
          last_login_at?: string | null;
          last_name?: string;
          password_changed_at?: string | null;
          password_hash?: string;
          phone?: string | null;
          role_id?: string;
          theme?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

