const { Handler } = require('@netlify/functions');

/**
 * Netlify Function to handle SPA routing
 * This ensures that all client-side routes work properly
 */
const handler = async (event, context) => {
  const { path, httpMethod, headers } = event;

  // Only handle GET requests for HTML pages
  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  // Check if the request is for a static asset
  const staticAssetExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', 
    '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml'
  ];

  const isStaticAsset = staticAssetExtensions.some(ext => path.endsWith(ext));
  
  if (isStaticAsset) {
    // Let Netlify handle static assets normally
    return {
      statusCode: 404,
      body: 'Static asset not found'
    };
  }

  // For all other requests, serve the Angular app
  // This will be caught by the _redirects file
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache'
    },
    body: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DayMatrix - Loading...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>
    // Redirect to the main app
    window.location.href = '/';
  </script>
</head>
<body>
  <div style="
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #1c5f78, #b00457);
    color: white;
  ">
    <div style="text-align: center;">
      <div style="
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        margin: 0 auto 1rem;
        animation: spin 1s linear infinite;
      "></div>
      <h2>Loading DayMatrix...</h2>
      <p>Redirecting you to the application...</p>
    </div>
  </div>
  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</body>
</html>
    `
  };
};

module.exports = { handler };
