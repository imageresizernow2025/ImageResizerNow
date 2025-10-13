# Google CMP (Consent Management Platform) Setup

## Overview
This document explains how Google's CMP (Consent Management Platform) is integrated into ImageResizerNow for GDPR compliance.

## What is Google CMP?
Google CMP is a certified consent management platform that helps websites comply with GDPR, CCPA, and other privacy regulations by:
- Collecting user consent for cookies and data processing
- Managing consent preferences
- Integrating with Google AdSense and other Google services
- Providing a standardized consent interface

## Implementation

### 1. Google CMP Script
The CMP script is loaded in the main layout (`src/app/layout.tsx`):

```html
<!-- Google CMP for GDPR Compliance -->
<script 
  async 
  src="https://fundingchoicesmessages.google.com/i/pub-1125405879614984?ers=1"
/>
<script>
  (function() {
    function signalGooglefcPresent() {
      if (!window.frames['googlefcPresent']) {
        if (document.body) {
          const iframe = document.createElement('iframe');
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = 'none';
          iframe.style.zIndex = '-1000';
          iframe.style.left = '-1000px';
          iframe.style.top = '-1000px';
          iframe.name = 'googlefcPresent';
          document.body.appendChild(iframe);
        } else {
          setTimeout(signalGooglefcPresent, 0);
        }
      }
    }
    signalGooglefcPresent();
  })();
</script>
```

### 2. Google CMP Component
The `GoogleCMP` component (`src/components/GoogleCMP.tsx`) provides:
- Integration with Google's CMP API
- Consent status management
- Methods to show/hide consent banners and modals

### 3. Custom Consent Banner
The `ConsentBanner` component (`src/components/ConsentBanner.tsx`) provides:
- Fallback consent interface
- Three-choice options: Accept All, Reject, Manage
- Local storage for consent preferences
- Customizable styling

## Features

### Consent Options
1. **Accept All** - Grants consent for all cookies and data processing
2. **Reject** - Denies consent for non-essential cookies
3. **Manage** - Opens detailed consent management interface

### Cookie Categories
- **Essential Cookies** - Required for website functionality
- **Analytics Cookies** - Help understand website usage
- **Advertising Cookies** - Used for personalized ads

### Integration Points
- **Google AdSense** - Automatically respects consent choices
- **Google Analytics** - Respects analytics consent
- **Local Storage** - Remembers user preferences

## Configuration

### Environment Variables
No additional environment variables are required for basic CMP functionality.

### Customization
You can customize the consent banner by modifying:
- `src/components/ConsentBanner.tsx` - Banner appearance and behavior
- `src/components/GoogleCMP.tsx` - CMP integration logic

### Styling
The consent banner uses Tailwind CSS classes and can be customized:
- Background colors
- Button styles
- Text content
- Layout and positioning

## Testing

### Local Development
1. Open browser developer tools
2. Check console for CMP loading messages
3. Test consent banner appearance
4. Verify consent status updates

### Production Testing
1. Visit your live site
2. Clear browser cookies/localStorage
3. Refresh page to see consent banner
4. Test all consent options

## Compliance

### GDPR Compliance
- ✅ User consent collection
- ✅ Granular consent options
- ✅ Consent withdrawal
- ✅ Data processing transparency

### CCPA Compliance
- ✅ Right to opt-out
- ✅ Clear privacy notices
- ✅ Easy consent management

## Troubleshooting

### Common Issues
1. **CMP not loading** - Check network connectivity and script loading
2. **Consent banner not showing** - Verify localStorage is not blocking
3. **AdSense not respecting consent** - Ensure CMP is properly integrated

### Debug Mode
Enable debug logging by adding to console:
```javascript
window.googlefc && console.log('CMP Status:', window.googlefc.getConsentStatus());
```

## Best Practices

1. **Always show consent banner** for new users
2. **Respect user choices** - Don't override consent decisions
3. **Provide clear information** about data usage
4. **Make consent withdrawal easy** - Provide manage options
5. **Test regularly** - Ensure CMP works across devices/browsers

## Support

For issues with Google CMP:
- Check Google's CMP documentation
- Verify AdSense account settings
- Test with different browsers/devices
- Contact Google AdSense support if needed

## Future Enhancements

Potential improvements:
- A/B testing different consent flows
- Analytics on consent rates
- Integration with additional privacy tools
- Custom consent themes
- Multi-language support
