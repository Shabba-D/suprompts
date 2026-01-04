// AI model configurations
// Each model has specific preferences for prompt formatting and structure

export const MODEL_CONFIGS = {
    'claude': {
        id: 'claude',
        displayName: 'Claude (Anthropic)',
        vendor: 'Anthropic',
        preferredFormat: 'xml',
        supportedTechniques: ['zero-shot', 'few-shot', 'chain-of-thought', 'react', 'tree-of-thoughts'],
        maxTokensGuideline: 200000,
        specialInstructions: 'Claude excelle avec les prompts structurés en XML. Utilisez des balises <thinking> pour le Chain of Thought (raisonnement étape par étape). Supporte les fenêtres de contexte étendues.',
        formatNotes: {
            xml: 'Recommandé – Utilisez des balises sémantiques comme <context>, <instructions>, <examples>',
            markdown: 'Supporté – Les titres de section clairs fonctionnent bien',
            json: 'Supporté – À utiliser pour les sorties structurées'
        }
    },
    'gpt': {
        id: 'gpt',
        displayName: 'GPT (OpenAI)',
        vendor: 'OpenAI',
        preferredFormat: 'markdown',
        supportedTechniques: ['zero-shot', 'few-shot', 'chain-of-thought', 'react', 'self-consistency'],
        maxTokensGuideline: 128000,
        specialInstructions: 'Les modèles GPT fonctionnent bien avec un formatage Markdown clair. Utilisez la structure de messages system/user/assistant. Excellent avec JSON pour les sorties structurées.',
        formatNotes: {
            markdown: 'Recommandé – Titres clairs et listes à puces',
            json: 'Excellent – Mode JSON natif disponible via l\'API',
            xml: 'Supporté – Mais moins optimal que le Markdown'
        }
    },
    'gemini': {
        id: 'gemini',
        displayName: 'Gemini (Google)',
        vendor: 'Google',
        preferredFormat: 'markdown',
        supportedTechniques: ['zero-shot', 'few-shot', 'chain-of-thought', 'multimodal'],
        maxTokensGuideline: 1000000,
        specialInstructions: 'Gemini excelle dans les tâches multimodales et le traitement de contextes longs. Structurez vos prompts avec des sections claires. Excellent pour les tâches de raisonnement complexe.',
        formatNotes: {
            markdown: 'Recommandé – Format structuré et épuré',
            json: 'Supporté – Bon pour les données structurées',
            xml: 'Supporté – Fonctionne bien pour les données hiérarchiques'
        }
    },
    'llama': {
        id: 'llama',
        displayName: 'Llama / Mistral',
        vendor: 'Meta / Mistral AI',
        preferredFormat: 'markdown',
        supportedTechniques: ['zero-shot', 'few-shot', 'chain-of-thought'],
        maxTokensGuideline: 32000,
        specialInstructions: 'Les modèles open-source bénéficient d\'instructions très explicites. Utilisez des templates de formatage stricts. Des délimiteurs clairs entre les sections améliorent les performances.',
        formatNotes: {
            markdown: 'Recommandé – Formatage strict avec délimiteurs clairs',
            json: 'Nécessite un prompting soigné pour obtenir du JSON valide',
            xml: 'Supporté mais peut nécessiter un fine-tuning'
        }
    },
    'deepseek': {
        id: 'deepseek',
        displayName: 'DeepSeek',
        vendor: 'DeepSeek AI',
        preferredFormat: 'markdown',
        supportedTechniques: ['zero-shot', 'few-shot', 'chain-of-thought', 'react'],
        maxTokensGuideline: 64000,
        specialInstructions: 'DeepSeek excelle dans les tâches de raisonnement avec une structure claire. Préfère les instructions explicites avec des étapes numérotées. Fonctionne bien avec les prompts Markdown et orientés code.',
        formatNotes: {
            markdown: 'Recommandé – Titres clairs avec structure explicite',
            json: 'Bon – Gère bien les données structurées',
            xml: 'Supporté – Fonctionne pour les données hiérarchiques'
        }
    }
};

// Default model if none selected
export const DEFAULT_MODEL = 'claude';