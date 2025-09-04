

// Simple analytics helper for tracking key events
// Can be extended to integrate with Google Analytics, PostHog, etc.

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

class Analytics {
  private enabled: boolean = false;

  constructor() {
    // Enable analytics in production
    this.enabled = typeof window !== 'undefined' && process.env.NODE_ENV === 'production';
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.enabled) {
      console.log('Analytics Event:', { event, properties });
      return;
    }

    // Here you would integrate with your analytics service
    // Examples:
    // - Google Analytics: gtag('event', event, properties)
    // - PostHog: posthog.capture(event, properties)
    // - Custom API: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event, properties }) })
    
    console.log('Analytics Event:', { event, properties });
  }

  // Quick calculator specific events
  quickCalcStarted(properties: { state?: string; dealType?: string }) {
    this.track('QuickCalcStarted', properties);
  }

  quickCalcCompleted(properties: { 
    state: string; 
    partnerAdvantage: boolean;
    commissionDifference?: number;
  }) {
    this.track('QuickCalcCompleted', properties);
  }

  fullAnalysisClicked(properties: { 
    state: string; 
    prePopulatedData: boolean;
    source?: string;
  }) {
    this.track('FullAnalysisClicked', properties);
  }

  partnerConnectionClicked(properties: {
    state: string;
    hasAdvantage: boolean;
  }) {
    this.track('PartnerConnectionClicked', properties);
  }

  // Calculator flow events
  calculatorStepCompleted(properties: {
    step: number;
    calculatorType: string;
    stepName: string;
  }) {
    this.track('CalculatorStepCompleted', properties);
  }

  calculatorFlowCompleted(properties: {
    calculatorType: string;
    totalSteps: number;
    timeSpent?: number;
  }) {
    this.track('CalculatorFlowCompleted', properties);
  }

  // Contact and conversion events
  contactFormSubmitted(properties: {
    source: string;
    hasQuickCalcData: boolean;
  }) {
    this.track('ContactFormSubmitted', properties);
  }

  leadCaptureSubmitted(properties: {
    calculatorType: string;
    hasPrefilledData: boolean;
  }) {
    this.track('LeadCaptureSubmitted', properties);
  }
}

// Export a singleton instance
export const analytics = new Analytics();

// Helper function for React components to track events
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties);
};

