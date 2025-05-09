const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ success: false, error: 'Method not allowed' })
      };
    }

    const requestBody = JSON.parse(event.body);
    if (!requestBody || typeof requestBody !== 'object') {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'Invalid JSON payload' })
      };
    }

    requestBody.token = process.env.PASSWORD;

    const appsScriptUrl = process.env.APPS_SCRIPT_URL;
    if (!appsScriptUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: 'Server configuration error' })
      };
    }

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(result)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Server error' })
    };
  }
};
