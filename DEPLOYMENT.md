# Deployment Guide: Legacy Partners Landing Page

## Pre-Deployment Checklist

### QA & Testing
- [ ] **Lighthouse audit** on production URL: all scores > 80
  ```bash
  npx lighthouse https://legacypartners.agency --output html --output-path=./lighthouse.html
  ```
- [ ] **Cross-browser testing**:
  - [ ] Chrome/Chromium (latest 2 versions)
  - [ ] Firefox (latest 2 versions)
  - [ ] Safari (latest 2 versions)
  - [ ] Mobile Safari (iOS 14+)
  - [ ] Chrome Mobile (Android 9+)
- [ ] **Mobile responsiveness**:
  - [ ] iPhone SE (375px)
  - [ ] iPhone 12 (390px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1920px+)
- [ ] **Form submission** testing:
  - [ ] All fields required validation
  - [ ] Email format validation
  - [ ] Form submission to API succeeds
  - [ ] Success message displays
  - [ ] Analytics events fire (GA4)
- [ ] **CTA tracking** verification:
  - [ ] Header CTA tracks as `header_cta_quote`
  - [ ] Hero CTAs track as `hero_cta_*`
  - [ ] Solutions CTA tracks as `solutions_cta_*`
  - [ ] Form submission tracks as `generate_lead`
- [ ] **Link verification**:
  - [ ] All Calendly links open in new tab
  - [ ] Navigation anchors work (#why-us, #solutions)
  - [ ] No 404s or broken links
- [ ] **Performance checks**:
  - [ ] Lazy-loaded images load properly
  - [ ] WebP images serve to supported browsers
  - [ ] JS bundle loads without errors
  - [ ] CSS loads without layout shifts (CLS < 0.1)

### Security & Compliance
- [ ] **SSL/TLS** certificate valid and auto-renewing
- [ ] **Security headers** configured:
  - [ ] Content-Security-Policy
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: DENY or SAMEORIGIN
  - [ ] Referrer-Policy: no-referrer
- [ ] **Privacy** compliance:
  - [ ] Privacy notice visible and accurate
  - [ ] Data handling policy clear
  - [ ] GDPR/CCPA compliant if applicable
- [ ] **CORS** configured for API endpoints

## Deployment Steps

### Option 1: Docker Compose (Recommended)
```bash
# Build the Docker image
docker compose build

# Start the service
docker compose up -d

# Verify it's running
curl http://localhost:8080
```

### Option 2: Manual Build & Serve
```bash
# Install dependencies
npm ci

# Build production bundle
npm run build

# Serve with your preferred web server (nginx, Apache, Vercel, etc.)
# For local testing:
npm run preview
```

### Option 3: CI/CD Pipeline
Push to main branch triggers:
1. `npm ci` — install dependencies
2. `npm run lint` — run ESLint
3. `npm run build` — create `dist/`
4. Run automated tests
5. Deploy `dist/` to CDN/server
6. Run smoke tests on production URL

## Monitoring & Analytics

### Key Metrics to Track
- **Performance**: FCP, LCP, CLS, TTI via Google Analytics
- **Conversions**: `generate_lead`, `conversion` events
- **Engagement**: CTA click rates by button location
- **Errors**: JavaScript errors, form submission failures

### Google Analytics Setup
- GA4 Property ID: `G-E47ET6JEZG`
- Key events configured:
  - `generate_lead` — form submission initiated
  - `conversion` — form submitted successfully
  - `view_item` — CTA button clicked
  - `exception` — errors or API failures

### Monitoring Tools
- [Google Analytics 4 Dashboard](https://analytics.google.com)
- [Sentry](https://sentry.io) for error tracking (optional)
- [Uptime Robot](https://uptimerobot.com) for availability (optional)

## Rollback Plan

### If Critical Issues Post-Deployment

**Immediate (< 5 minutes)**
1. Revert to previous Docker image or deploy previous `dist/` bundle
2. Test homepage loads and form works
3. Verify Google Analytics is tracking

**Communication**
1. Notify team via Slack/email
2. Update status page if applicable

**Quick Fixes Without Full Rollback**
- **Form not submitting?** Check API endpoint availability
- **Images broken?** Verify WebP fallbacks load PNG/JPEG
- **Analytics missing?** Check GA4 event configuration
- **Styles broken?** Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

### Previous Deployments (Rollback Targets)
Keep previous commits tagged for quick reference:
```bash
git tag -a v1.0.0-performance -m "Performance: image optimization, defer Tidio, GA async"
git tag -a v1.0.1-seo -m "SEO: Open Graph, JSON-LD, robots.txt, sitemap"
git tag -a v1.0.2-mobile-content -m "Mobile & Content: 48px touch targets, improved CTAs, trust signals"
git tag -a v1.0.3-analytics -m "Analytics: form tracking, CTA tracking"
git push origin --tags
```

### Rollback Command
```bash
# If using Docker
git checkout v1.0.2-mobile-content
docker compose build
docker compose up -d

# If using static file deployment
git checkout v1.0.2-mobile-content
npm run build
# Deploy dist/ to your server
```

## Post-Deployment Verification

1. **Homepage loads** (< 3s on 4G)
2. **Form submits** and success message shows
3. **GA4 events fire** in real-time dashboard
4. **Images lazy-load** without CLS
5. **Mobile looks good** on iOS and Android
6. **No console errors** (F12 → Console tab)

## Monitoring Dashboard (Optional Setup)

```javascript
// Add to index.html for real-time health checks
setInterval(() => {
  fetch('/').then(r => {
    if (r.ok) console.log('[HEALTH] Page OK at', new Date().toISOString());
  }).catch(e => console.error('[HEALTH] Failed:', e.message));
}, 60000); // Check every minute
```

## Support & Troubleshooting

**Q: Form not submitting?**
- Check backend API at `https://legacy-landing-page-1.onrender.com/api/leads`
- Verify network tab shows 200 response
- Check browser console for CORS errors

**Q: Analytics not tracking?**
- Verify GA4 property ID in `index.html`
- Check GA4 Real-Time dashboard for events
- Ensure gtag script loaded (Network tab)

**Q: Images not loading?**
- Check `public/` folder has `logo.webp`, `family-opt.jpg`
- Verify Content-Type headers (image/webp, image/jpeg)
- Try disabling browser cache or hard refresh

**Q: Styles look broken?**
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
- Clear browser cache or open in incognito
- Check CSS file loads in Network tab

---

**Last Updated:** July 17, 2026
**Version:** 1.0.3-analytics
