# Netlify Functions for DayMatrix

This directory contains Netlify Functions that support the DayMatrix Angular application.

## Functions

### `spa-handler.js`
Handles Single Page Application (SPA) routing to ensure that all Angular routes work properly when accessed directly or refreshed.

**Features:**
- Redirects all non-static asset requests to the Angular app
- Handles client-side routing properly
- Provides fallback loading page
- Excludes static assets from redirection

### `health.js`
Provides a health check endpoint for monitoring the application status.

**Endpoint:** `/.netlify/functions/health`
**Method:** GET
**Response:** JSON with service status and timestamp

## Configuration Files

### `netlify.toml`
Main Netlify configuration file that:
- Sets build settings for Angular
- Configures function directory
- Sets up redirects for SPA routing
- Defines security headers
- Configures caching for static assets

### `_redirects`
Backup redirect configuration that:
- Handles Angular client-side routing
- Manages OAuth callback routes
- Sets up security headers
- Configures static asset serving

## How It Works

1. **Build Process:** Netlify builds the Angular app using `npm run build`
2. **Static Assets:** CSS, JS, images are served directly with long cache times
3. **Angular Routes:** All other requests are redirected to `index.html` to let Angular handle routing
4. **OAuth Support:** Special handling for authentication callback routes
5. **Security:** Security headers are applied to all responses

## Testing Locally

To test Netlify Functions locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start local development server
netlify dev
```

This will:
- Start your Angular dev server on port 4200
- Make functions available at `/.netlify/functions/[function-name]`
- Simulate the production redirect behavior

## Deployment

When you push to your repository, Netlify will automatically:
1. Run `npm run build` to build the Angular app
2. Deploy the built files to the CDN
3. Deploy the functions to Netlify's serverless platform
4. Apply the redirect and header rules

## Environment Variables

If you need environment variables for functions, add them in:
- Netlify dashboard under Site Settings > Environment Variables
- Or in a `.env` file for local development

## Security

The configuration includes several security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Enables XSS filtering
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info

## Performance

Caching is configured for optimal performance:
- Static assets (JS, CSS, images): 1 year cache
- HTML files: No cache (always fresh)
- API responses: Configurable per endpoint
