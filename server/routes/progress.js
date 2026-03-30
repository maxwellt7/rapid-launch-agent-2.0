import { launchDocDB } from '../config/database.js';

/**
 * Get generation progress for a specific generation ID
 */
export async function getGenerationProgressRoute(req, res) {
  try {
    const { generationId } = req.params;

    if (!generationId) {
      return res.status(400).json({
        success: false,
        error: 'Generation ID is required',
      });
    }

    const generation = await launchDocDB.getGenerationProgress(generationId);

    if (!generation) {
      return res.status(404).json({
        success: false,
        error: 'Generation not found',
      });
    }

    // Get completed sections
    const sections = await launchDocDB.getSections(generationId);

    res.json({
      success: true,
      data: {
        generationId: generation.id,
        status: generation.status,
        totalSections: generation.total_sections,
        completedSections: generation.completed_sections,
        startedAt: generation.started_at,
        completedAt: generation.completed_at,
        errorMessage: generation.error_message,
        sections: sections.map(s => ({
          id: s.section_number,
          title: s.section_title,
          content: s.content,
          generatedAt: s.generated_at,
        })),
      },
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

/**
 * Get latest generation for a project
 */
export async function getLatestGenerationRoute(req, res) {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: 'Project ID is required',
      });
    }

    const generation = await launchDocDB.getLatestGeneration(projectId);

    if (!generation) {
      return res.json({
        success: true,
        data: null,
      });
    }

    // Get completed sections
    const sections = await launchDocDB.getSections(generation.id);

    res.json({
      success: true,
      data: {
        generationId: generation.id,
        status: generation.status,
        totalSections: generation.total_sections,
        completedSections: generation.completed_sections,
        startedAt: generation.started_at,
        completedAt: generation.completed_at,
        errorMessage: generation.error_message,
        sections: sections.map(s => ({
          id: s.section_number,
          title: s.section_title,
          content: s.content,
          generatedAt: s.generated_at,
        })),
      },
    });
  } catch (error) {
    console.error('Latest generation fetch error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
