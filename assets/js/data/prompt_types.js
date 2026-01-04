// Prompt type definitions
// Each type defines which sections are recommended and visible

export const PROMPT_TYPES = {
    general: {
        label: 'Général',
        recommendedSections: ['goal', 'context', 'examples'],
        visibleSections: ['profil', 'goal', 'context', 'examples', 'audience', 'constraints', 'format', 'tone']
    },
    advanced: {
        label: 'Avancé (CoT, Few-shot)',
        recommendedSections: ['system_instructions', 'goal', 'reasoning_steps', 'few_shot_examples', 'output_schema'],
        visibleSections: ['system_instructions', 'profil', 'goal', 'context', 'reasoning_steps', 'thinking_process', 'few_shot_examples', 'output_schema', 'constraints', 'format', 'tone']
    },
    code: {
        label: 'Code & Développement',
        recommendedSections: ['system_instructions', 'goal', 'context', 'output_schema', 'constraints'],
        visibleSections: ['system_instructions', 'profil', 'goal', 'context', 'examples', 'output_schema', 'constraints', 'format']
    },
    music: {
        label: 'Musique (Suno, Moises...)',
        recommendedSections: ['goal', 'rhythm', 'ambiance', 'performers', 'constraints', 'format'],
        visibleSections: ['profil', 'goal', 'context', 'examples', 'audience', 'constraints', 'format', 'tone', 'rhythm', 'ambiance', 'performers']
    },
    image: {
        label: 'Image (Nano Banana, Midjourney...)',
        recommendedSections: ['goal', 'background', 'style', 'filter', 'constraints', 'format'],
        visibleSections: ['profil', 'goal', 'context', 'examples', 'audience', 'constraints', 'format', 'tone', 'background', 'filter', 'style']
    },
    persona: {
        label: 'Personas',
        recommendedSections: ['profil', 'goal', 'localisation', 'travail', 'constraints', 'tone'],
        visibleSections: ['profil', 'goal', 'context', 'examples', 'audience', 'constraints', 'format', 'tone', 'localisation', 'travail']
    }
};