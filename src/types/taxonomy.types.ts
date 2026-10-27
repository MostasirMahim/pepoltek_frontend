/**
 * Taxonomy Types for Candidate Intake & Platform Matrix
 * Strict House Style Rule: Zero em dashes or en dashes throughout.
 */

export interface BaseOption {
  id: string;
  label: string;
  description?: string;
}

export interface SectorOption extends BaseOption {
  code: "technology" | "healthcare";
  badge: string;
  iconName: string;
  headline: string;
}

export interface DomainOption extends BaseOption {
  sectorId: "technology" | "healthcare";
  recommendedSkills: string[];
}

export interface SkillOption extends BaseOption {
  sectorId: "technology" | "healthcare";
  domainId?: string;
  category?: string;
  isPopular?: boolean;
}

export interface SeniorityOption extends BaseOption {
  sectorId: "technology" | "healthcare";
  yearsRange: string;
  canonicalLevel: "junior" | "mid" | "senior" | "lead" | "director" | "c_level";
}

export interface WorkAuthOption extends BaseOption {
  canonicalAuth: "us_citizen" | "green_card" | "h1b" | "opt" | "international_remote";
  region: "US" | "UK" | "EU" | "Global";
}

export interface EngagementOption extends BaseOption {
  canonicalEngagement: "w2" | "c2c" | "1099" | "direct_hire";
  badge: string;
}

export interface AssessmentCategoryOption extends BaseOption {
  sectorId: "technology" | "healthcare" | "both" | "all";
  badge?: string;
}

export interface ValidatorSpecializationOption extends BaseOption {
  sectorId: "technology" | "healthcare" | "both" | "all";
  clearanceLevel?: string;
  badge?: string;
}

export interface InterviewFormatOption extends BaseOption {
  sectorId: "technology" | "healthcare" | "both" | "all";
  badge?: string;
  durationMinutes?: number;
}

export interface TaxonomyMatrix {
  sectors: SectorOption[];
  domains: DomainOption[];
  skills: SkillOption[];
  seniorities: SeniorityOption[];
  workAuths: WorkAuthOption[];
  engagements: EngagementOption[];
  assessmentCategories?: AssessmentCategoryOption[];
  validatorSpecializations?: ValidatorSpecializationOption[];
  interviewFormats?: InterviewFormatOption[];
}


