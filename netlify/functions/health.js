const { Handler } = require('@netlify/functions');

/**
 * Health check endpoint for monitoring
 */
const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'DayMatrix API',
      version: '1.0.0'
    })
  };
};

module.exports = { handler };
