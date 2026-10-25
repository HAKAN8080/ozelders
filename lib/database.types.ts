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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string
          kazanim_scores: Json | null
          net_score: number | null
          source_ref: string | null
          student_id: string
          taken_at: string
          type: Database["public"]["Enums"]["assessment_type"]
        }
        Insert: {
          id?: string
          kazanim_scores?: Json | null
          net_score?: number | null
          source_ref?: string | null
          student_id: string
          taken_at?: string
          type: Database["public"]["Enums"]["assessment_type"]
        }
        Update: {
          id?: string
          kazanim_scores?: Json | null
          net_score?: number | null
          source_ref?: string | null
          student_id?: string
          taken_at?: string
          type?: Database["public"]["Enums"]["assessment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          detail: Json | null
          entity: string
          entity_id: string | null
          id: number
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          entity: string
          entity_id?: string | null
          id?: number
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          detail?: Json | null
          entity?: string
          entity_id?: string | null
          id?: number
        }
        Relationships: []
      }
      exam_attempts: {
        Row: {
          access_token: string
          answers: Json
          created_at: string
          display_name: string | null
          exam_id: string
          grade: number | null
          id: string
          results: Json
          student_id: string | null
          total_net: number
          user_id: string | null
        }
        Insert: {
          access_token?: string
          answers: Json
          created_at?: string
          display_name?: string | null
          exam_id: string
          grade?: number | null
          id?: string
          results: Json
          student_id?: string | null
          total_net: number
          user_id?: string | null
        }
        Update: {
          access_token?: string
          answers?: Json
          created_at?: string
          display_name?: string | null
          exam_id?: string
          grade?: number | null
          id?: string
          results?: Json
          student_id?: string | null
          total_net?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_attempts_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_question_images: {
        Row: {
          exam_id: string
          height: number | null
          no: number
          path: string
          section: string
          updated_at: string
          width: number | null
        }
        Insert: {
          exam_id: string
          height?: number | null
          no: number
          path: string
          section: string
          updated_at?: string
          width?: number | null
        }
        Update: {
          exam_id?: string
          height?: number | null
          no?: number
          path?: string
          section?: string
          updated_at?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_question_images_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_question_images_exam_id_section_no_fkey"
            columns: ["exam_id", "section", "no"]
            isOneToOne: true
            referencedRelation: "exam_questions"
            referencedColumns: ["exam_id", "section", "no"]
          },
        ]
      }
      exam_questions: {
        Row: {
          correct: string
          exam_id: string
          kazanim: string | null
          no: number
          section: string
          topic: string | null
        }
        Insert: {
          correct: string
          exam_id: string
          kazanim?: string | null
          no: number
          section: string
          topic?: string | null
        }
        Update: {
          correct?: string
          exam_id?: string
          kazanim?: string | null
          no?: number
          section?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_section_fkey"
            columns: ["exam_id", "section"]
            isOneToOne: false
            referencedRelation: "exam_sections"
            referencedColumns: ["exam_id", "code"]
          },
        ]
      }
      exam_sections: {
        Row: {
          code: string
          exam_id: string
          name: string
          position: number
          question_count: number
        }
        Insert: {
          code: string
          exam_id: string
          name: string
          position: number
          question_count?: number
        }
        Update: {
          code?: string
          exam_id?: string
          name?: string
          position?: number
          question_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "exam_sections_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          booklet_label: string | null
          booklet_path: string | null
          booklet_url: string | null
          created_at: string
          duration_min: number
          grade: number
          id: string
          kind: string
          option_count: number
          published_at: string | null
          purpose: string
          slug: string
          status: Database["public"]["Enums"]["exam_status"]
          subtitle: string | null
          title: string
          wrong_penalty: number
        }
        Insert: {
          booklet_label?: string | null
          booklet_path?: string | null
          booklet_url?: string | null
          created_at?: string
          duration_min: number
          grade?: number
          id?: string
          kind?: string
          option_count?: number
          published_at?: string | null
          purpose?: string
          slug: string
          status?: Database["public"]["Enums"]["exam_status"]
          subtitle?: string | null
          title: string
          wrong_penalty?: number
        }
        Update: {
          booklet_label?: string | null
          booklet_path?: string | null
          booklet_url?: string | null
          created_at?: string
          duration_min?: number
          grade?: number
          id?: string
          kind?: string
          option_count?: number
          published_at?: string | null
          purpose?: string
          slug?: string
          status?: Database["public"]["Enums"]["exam_status"]
          subtitle?: string | null
          title?: string
          wrong_penalty?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          error_detail: string | null
          id: string
          invoice_no: string | null
          issued_at: string | null
          payment_id: string
          pdf_path: string | null
          provider: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_detail?: string | null
          id?: string
          invoice_no?: string | null
          issued_at?: string | null
          payment_id: string
          pdf_path?: string | null
          provider?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          error_detail?: string | null
          id?: string
          invoice_no?: string | null
          issued_at?: string | null
          payment_id?: string
          pdf_path?: string | null
          provider?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          converted_profile_id: string | null
          created_at: string
          email: string | null
          id: string
          kvkk_aydinlatma_at: string
          parent_name: string
          pazarlama_izni: boolean
          phone: string | null
          source: string | null
          student_grade: number | null
        }
        Insert: {
          converted_profile_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kvkk_aydinlatma_at: string
          parent_name: string
          pazarlama_izni?: boolean
          phone?: string | null
          source?: string | null
          student_grade?: number | null
        }
        Update: {
          converted_profile_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          kvkk_aydinlatma_at?: string
          parent_name?: string
          pazarlama_izni?: boolean
          phone?: string | null
          source?: string | null
          student_grade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_profile_id_fkey"
            columns: ["converted_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_ratings: {
        Row: {
          comment: string | null
          created_at: string
          lesson_id: string
          parent_id: string
          score: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          lesson_id: string
          parent_id: string
          score: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          lesson_id?: string
          parent_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_ratings_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: true
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_ratings_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_reports: {
        Row: {
          ai_summary: string | null
          covered_kazanim: string[] | null
          created_at: string
          homework: string | null
          lesson_id: string
          teacher_notes: string[]
          visible_to_parent: boolean
        }
        Insert: {
          ai_summary?: string | null
          covered_kazanim?: string[] | null
          created_at?: string
          homework?: string | null
          lesson_id: string
          teacher_notes: string[]
          visible_to_parent?: boolean
        }
        Update: {
          ai_summary?: string | null
          covered_kazanim?: string[] | null
          created_at?: string
          homework?: string | null
          lesson_id?: string
          teacher_notes?: string[]
          visible_to_parent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "lesson_reports_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: true
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          ends_at: string
          id: string
          is_makeup: boolean
          meeting_url: string | null
          recording_deleted_at: string | null
          recording_path: string | null
          starts_at: string
          status: Database["public"]["Enums"]["lesson_status"]
          student_id: string
          student_package_id: string
          teacher_id: string
          teacher_late_cancel: boolean
        }
        Insert: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          ends_at: string
          id?: string
          is_makeup?: boolean
          meeting_url?: string | null
          recording_deleted_at?: string | null
          recording_path?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_id: string
          student_package_id: string
          teacher_id: string
          teacher_late_cancel?: boolean
        }
        Update: {
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          ends_at?: string
          id?: string
          is_makeup?: boolean
          meeting_url?: string | null
          recording_deleted_at?: string | null
          recording_path?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["lesson_status"]
          student_id?: string
          student_package_id?: string
          teacher_id?: string
          teacher_late_cancel?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "lessons_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_student_package_id_fkey"
            columns: ["student_package_id"]
            isOneToOne: false
            referencedRelation: "student_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_kpis"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      package_products: {
        Row: {
          code: string
          is_active: boolean
          kind: Database["public"]["Enums"]["product_kind"]
          lesson_count: number
          name: string
          price: number
          validity_days: number
        }
        Insert: {
          code: string
          is_active?: boolean
          kind?: Database["public"]["Enums"]["product_kind"]
          lesson_count: number
          name: string
          price: number
          validity_days: number
        }
        Update: {
          code?: string
          is_active?: boolean
          kind?: Database["public"]["Enums"]["product_kind"]
          lesson_count?: number
          name?: string
          price?: number
          validity_days?: number
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          parent_id: string
          product_code: string
          provider: string
          provider_ref: string
          raw_payload: Json | null
          renews_package_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          student_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          parent_id: string
          product_code: string
          provider: string
          provider_ref: string
          raw_payload?: Json | null
          renews_package_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          parent_id?: string
          product_code?: string
          provider?: string
          provider_ref?: string
          raw_payload?: Json | null
          renews_package_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_renews"
            columns: ["renews_package_id"]
            isOneToOne: false
            referencedRelation: "student_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "package_products"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_lines: {
        Row: {
          amount: number
          created_at: string
          id: string
          lesson_id: string | null
          payout_id: string | null
          period: string
          ref_id: string | null
          teacher_id: string
          type: Database["public"]["Enums"]["payout_line_type"]
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          lesson_id?: string | null
          payout_id?: string | null
          period: string
          ref_id?: string | null
          teacher_id: string
          type: Database["public"]["Enums"]["payout_line_type"]
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          lesson_id?: string | null
          payout_id?: string | null
          period?: string
          ref_id?: string | null
          teacher_id?: string
          type?: Database["public"]["Enums"]["payout_line_type"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_payout"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_lines_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payout_lines_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_kpis"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "payout_lines_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      payouts: {
        Row: {
          id: string
          paid_at: string | null
          period: string
          teacher_id: string
          total: number
        }
        Insert: {
          id?: string
          paid_at?: string | null
          period: string
          teacher_id: string
          total: number
        }
        Update: {
          id?: string
          paid_at?: string | null
          period?: string
          teacher_id?: string
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "payouts_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_kpis"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "payouts_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      pricing_settings: {
        Row: {
          ek_ay_window_days: number
          first_lesson_guarantee: boolean
          id: boolean
          late_cancel_hours: number
          recording_retention_days: number
          refund_list_lesson_price: number
          teacher_notice_hours: number
        }
        Insert: {
          ek_ay_window_days?: number
          first_lesson_guarantee?: boolean
          id?: boolean
          late_cancel_hours?: number
          recording_retention_days?: number
          refund_list_lesson_price: number
          teacher_notice_hours?: number
        }
        Update: {
          ek_ay_window_days?: number
          first_lesson_guarantee?: boolean
          id?: boolean
          late_cancel_hours?: number
          recording_retention_days?: number
          refund_list_lesson_price?: number
          teacher_notice_hours?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          kvkk_aydinlatma_at: string | null
          pazarlama_izni: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          kvkk_aydinlatma_at?: string | null
          pazarlama_izni?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          kvkk_aydinlatma_at?: string | null
          pazarlama_izni?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          approved_by: string | null
          calc_detail: Json
          created_at: string
          id: string
          reason: string | null
          student_package_id: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          calc_detail: Json
          created_at?: string
          id?: string
          reason?: string | null
          student_package_id: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          calc_detail?: Json
          created_at?: string
          id?: string
          reason?: string | null
          student_package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_student_package_id_fkey"
            columns: ["student_package_id"]
            isOneToOne: false
            referencedRelation: "student_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      score_distribution: {
        Row: {
          basis: string
          family: string
          score: number
          value: number
          value_kind: string
          year: number
        }
        Insert: {
          basis: string
          family: string
          score: number
          value: number
          value_kind: string
          year: number
        }
        Update: {
          basis?: string
          family?: string
          score?: number
          value?: number
          value_kind?: string
          year?: number
        }
        Relationships: []
      }
      score_models: {
        Row: {
          base: number
          coefs: Json
          family: string
          max_score: number
          means: Json | null
          min_score: number
          notes: string | null
          question_counts: Json
          source: string | null
          updated_at: string
          year: number
        }
        Insert: {
          base: number
          coefs: Json
          family: string
          max_score?: number
          means?: Json | null
          min_score?: number
          notes?: string | null
          question_counts: Json
          source?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          base?: number
          coefs?: Json
          family?: string
          max_score?: number
          means?: Json | null
          min_score?: number
          notes?: string | null
          question_counts?: Json
          source?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      score_targets: {
        Row: {
          base_score: number
          city: string | null
          district: string | null
          family: string
          id: string
          institution: string
          level: string
          program: string | null
          rank_value: number | null
          source: string | null
          year: number
        }
        Insert: {
          base_score: number
          city?: string | null
          district?: string | null
          family: string
          id?: string
          institution: string
          level: string
          program?: string | null
          rank_value?: number | null
          source?: string | null
          year: number
        }
        Update: {
          base_score?: number
          city?: string | null
          district?: string | null
          family?: string
          id?: string
          institution?: string
          level?: string
          program?: string | null
          rank_value?: number | null
          source?: string | null
          year?: number
        }
        Relationships: []
      }
      student_packages: {
        Row: {
          created_at: string
          ends_on: string
          id: string
          lesson_quota: number
          paid_amount: number
          payment_id: string
          product_code: string
          renewed_from_id: string | null
          starts_on: string
          status: Database["public"]["Enums"]["package_status"]
          student_id: string
          teacher_id: string | null
        }
        Insert: {
          created_at?: string
          ends_on: string
          id?: string
          lesson_quota: number
          paid_amount: number
          payment_id: string
          product_code: string
          renewed_from_id?: string | null
          starts_on?: string
          status?: Database["public"]["Enums"]["package_status"]
          student_id: string
          teacher_id?: string | null
        }
        Update: {
          created_at?: string
          ends_on?: string
          id?: string
          lesson_quota?: number
          paid_amount?: number
          payment_id?: string
          product_code?: string
          renewed_from_id?: string | null
          starts_on?: string
          status?: Database["public"]["Enums"]["package_status"]
          student_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_packages_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_packages_product_code_fkey"
            columns: ["product_code"]
            isOneToOne: false
            referencedRelation: "package_products"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "student_packages_renewed_from_id_fkey"
            columns: ["renewed_from_id"]
            isOneToOne: false
            referencedRelation: "student_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_packages_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_packages_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_kpis"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "student_packages_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          first_name: string
          grade: number
          id: string
          lgs_analitik_ref: string | null
          lgs_year: number | null
          parent_id: string
        }
        Insert: {
          created_at?: string
          first_name: string
          grade: number
          id?: string
          lgs_analitik_ref?: string | null
          lgs_year?: number | null
          parent_id: string
        }
        Update: {
          created_at?: string
          first_name?: string
          grade?: number
          id?: string
          lgs_analitik_ref?: string | null
          lgs_year?: number | null
          parent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_applications: {
        Row: {
          bio: string | null
          branch: string
          branch_test_at: string | null
          branch_test_attempt_id: string | null
          branch_test_score: number | null
          contract_signed_at: string | null
          contract_version: string | null
          created_at: string
          criminal_record_barcode: string | null
          criminal_record_consent_at: string | null
          criminal_record_renew_due: string | null
          criminal_record_verified_at: string | null
          demo_availability: string | null
          demo_evaluator_id: string | null
          demo_meeting_url: string | null
          demo_rubric: Json | null
          demo_scheduled_at: string | null
          demo_score: number | null
          demo_transcript_ai: Json | null
          department: string | null
          diploma_barcode: string | null
          diploma_verified_at: string | null
          experience_years: number | null
          grades_max: number
          grades_min: number
          graduation_year: number | null
          id: string
          id_verified_at: string | null
          independent_contractor_ack_at: string | null
          intro_video_url: string | null
          not_civil_servant_declared: boolean
          not_civil_servant_declared_at: string
          orientation_done_at: string | null
          profile_id: string
          rejected_at: string | null
          rejection_reason: string | null
          segment: Database["public"]["Enums"]["teacher_segment"]
          stage: Database["public"]["Enums"]["teacher_status"]
          subjects: string[]
          submerchant_consent_at: string | null
          submitted_at: string | null
          tax_status: string | null
          university: string | null
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          bio?: string | null
          branch?: string
          branch_test_at?: string | null
          branch_test_attempt_id?: string | null
          branch_test_score?: number | null
          contract_signed_at?: string | null
          contract_version?: string | null
          created_at?: string
          criminal_record_barcode?: string | null
          criminal_record_consent_at?: string | null
          criminal_record_renew_due?: string | null
          criminal_record_verified_at?: string | null
          demo_availability?: string | null
          demo_evaluator_id?: string | null
          demo_meeting_url?: string | null
          demo_rubric?: Json | null
          demo_scheduled_at?: string | null
          demo_score?: number | null
          demo_transcript_ai?: Json | null
          department?: string | null
          diploma_barcode?: string | null
          diploma_verified_at?: string | null
          experience_years?: number | null
          grades_max?: number
          grades_min?: number
          graduation_year?: number | null
          id?: string
          id_verified_at?: string | null
          independent_contractor_ack_at?: string | null
          intro_video_url?: string | null
          not_civil_servant_declared: boolean
          not_civil_servant_declared_at?: string
          orientation_done_at?: string | null
          profile_id: string
          rejected_at?: string | null
          rejection_reason?: string | null
          segment: Database["public"]["Enums"]["teacher_segment"]
          stage?: Database["public"]["Enums"]["teacher_status"]
          subjects?: string[]
          submerchant_consent_at?: string | null
          submitted_at?: string | null
          tax_status?: string | null
          university?: string | null
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          bio?: string | null
          branch?: string
          branch_test_at?: string | null
          branch_test_attempt_id?: string | null
          branch_test_score?: number | null
          contract_signed_at?: string | null
          contract_version?: string | null
          created_at?: string
          criminal_record_barcode?: string | null
          criminal_record_consent_at?: string | null
          criminal_record_renew_due?: string | null
          criminal_record_verified_at?: string | null
          demo_availability?: string | null
          demo_evaluator_id?: string | null
          demo_meeting_url?: string | null
          demo_rubric?: Json | null
          demo_scheduled_at?: string | null
          demo_score?: number | null
          demo_transcript_ai?: Json | null
          department?: string | null
          diploma_barcode?: string | null
          diploma_verified_at?: string | null
          experience_years?: number | null
          grades_max?: number
          grades_min?: number
          graduation_year?: number | null
          id?: string
          id_verified_at?: string | null
          independent_contractor_ack_at?: string | null
          intro_video_url?: string | null
          not_civil_servant_declared?: boolean
          not_civil_servant_declared_at?: string
          orientation_done_at?: string | null
          profile_id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          segment?: Database["public"]["Enums"]["teacher_segment"]
          stage?: Database["public"]["Enums"]["teacher_status"]
          subjects?: string[]
          submerchant_consent_at?: string | null
          submitted_at?: string | null
          tax_status?: string | null
          university?: string | null
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_applications_branch_test_attempt_id_fkey"
            columns: ["branch_test_attempt_id"]
            isOneToOne: false
            referencedRelation: "exam_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_applications_demo_evaluator_id_fkey"
            columns: ["demo_evaluator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_applications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_availability: {
        Row: {
          end_time: string
          id: string
          start_time: string
          teacher_id: string
          weekday: number
        }
        Insert: {
          end_time: string
          id?: string
          start_time: string
          teacher_id: string
          weekday: number
        }
        Update: {
          end_time?: string
          id?: string
          start_time?: string
          teacher_id?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "teacher_availability_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_kpis"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "teacher_availability_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      teacher_payout_info: {
        Row: {
          iban: string | null
          iban_last4: string | null
          payment_model: string | null
          payout_model: string
          profile_id: string
          submerchant_key: string | null
          submerchant_status: string | null
          tax_id_encrypted: string | null
          updated_at: string
        }
        Insert: {
          iban?: string | null
          iban_last4?: string | null
          payment_model?: string | null
          payout_model?: string
          profile_id: string
          submerchant_key?: string | null
          submerchant_status?: string | null
          tax_id_encrypted?: string | null
          updated_at?: string
        }
        Update: {
          iban?: string | null
          iban_last4?: string | null
          payment_model?: string | null
          payout_model?: string
          profile_id?: string
          submerchant_key?: string | null
          submerchant_status?: string | null
          tax_id_encrypted?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_payout_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "teacher_kpis"
            referencedColumns: ["teacher_id"]
          },
          {
            foreignKeyName: "teacher_payout_info_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "teachers"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      teachers: {
        Row: {
          activated_at: string | null
          band_changed_at: string | null
          bio: string | null
          commission_band: string
          created_at: string
          display_name: string
          grades_max: number
          grades_min: number
          intro_video_url: string | null
          late_cancel_count_30d: number
          profile_id: string
          status: Database["public"]["Enums"]["teacher_status"]
          subjects: string[]
          tier: Database["public"]["Enums"]["teacher_tier"]
        }
        Insert: {
          activated_at?: string | null
          band_changed_at?: string | null
          bio?: string | null
          commission_band?: string
          created_at?: string
          display_name: string
          grades_max?: number
          grades_min?: number
          intro_video_url?: string | null
          late_cancel_count_30d?: number
          profile_id: string
          status?: Database["public"]["Enums"]["teacher_status"]
          subjects?: string[]
          tier?: Database["public"]["Enums"]["teacher_tier"]
        }
        Update: {
          activated_at?: string | null
          band_changed_at?: string | null
          bio?: string | null
          commission_band?: string
          created_at?: string
          display_name?: string
          grades_max?: number
          grades_min?: number
          intro_video_url?: string | null
          late_cancel_count_30d?: number
          profile_id?: string
          status?: Database["public"]["Enums"]["teacher_status"]
          subjects?: string[]
          tier?: Database["public"]["Enums"]["teacher_tier"]
        }
        Relationships: [
          {
            foreignKeyName: "teachers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tier_rates: {
        Row: {
          id: number
          lesson_fee: number
          tier: Database["public"]["Enums"]["teacher_tier"]
          valid_from: string
        }
        Insert: {
          id?: number
          lesson_fee: number
          tier: Database["public"]["Enums"]["teacher_tier"]
          valid_from: string
        }
        Update: {
          id?: number
          lesson_fee?: number
          tier?: Database["public"]["Enums"]["teacher_tier"]
          valid_from?: string
        }
        Relationships: []
      }
    }
    Views: {
      teacher_kpis: {
        Row: {
          avg_rating: number | null
          completed_lessons: number | null
          late_cancel_count_30d: number | null
          renewal_rate_pct: number | null
          teacher_id: string | null
          tier: Database["public"]["Enums"]["teacher_tier"] | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_profile_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_approve_teacher: {
        Args: { p_app: string; p_display_name: string }
        Returns: string
      }
      admin_create_exam: { Args: { p: Json }; Returns: string }
      apply_payment: {
        Args: { p_payload: Json; p_provider: string; p_ref: string }
        Returns: string
      }
      book_lesson: {
        Args: { p_minutes?: number; p_package: string; p_starts: string }
        Returns: string
      }
      calc_refund: { Args: { p_package: string }; Returns: Json }
      cancel_lesson: {
        Args: { p_lesson: string }
        Returns: Database["public"]["Enums"]["lesson_status"]
      }
      change_teacher: {
        Args: { p_new_teacher: string; p_package: string; p_reason: string }
        Returns: number
      }
      claim_exam_attempt: {
        Args: { p_attempt: string; p_token: string }
        Returns: boolean
      }
      current_fee: {
        Args: { p_on?: string; p_teacher: string }
        Returns: number
      }
      expired_recordings: {
        Args: never
        Returns: {
          lesson_id: string
          recording_path: string
        }[]
      }
      get_exam_result: {
        Args: { p_attempt: string; p_token?: string }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
      is_parent_of: { Args: { p_student: string }; Returns: boolean }
      mark_recordings_deleted: { Args: { p_ids: string[] }; Returns: number }
      package_used: { Args: { p_package: string }; Returns: number }
      payout_period: { Args: { p_ts: string }; Returns: string }
      submit_exam_attempt: {
        Args: {
          p_answers: Json
          p_exam: string
          p_grade?: number
          p_name?: string
        }
        Returns: Json
      }
      teacher_application_branch_test: {
        Args: { p_attempt: string }
        Returns: Json
      }
      teacher_application_save: { Args: { p: Json }; Returns: string }
      teaches_student: { Args: { p_student: string }; Returns: boolean }
    }
    Enums: {
      assessment_type: "tani" | "ara" | "donem_sonu"
      exam_status: "taslak" | "yayinda" | "arsiv"
      lesson_status:
        | "planlandi"
        | "tamamlandi"
        | "veli_iptal"
        | "veli_gec_iptal"
        | "ogretmen_iptal"
        | "gelmedi"
        | "degisiklik_iptal"
      package_status: "aktif" | "tamamlandi" | "suresi_doldu" | "iade_edildi"
      payment_status: "beklemede" | "basarili" | "basarisiz" | "iade"
      payout_line_type:
        | "ders"
        | "gec_iptal_50"
        | "bonus_yenileme"
        | "bonus_net_artis"
        | "bonus_referans"
        | "mentor_degerlendirme"
        | "duzeltme"
      product_kind: "ana" | "ek_ay"
      teacher_segment:
        | "atanamayan"
        | "emekli"
        | "ozel_okul"
        | "ucretli_ogretmen"
        | "universite_ogrencisi"
        | "diger"
      teacher_status:
        | "basvuru"
        | "test"
        | "demo"
        | "belge"
        | "oryantasyon"
        | "golge"
        | "aktif"
        | "askida"
        | "ayrildi"
      teacher_tier: "K1" | "K2" | "K3" | "K4"
      user_role: "veli" | "ogretmen" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assessment_type: ["tani", "ara", "donem_sonu"],
      exam_status: ["taslak", "yayinda", "arsiv"],
      lesson_status: [
        "planlandi",
        "tamamlandi",
        "veli_iptal",
        "veli_gec_iptal",
        "ogretmen_iptal",
        "gelmedi",
        "degisiklik_iptal",
      ],
      package_status: ["aktif", "tamamlandi", "suresi_doldu", "iade_edildi"],
      payment_status: ["beklemede", "basarili", "basarisiz", "iade"],
      payout_line_type: [
        "ders",
        "gec_iptal_50",
        "bonus_yenileme",
        "bonus_net_artis",
        "bonus_referans",
        "mentor_degerlendirme",
        "duzeltme",
      ],
      product_kind: ["ana", "ek_ay"],
      teacher_segment: [
        "atanamayan",
        "emekli",
        "ozel_okul",
        "ucretli_ogretmen",
        "universite_ogrencisi",
        "diger",
      ],
      teacher_status: [
        "basvuru",
        "test",
        "demo",
        "belge",
        "oryantasyon",
        "golge",
        "aktif",
        "askida",
        "ayrildi",
      ],
      teacher_tier: ["K1", "K2", "K3", "K4"],
      user_role: ["veli", "ogretmen", "admin"],
    },
  },
} as const
