

/**
 * Feature Flags Configuration
 * 
 * Controls which features are enabled/disabled in the application.
 * Set flags to true/false to enable/disable features across the platform.
 */

export interface FeatureFlags {
  // Core Calculator Features
  SALES_CALCULATOR: boolean;
  TEAM_LEADER_CALCULATOR: boolean;
  QUICK_CALCULATOR: boolean;
  
  // Field Marketing Features (DISABLED FOR LAUNCH)
  FIELD_MARKETING: boolean;
  FIELD_MARKETING_ROI: boolean;
  FIELD_MARKETING_COMMISSION: boolean;
  
  // Future Features
  ANALYTICS_DASHBOARD: boolean;
  CUSTOM_BRANDING: boolean;
  ADVANCED_REPORTING: boolean;
}

// ===== PRODUCTION FEATURE FLAGS =====
export const FEATURES: FeatureFlags = {
  // ENABLED FOR LAUNCH
  SALES_CALCULATOR: true,
  TEAM_LEADER_CALCULATOR: true,
  QUICK_CALCULATOR: true,
  
  // DISABLED FOR LAUNCH - PRESERVE FOR FUTURE
  FIELD_MARKETING: false,
  FIELD_MARKETING_ROI: false,
  FIELD_MARKETING_COMMISSION: false,
  
  // FUTURE FEATURES
  ANALYTICS_DASHBOARD: false,
  CUSTOM_BRANDING: false,
  ADVANCED_REPORTING: false,
};

// ===== DEVELOPMENT OVERRIDES =====
// Uncomment to enable features in development
// export const FEATURES: FeatureFlags = {
//   ...FEATURES,
//   FIELD_MARKETING: true, // Enable for development
// };

/**
 * Helper function to check if a feature is enabled
 * @param feature - The feature flag to check
 * @returns boolean - Whether the feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return FEATURES[feature];
};

/**
 * Helper function to conditionally render components based on feature flags
 * @param feature - The feature flag to check
 * @param component - The component to render if enabled
 * @param fallback - Optional fallback component if disabled
 * @returns Component or null
 */
export const withFeatureFlag = (
  feature: keyof FeatureFlags,
  component: React.ReactNode,
  fallback: React.ReactNode = null
): React.ReactNode => {
  return isFeatureEnabled(feature) ? component : fallback;
};

/**
 * Launch Configuration
 * 
 * Defines what features are available for the initial launch
 */
export const LAUNCH_CONFIG = {
  // Primary Features for Launch
  ENABLED_CALCULATORS: ['sales-rep', 'team-leader'] as const,
  
  // Homepage Options
  SHOW_FIELD_MARKETING: false,
  SHOW_QUICK_CALCULATOR: true,
  
  // Navigation
  ENABLED_ROUTES: [
    '/calculator/sales-rep',
    '/calculator/team-leader',
    '/contact',
    '/about',
    '/terms',
    '/privacy'
  ] as const,
  
  // SEO Focus
  PRIMARY_KEYWORDS: [
    'solar commission calculator',
    'solar sales calculator', 
    'solar team leader calculator',
    'solar recruiting income'
  ] as const,
};

/**
 * Future Launch Configuration
 * 
 * Configuration for when field marketing features are enabled
 */
export const FUTURE_LAUNCH_CONFIG = {
  ENABLED_CALCULATORS: ['sales-rep', 'team-leader', 'field-marketing'] as const,
  SHOW_FIELD_MARKETING: true,
  ENABLED_ROUTES: [
    ...LAUNCH_CONFIG.ENABLED_ROUTES,
    '/calculator/field-marketing'
  ] as const,
  PRIMARY_KEYWORDS: [
    ...LAUNCH_CONFIG.PRIMARY_KEYWORDS,
    'field marketing ROI calculator',
    'solar canvassing calculator'
  ] as const,
};

