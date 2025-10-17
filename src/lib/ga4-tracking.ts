/**
 * Google Analytics 4 Event Tracking Utility
 * Comprehensive tracking for ImageResizerNow.com
 */

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export interface GA4EventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface ImageProcessingEvent {
  user_type: 'anonymous' | 'registered';
  tool_used: string;
  processing_mode: 'client' | 'server';
  file_count: number;
  total_file_size: number;
  processing_time_ms: number;
  output_format: string;
  dimensions: string;
  quality_setting: number;
  compression_setting: number;
  resize_mode: string;
  resampling_filter: string;
}

export interface ConversionEvent {
  user_type: 'anonymous' | 'registered';
  conversion_type: 'signup' | 'image_processed' | 'download' | 'cloud_upload';
  value?: number;
  currency?: string;
}

/**
 * Track page views with custom dimensions
 */
export function trackPageView(pageTitle: string, userType: 'anonymous' | 'registered' = 'anonymous', toolUsed?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    user_type: userType,
    tool_used: toolUsed || 'main_page',
    timestamp: new Date().toISOString()
  });
}

/**
 * Track image processing events
 */
export function trackImageProcessing(eventData: ImageProcessingEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'image_processed', {
    event_category: 'image_processing',
    event_label: `${eventData.tool_used} - ${eventData.output_format}`,
    value: eventData.file_count,
    user_type: eventData.user_type,
    tool_used: eventData.tool_used,
    processing_mode: eventData.processing_mode,
    file_count: eventData.file_count,
    total_file_size: eventData.total_file_size,
    processing_time_ms: eventData.processing_time_ms,
    output_format: eventData.output_format,
    dimensions: eventData.dimensions,
    quality_setting: eventData.quality_setting,
    compression_setting: eventData.compression_setting,
    resize_mode: eventData.resize_mode,
    resampling_filter: eventData.resampling_filter,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track button clicks and user interactions
 */
export function trackButtonClick(
  buttonName: string,
  buttonLocation: string,
  userType: 'anonymous' | 'registered' = 'anonymous',
  additionalData?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'button_click', {
    event_category: 'user_interaction',
    event_label: `${buttonName} - ${buttonLocation}`,
    button_name: buttonName,
    button_location: buttonLocation,
    user_type: userType,
    ...additionalData,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track preset selections
 */
export function trackPresetSelection(
  presetName: string,
  dimensions: string,
  userType: 'anonymous' | 'registered' = 'anonymous'
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'preset_selected', {
    event_category: 'preset_usage',
    event_label: `${presetName} - ${dimensions}`,
    preset_name: presetName,
    preset_dimensions: dimensions,
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track file uploads
 */
export function trackFileUpload(
  fileCount: number,
  totalSize: number,
  userType: 'anonymous' | 'registered' = 'anonymous'
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'file_upload', {
    event_category: 'file_management',
    event_label: `${fileCount} files - ${formatBytes(totalSize)}`,
    file_count: fileCount,
    total_file_size: totalSize,
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track downloads
 */
export function trackDownload(
  downloadType: 'single' | 'batch' | 'zip',
  fileCount: number,
  userType: 'anonymous' | 'registered' = 'anonymous',
  quality: number = 0.9
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'file_download', {
    event_category: 'download',
    event_label: `${downloadType} - ${fileCount} files`,
    download_type: downloadType,
    file_count: fileCount,
    download_quality: quality,
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track conversion events
 */
export function trackConversion(eventData: ConversionEvent) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    event_category: 'conversion',
    event_label: eventData.conversion_type,
    conversion_type: eventData.conversion_type,
    user_type: eventData.user_type,
    value: eventData.value || 1,
    currency: eventData.currency || 'USD',
    timestamp: new Date().toISOString()
  });

  // Also track as a separate event for better reporting
  window.gtag('event', eventData.conversion_type, {
    event_category: 'conversion',
    event_label: eventData.user_type,
    user_type: eventData.user_type,
    value: eventData.value || 1,
    currency: eventData.currency || 'USD',
    timestamp: new Date().toISOString()
  });
}

/**
 * Track errors
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  userType: 'anonymous' | 'registered' = 'anonymous',
  additionalData?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'error', {
    event_category: 'error',
    event_label: errorType,
    error_type: errorType,
    error_message: errorMessage,
    user_type: userType,
    ...additionalData,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track tool usage
 */
export function trackToolUsage(
  toolName: string,
  userType: 'anonymous' | 'registered' = 'anonymous',
  additionalData?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'tool_used', {
    event_category: 'tool_usage',
    event_label: toolName,
    tool_name: toolName,
    user_type: userType,
    ...additionalData,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track user engagement metrics
 */
export function trackEngagement(
  engagementType: 'scroll' | 'time_on_page' | 'click' | 'form_interaction',
  value: number,
  userType: 'anonymous' | 'registered' = 'anonymous'
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'engagement', {
    event_category: 'user_engagement',
    event_label: engagementType,
    engagement_type: engagementType,
    engagement_value: value,
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track cloud storage usage
 */
export function trackCloudStorage(
  action: 'upload' | 'download' | 'delete',
  fileCount: number,
  totalSize: number,
  userType: 'registered' // Only registered users have cloud storage
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'cloud_storage', {
    event_category: 'cloud_storage',
    event_label: `${action} - ${fileCount} files`,
    storage_action: action,
    file_count: fileCount,
    total_size: totalSize,
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Utility function to format bytes (same as in ImageResizer component)
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Initialize automatic button tracking
 * Call this after the page loads to automatically track button clicks
 */
export function initializeButtonTracking() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Track all buttons with data-ga attributes
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button, a[role="button"], [data-ga]');
    
    if (button) {
      const gaData = button.getAttribute('data-ga');
      if (gaData) {
        try {
          const { event_name, event_category, event_label, ...additionalData } = JSON.parse(gaData);
          window.gtag('event', event_name, {
            event_category: event_category || 'button_click',
            event_label: event_label || button.textContent?.trim() || 'unknown',
            ...additionalData,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.warn('Failed to parse GA data:', gaData, error);
        }
      }
    }
  });

  // Track preset selections
  document.addEventListener('change', (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'SELECT' && target.getAttribute('data-ga-presets')) {
      const select = target as HTMLSelectElement;
      if (select.value) {
        const [width, height] = select.value.split('x').map(Number);
        const presetName = select.selectedOptions[0]?.textContent || select.value;
        
        trackPresetSelection(
          presetName,
          select.value,
          // Determine user type from context
          document.body.classList.contains('authenticated') ? 'registered' : 'anonymous'
        );
      }
    }
  });
}

/**
 * Track page performance metrics
 */
export function trackPagePerformance() {
  if (typeof window === 'undefined' || !window.gtag || !window.performance) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (perfData) {
        window.gtag('event', 'page_performance', {
          event_category: 'performance',
          event_label: 'page_load',
          load_time: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
          dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
          first_paint: Math.round(perfData.loadEventEnd - perfData.fetchStart),
          timestamp: new Date().toISOString()
        });
      }
    }, 1000);
  });
}

/**
 * Enhanced GA4 configuration with advanced features
 */
export function configureEnhancedGA4() {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Configure enhanced measurement
  window.gtag('config', 'G-W7T6RWFLE9', {
    // Enable automatic event tracking
    enhanced_measurement: {
      scrolls: true,
      outbound_clicks: true,
      site_search: true,
      video_engagement: true,
      file_downloads: true,
      page_changes: true,
      form_interactions: true,
    },
    
    // Custom parameters for advanced segmentation
    custom_map: {
      'custom_parameter_1': 'user_type',
      'custom_parameter_2': 'tool_used', 
      'custom_parameter_3': 'processing_mode',
      'custom_parameter_4': 'user_engagement_level',
      'custom_parameter_5': 'feature_usage_tier'
    },
    
    // Enable predictive metrics
    send_page_view: true,
    
    // Enhanced ecommerce (for future monetization)
    send_page_view: true,
    
    // User engagement tracking
    engagement_time_msec: true,
    
    // Custom user properties
    user_properties: {
      'tool_preference': 'image_resizer',
      'usage_frequency': 'unknown',
      'conversion_likelihood': 'unknown'
    }
  });
}

/**
 * Track detailed user journey and funnel analysis
 */
export function trackUserJourney(
  step: string,
  stepNumber: number,
  totalSteps: number,
  userType: 'anonymous' | 'registered' = 'anonymous',
  additionalData?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'user_journey_step', {
    event_category: 'funnel_analysis',
    event_label: step,
    journey_step: step,
    step_number: stepNumber,
    total_steps: totalSteps,
    progress_percentage: Math.round((stepNumber / totalSteps) * 100),
    user_type: userType,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
}

/**
 * Track advanced user engagement metrics
 */
export function trackEngagementMetrics(
  engagementType: 'scroll_depth' | 'time_on_page' | 'feature_interaction' | 'conversion_intent',
  value: number,
  userType: 'anonymous' | 'registered' = 'anonymous',
  context?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'engagement_metric', {
    event_category: 'user_engagement',
    event_label: engagementType,
    engagement_type: engagementType,
    engagement_value: value,
    user_type: userType,
    session_quality: calculateSessionQuality(value, engagementType),
    ...context,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track traffic source and attribution
 */
export function trackTrafficSource(
  source: string,
  medium: string,
  campaign?: string,
  userType: 'anonymous' | 'registered' = 'anonymous'
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'traffic_source', {
    event_category: 'acquisition',
    event_label: `${source}/${medium}`,
    traffic_source: source,
    traffic_medium: medium,
    campaign_name: campaign || 'direct',
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track feature adoption and usage patterns
 */
export function trackFeatureAdoption(
  feature: string,
  adoptionLevel: 'discovered' | 'tried' | 'used_regularly' | 'power_user',
  userType: 'anonymous' | 'registered' = 'anonymous',
  usageCount?: number
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'feature_adoption', {
    event_category: 'feature_usage',
    event_label: `${feature}_${adoptionLevel}`,
    feature_name: feature,
    adoption_level: adoptionLevel,
    usage_count: usageCount || 1,
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track conversion intent and micro-conversions
 */
export function trackConversionIntent(
  intentType: 'upload_started' | 'processing_initiated' | 'download_clicked' | 'signup_viewed',
  userType: 'anonymous' | 'registered' = 'anonymous',
  context?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion_intent', {
    event_category: 'conversion_funnel',
    event_label: intentType,
    intent_type: intentType,
    user_type: userType,
    conversion_probability: calculateConversionProbability(intentType, userType),
    ...context,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track user behavior patterns for segmentation
 */
export function trackUserBehavior(
  behaviorType: 'quick_exit' | 'deep_engagement' | 'feature_explorer' | 'conversion_focused',
  sessionData: {
    pages_viewed: number;
    time_on_site: number;
    interactions: number;
    conversions: number;
  },
  userType: 'anonymous' | 'registered' = 'anonymous'
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'user_behavior', {
    event_category: 'behavior_analysis',
    event_label: behaviorType,
    behavior_type: behaviorType,
    user_type: userType,
    pages_viewed: sessionData.pages_viewed,
    time_on_site: sessionData.time_on_site,
    interactions_count: sessionData.interactions,
    conversions_count: sessionData.conversions,
    engagement_score: calculateEngagementScore(sessionData),
    timestamp: new Date().toISOString()
  });
}

/**
 * Track A/B test variations (for future testing)
 */
export function trackABTest(
  testName: string,
  variant: string,
  userType: 'anonymous' | 'registered' = 'anonymous'
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'ab_test', {
    event_category: 'experimentation',
    event_label: `${testName}_${variant}`,
    test_name: testName,
    test_variant: variant,
    user_type: userType,
    timestamp: new Date().toISOString()
  });
}

/**
 * Track performance and technical metrics
 */
export function trackPerformanceMetrics(
  metricType: 'page_load' | 'image_processing' | 'api_response' | 'error_rate',
  value: number,
  context?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'performance_metric', {
    event_category: 'technical_performance',
    event_label: metricType,
    metric_type: metricType,
    metric_value: value,
    performance_grade: getPerformanceGrade(metricType, value),
    ...context,
    timestamp: new Date().toISOString()
  });
}

/**
 * Helper function to calculate session quality
 */
function calculateSessionQuality(value: number, type: string): string {
  switch (type) {
    case 'scroll_depth':
      if (value >= 75) return 'high';
      if (value >= 50) return 'medium';
      return 'low';
    case 'time_on_page':
      if (value >= 300) return 'high'; // 5+ minutes
      if (value >= 60) return 'medium'; // 1+ minute
      return 'low';
    default:
      return 'unknown';
  }
}

/**
 * Helper function to calculate conversion probability
 */
function calculateConversionProbability(intentType: string, userType: string): number {
  const baseProbabilities: Record<string, Record<string, number>> = {
    'upload_started': { 'anonymous': 0.7, 'registered': 0.9 },
    'processing_initiated': { 'anonymous': 0.5, 'registered': 0.8 },
    'download_clicked': { 'anonymous': 0.3, 'registered': 0.7 },
    'signup_viewed': { 'anonymous': 0.2, 'registered': 0.0 }
  };
  
  return baseProbabilities[intentType]?.[userType] || 0.1;
}

/**
 * Helper function to calculate engagement score
 */
function calculateEngagementScore(sessionData: any): number {
  const pagesScore = Math.min(sessionData.pages_viewed * 10, 50);
  const timeScore = Math.min(sessionData.time_on_site / 60 * 20, 40); // 1 minute = 20 points, max 40
  const interactionScore = Math.min(sessionData.interactions * 5, 10);
  
  return Math.round(pagesScore + timeScore + interactionScore);
}

/**
 * Helper function to get performance grade
 */
function getPerformanceGrade(metricType: string, value: number): string {
  switch (metricType) {
    case 'page_load':
      if (value <= 1000) return 'excellent';
      if (value <= 3000) return 'good';
      if (value <= 5000) return 'needs_improvement';
      return 'poor';
    case 'image_processing':
      if (value <= 5000) return 'excellent';
      if (value <= 15000) return 'good';
      if (value <= 30000) return 'needs_improvement';
      return 'poor';
    default:
      return 'unknown';
  }
}

/**
 * Initialize all GA4 tracking with enhanced features
 */
export function initializeGA4Tracking() {
  if (typeof window === 'undefined') return;

  // Configure enhanced GA4
  configureEnhancedGA4();
  
  // Initialize button tracking
  initializeButtonTracking();
  
  // Initialize performance tracking
  trackPagePerformance();
  
  // Initialize scroll tracking
  initializeScrollTracking();
  
  // Initialize session tracking
  initializeSessionTracking();

  console.log('✅ Enhanced GA4 tracking initialized successfully');
}

/**
 * Initialize scroll depth tracking
 */
function initializeScrollTracking() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  let maxScrollDepth = 0;
  const scrollThresholds = [25, 50, 75, 90, 100];

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = Math.round((scrollTop / scrollHeight) * 100);

    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      
      // Track when user reaches new thresholds
      scrollThresholds.forEach(threshold => {
        if (scrollDepth >= threshold && maxScrollDepth < threshold) {
          trackEngagementMetrics('scroll_depth', threshold, 'anonymous'); // Will be updated with actual user type
        }
      });
    }
  });
}

/**
 * Initialize session tracking
 */
function initializeSessionTracking() {
  if (typeof window === 'undefined') return;

  const sessionStart = Date.now();
  let pageViews = 1;
  let interactions = 0;

  // Track page views
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    pageViews++;
    originalPushState.apply(history, args);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
  };

  // Track interactions
  document.addEventListener('click', () => {
    interactions++;
  });

  // Track session end
  window.addEventListener('beforeunload', () => {
    const sessionDuration = Date.now() - sessionStart;
    
    trackUserBehavior(
      interactions > 5 ? 'deep_engagement' : 'quick_exit',
      {
        pages_viewed: pageViews,
        time_on_site: sessionDuration,
        interactions: interactions,
        conversions: 0 // Will be updated based on actual conversions
      },
      'anonymous' // Will be updated with actual user type
    );
  });
}
