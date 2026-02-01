import { generateContent } from '../services/swarm/contentSwarm.js';
import { contentDB } from '../config/database.js';
import { formatError, logAPICall } from '../utils/helpers.js';

/**
 * Generate content using specialized prompts and swarm orchestration
 *
 * Supported Content Types:
 * - blur: BLUR method cold email campaign
 * - ad_script: Video ad scripts (Facebook, YouTube, TikTok)
 * - vsl: Video Sales Letter script
 * - landing_page: Sales page copy
 * - email_sequence: Email nurture/sales sequences
 */
export async function generateContentRoute(req, res) {
  const startTime = Date.now();

  try {
    const { contentType, projectId, avatar, offer, ...params } = req.body;

    // Validate required fields
    if (!contentType) {
      return res.status(400).json({
        success: false,
        error: 'contentType is required',
      });
    }

    const validTypes = ['blur', 'ad_script', 'vsl', 'landing_page', 'email_sequence'];
    if (!validTypes.includes(contentType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid contentType. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    console.log(`📝 Generating ${contentType} content...`);

    // Prepare input data
    const inputData = {
      avatar,
      offer,
      ...params,
    };

    // Generate content using swarm
    const result = await generateContent(contentType, inputData);

    // Save to database if projectId provided
    if (projectId) {
      await contentDB.create({
        projectId,
        contentType,
        contentJson: result,
        status: 'completed',
      });

      console.log(`✅ Content saved to database for project ${projectId}`);
    }

    logAPICall(`POST /api/generate/content/${contentType}`, Date.now() - startTime);

    res.json({
      success: true,
      data: result,
      meta: {
        generationTime: Date.now() - startTime,
        contentType,
        method: 'swarm',
      },
    });
  } catch (error) {
    console.error('❌ Content generation error:', error);
    logAPICall('POST /api/generate/content', Date.now() - startTime, false);
    res.status(500).json(formatError(error));
  }
}

/**
 * Get content generation by ID
 */
export async function getContentRoute(req, res) {
  try {
    const { contentId } = req.params;

    const content = await contentDB.getById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('❌ Get content error:', error);
    res.status(500).json(formatError(error));
  }
}

/**
 * List all content for a project
 */
export async function listContentRoute(req, res) {
  try {
    const { projectId } = req.params;
    const { contentType } = req.query;

    let contents;
    if (contentType) {
      contents = await contentDB.listByProjectAndType(projectId, contentType);
    } else {
      contents = await contentDB.listByProject(projectId);
    }

    res.json({
      success: true,
      data: contents,
    });
  } catch (error) {
    console.error('❌ List content error:', error);
    res.status(500).json(formatError(error));
  }
}

export default { generateContentRoute, getContentRoute, listContentRoute };
