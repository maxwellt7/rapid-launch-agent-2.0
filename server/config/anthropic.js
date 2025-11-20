import Anthropic from '@anthropic-ai/sdk';

// Lazy initialization to ensure env vars are loaded
let anthropicInstance = null;

function getAnthropic() {
  if (!anthropicInstance) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY not set. AI features will not work.');
    }
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicInstance;
}

export const anthropic = {
  get messages() {
    return getAnthropic().messages;
  }
};

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929';
export const CLAUDE_TEMPERATURE = parseFloat(process.env.CLAUDE_TEMPERATURE || '0.7');

/**
 * Sleep helper for retry delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Call Claude with a prompt and return the response
 * Includes retry logic for rate limits and transient errors
 */
export async function callClaude(systemPrompt, userPrompt, options = {}) {
  const {
    model = CLAUDE_MODEL,
    temperature = CLAUDE_TEMPERATURE,
    maxTokens = 4000,
    maxRetries = 3,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: maxTokens,
        temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });

      return response.content[0].text;
    } catch (error) {
      lastError = error;

      // Check if it's a rate limit error (429) or server error (5xx)
      const isRetryable =
        error.status === 429 ||
        error.status === 529 ||
        (error.status >= 500 && error.status < 600);

      if (!isRetryable || attempt === maxRetries) {
        console.error('Anthropic API Error:', error.message);
        throw new Error(`Anthropic API call failed: ${error.message}`);
      }

      // Exponential backoff: 2^attempt seconds
      const delayMs = Math.pow(2, attempt) * 1000;
      console.warn(`Anthropic API rate limited or error. Retrying in ${delayMs}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await sleep(delayMs);
    }
  }

  throw new Error(`Anthropic API call failed after ${maxRetries} retries: ${lastError.message}`);
}

/**
 * Call Claude with streaming for long-running tasks
 */
export async function callClaudeStreaming(systemPrompt, userPrompt, onChunk, options = {}) {
  const {
    model = CLAUDE_MODEL,
    temperature = CLAUDE_TEMPERATURE,
    maxTokens = 4000,
  } = options;

  try {
    const stream = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      stream: true,
    });

    let fullContent = '';
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.text) {
        const text = event.delta.text;
        fullContent += text;
        if (onChunk) {
          onChunk(text);
        }
      }
    }

    return fullContent;
  } catch (error) {
    console.error('Anthropic Streaming API Error:', error.message);
    throw new Error(`Anthropic streaming call failed: ${error.message}`);
  }
}

