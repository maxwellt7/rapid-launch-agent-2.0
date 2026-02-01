import { callClaude } from '../../config/anthropic.js';

/**
 * Swarm Orchestrator
 * Executes multiple AI nodes in parallel for faster generation
 *
 * Benefits:
 * - 5-10x faster than sequential execution
 * - Resilient to individual node failures
 * - Automatic retry logic
 * - Progress tracking
 */
export class SwarmOrchestrator {
  constructor(options = {}) {
    this.maxParallel = options.maxParallel || 5;
    this.retryAttempts = options.retryAttempts || 3;
    this.retryDelay = options.retryDelay || 2000;
    this.onProgress = options.onProgress || (() => {});
    this.onNodeComplete = options.onNodeComplete || (() => {});
    this.onNodeError = options.onNodeError || (() => {});
  }

  /**
   * Run a swarm of nodes in parallel
   * @param {Array} nodes - Array of node configurations
   * @param {Object} context - Shared context for all nodes
   * @returns {Map} - Map of node results (nodeId -> result)
   */
  async runSwarm(nodes, context = {}) {
    console.log(`🐝 Starting swarm with ${nodes.length} nodes (max ${this.maxParallel} parallel)`);

    const results = new Map();
    const errors = new Map();
    const queue = [...nodes];
    const inProgress = new Map();

    let completed = 0;
    let failed = 0;

    while (queue.length > 0 || inProgress.size > 0) {
      // Start new nodes up to maxParallel
      while (queue.length > 0 && inProgress.size < this.maxParallel) {
        const node = queue.shift();

        const nodePromise = this.executeNodeWithRetry(node, context, results)
          .then((result) => {
            // Node succeeded
            results.set(node.id, result);
            inProgress.delete(node.id);
            completed++;

            console.log(`✅ Node completed: ${node.id} (${completed}/${nodes.length})`);

            // Notify progress
            this.onProgress({
              completed,
              total: nodes.length,
              failed,
              nodeId: node.id,
              status: 'completed',
            });

            this.onNodeComplete(node.id, result);
          })
          .catch((error) => {
            // Node failed after all retries
            errors.set(node.id, error);
            inProgress.delete(node.id);
            failed++;

            console.error(`❌ Node failed: ${node.id}`, error.message);

            this.onProgress({
              completed,
              total: nodes.length,
              failed,
              nodeId: node.id,
              status: 'failed',
              error: error.message,
            });

            this.onNodeError(node.id, error);
          });

        inProgress.set(node.id, nodePromise);
      }

      // Wait a bit before checking again
      if (inProgress.size > 0) {
        await this.sleep(100);
      }
    }

    console.log(`🎉 Swarm complete: ${completed} succeeded, ${failed} failed`);

    // If all nodes failed, throw error
    if (completed === 0 && failed > 0) {
      throw new Error(`All nodes failed. First error: ${Array.from(errors.values())[0].message}`);
    }

    return results;
  }

  /**
   * Execute a single node with retry logic
   */
  async executeNodeWithRetry(node, context, completedResults) {
    let lastError;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        console.log(`🔄 Executing node: ${node.id} (attempt ${attempt + 1}/${this.retryAttempts})`);

        const result = await this.executeNode(node, context, completedResults);
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`⚠️  Node ${node.id} failed (attempt ${attempt + 1}):`, error.message);

        // Don't retry on the last attempt
        if (attempt < this.retryAttempts - 1) {
          const delay = this.retryDelay * Math.pow(2, attempt); // Exponential backoff
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(`Node ${node.id} failed after ${this.retryAttempts} attempts: ${lastError.message}`);
  }

  /**
   * Execute a single node
   */
  async executeNode(node, context, completedResults) {
    // Build node-specific context
    const nodeContext = {
      ...context,
      // Include results from completed nodes if needed
      completedResults: Object.fromEntries(completedResults),
    };

    // Get prompts (can be function or string)
    const systemPrompt = typeof node.systemPrompt === 'function'
      ? node.systemPrompt(nodeContext)
      : node.systemPrompt || this.getDefaultSystemPrompt(node);

    const userPrompt = typeof node.userPrompt === 'function'
      ? node.userPrompt(nodeContext)
      : node.userPrompt || this.getDefaultUserPrompt(node, nodeContext);

    // Call Claude with node-specific options
    const options = {
      model: node.model || 'claude-sonnet-4-5-20250929',
      temperature: node.temperature || 0.7,
      maxTokens: node.maxTokens || 4000,
      ...node.options,
    };

    const result = await callClaude(systemPrompt, userPrompt, options);

    // Post-process if needed
    if (node.postProcess) {
      return node.postProcess(result, nodeContext);
    }

    return result;
  }

  /**
   * Get default system prompt
   */
  getDefaultSystemPrompt(node) {
    return `You are an expert AI assistant specialized in ${node.id}.
Provide detailed, actionable, and high-quality output.`;
  }

  /**
   * Get default user prompt
   */
  getDefaultUserPrompt(node, context) {
    return `Task: ${node.description || node.id}

Context: ${JSON.stringify(context, null, 2)}

Provide your analysis or output:`;
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Run a wave-based swarm (for dependencies)
 * Execute waves sequentially, but nodes within each wave in parallel
 */
export async function runWaveBasedSwarm(waves, context = {}, options = {}) {
  console.log(`🌊 Starting wave-based swarm with ${waves.length} waves`);

  const orchestrator = new SwarmOrchestrator(options);
  const allResults = new Map();

  for (let waveIndex = 0; waveIndex < waves.length; waveIndex++) {
    const wave = waves[waveIndex];
    console.log(`\n🌊 Wave ${waveIndex + 1}/${waves.length}: ${wave.nodes.length} nodes`);

    // Add previous wave results to context
    const waveContext = {
      ...context,
      previousWaves: Object.fromEntries(allResults),
    };

    // Run wave
    const waveResults = await orchestrator.runSwarm(wave.nodes, waveContext);

    // Merge results
    for (const [nodeId, result] of waveResults.entries()) {
      allResults.set(nodeId, result);
    }

    console.log(`✅ Wave ${waveIndex + 1} complete\n`);
  }

  console.log(`🎉 All waves complete: ${allResults.size} total nodes`);
  return allResults;
}

export default SwarmOrchestrator;
