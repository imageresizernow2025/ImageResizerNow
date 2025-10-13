# Google AdSense Setup Guide

## Prerequisites
1. Apply for Google AdSense approval
2. Get approved by Google AdSense
3. Create ad units in your AdSense dashboard

## Environment Variables Setup

Add these environment variables to your `.env.local` file:

```bash
# Google AdSense Configuration
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxx
NEXT_PUBLIC_ADS_ENABLED=false
NEXT_PUBLIC_AD_TEST_MODE=true
```

## Step-by-Step Setup

### 1. Get Your AdSense Client ID
1. Log into your Google AdSense account
2. Go to "Ads" → "By ad unit"
3. Copy your Publisher ID (starts with `ca-pub-`)
4. Update `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID` in your `.env.local`

### 2. Create Ad Units
Create these ad units in your AdSense dashboard:

#### Banner Ads
- **Top Banner Mobile**: 320x50 responsive banner
- **Top Banner Desktop**: 728x90 responsive banner  
- **Bottom Banner Mobile**: 320x50 responsive banner
- **Bottom Banner Desktop**: 728x90 responsive banner

#### Rectangle Ads
- **Sidebar Ad**: 300x250 rectangle (desktop only)
- **Between Tools Mobile**: 300x250 rectangle
- **Between Tools Desktop**: 728x90 responsive banner

#### Native Ads
- **Native Ad**: Fluid native ad unit

#### Modal Ads
- **Modal Top**: 320x50 banner for modal top position
- **Modal Middle**: 300x250 rectangle for modal middle position  
- **Modal Bottom**: 320x50 banner for modal bottom position

### 3. Update Ad Unit IDs
Replace the placeholder IDs in `src/lib/ad-config.ts`:

```typescript
adUnits: {
  // Replace these with your actual ad unit IDs
  topBannerMobile: '1234567890', // Your mobile banner ad unit ID
  topBannerDesktop: '1234567891', // Your desktop banner ad unit ID
  bottomBannerMobile: '1234567892', // Your mobile banner ad unit ID
  bottomBannerDesktop: '1234567893', // Your desktop banner ad unit ID
  sidebarAd: '1234567894', // Your rectangle ad unit ID
  betweenToolsMobile: '1234567895', // Your mobile rectangle ad unit ID
  betweenToolsDesktop: '1234567896', // Your desktop banner ad unit ID
  modalTop: '1234567898', // Your modal top banner ad unit ID
  modalMiddle: '1234567899', // Your modal rectangle ad unit ID
  modalBottom: '1234567900', // Your modal bottom banner ad unit ID
  nativeAd: '1234567897', // Your native ad unit ID
}
```

### 4. Enable Ads
1. Set `NEXT_PUBLIC_ADS_ENABLED=true` in your `.env.local`
2. Set `NEXT_PUBLIC_AD_TEST_MODE=false` in your `.env.local`
3. Deploy your changes

## Testing

### Test Mode
- Set `NEXT_PUBLIC_AD_TEST_MODE=true` to see placeholder ads
- This helps you verify ad placement without real ads

### Production Mode
- Set `NEXT_PUBLIC_ADS_ENABLED=true` and `NEXT_PUBLIC_AD_TEST_MODE=false`
- Real Google AdSense ads will be displayed

## Ad Unit Specifications

### Banner Ads (320x50, 728x90)
- **Format**: Responsive
- **Placement**: Top and bottom of pages
- **Mobile**: 320x50
- **Desktop**: 728x90

### Rectangle Ads (300x250)
- **Format**: Fixed size
- **Placement**: Sidebar (desktop), between tools (mobile), main tool interface
- **Size**: 300x250
- **Context**: Fills blank space next to resize options panel

### Native Ads
- **Format**: Fluid
- **Placement**: Between resize options (registered users only)
- **Layout**: Responsive

### Modal Ads
- **Format**: Banner (320x50) and Rectangle (300x250)
- **Placement**: Image Resizing Progress modal
- **Positions**: Top, Middle, Bottom of modal
- **Context**: High engagement during image processing

## Revenue Optimization Tips

1. **Placement Strategy**: Ads are strategically placed for maximum visibility
2. **User Experience**: Mobile-first approach with limited ad density
3. **Performance**: Lazy loading ensures fast page loads
4. **Targeting**: Different ad experiences for registered vs anonymous users

## Monitoring

### AdSense Dashboard
- Monitor impressions, clicks, and revenue
- Check for policy violations
- Optimize ad placements based on performance

### Analytics
- Track ad performance per page
- Monitor user engagement impact
- A/B test different ad densities

## Troubleshooting

### Ads Not Showing
1. Check if `NEXT_PUBLIC_ADS_ENABLED=true`
2. Verify your AdSense client ID is correct
3. Ensure ad units are approved in AdSense
4. Check browser console for errors

### Test Mode Issues
1. Set `NEXT_PUBLIC_AD_TEST_MODE=true`
2. Clear browser cache
3. Check if placeholder content appears

### Performance Issues
1. Ads are lazy-loaded to prevent blocking
2. Check Core Web Vitals in Google Search Console
3. Monitor page load speeds

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your AdSense account status
3. Test with different browsers
4. Contact Google AdSense support for account issues

---

**Note**: Always test thoroughly before going live with ads. Start with test mode to verify everything works correctly.
