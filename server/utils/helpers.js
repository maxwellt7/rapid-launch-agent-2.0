/**
 * Utility functions for the server
 */

/**
 * Safely parse JSON from AI response
 */
export function safeParseJSON(jsonString) {
  try {
    // Remove markdown code blocks if present
    let cleaned = jsonString.trim();
    
    // Handle various markdown formats
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/,'');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    // Extract JSON if there's text before/after
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    console.error('Full response length:', jsonString.length);
    console.error('First 500 chars:', jsonString.substring(0, 500));
    console.error('Last 200 chars:', jsonString.substring(jsonString.length - 200));
    throw new Error('Failed to parse AI response as JSON');
  }
}

/**
 * Format error response
 */
export function formatError(error) {
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };
}

/**
 * Validate required fields
 */
export function validateRequired(data, fields) {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

/**
 * Log API call
 */
export function logAPICall(endpoint, duration, success = true) {
  const emoji = success ? '✅' : '❌';
  console.log(`${emoji} ${endpoint} - ${duration}ms`);
}

