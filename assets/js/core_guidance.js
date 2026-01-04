// Contextual guidance system
// Provides help, tips, and examples for techniques and sections

import {
    PROMPT_SECTIONS
} from './core_i18n.js';
import {
    PROMPTING_TECHNIQUES
} from './data/techniques.js';

/**
 * Section-specific tips and guidance
 * Provides contextual help when user focuses on a section
 */
export const SECTION_GUIDANCE = {
    system_instructions: {
        tips: [
            'Place les instructions les plus importantes en premier',
            'Utilise des verbes d\'action clairs : "Tu dois", "Ne jamais", "Toujours"',
            'Évite les instructions contradictoires'
        ],
        examples: [
            'Tu dois toujours citer tes sources.',
            'Ne jamais inventer de données ou de statistiques.',
            'Répondre uniquement en français.'
        ],
        commonMistakes: [
            'Instructions trop vagues ("Sois gentil")',
            'Trop d\'instructions (>5 risque de dilution)'
        ]
    },
    profil: {
        tips: [
            'Définis un rôle précis avec une expertise claire',
            'Ajoute des traits de personnalité pour plus de cohérence',
            'Inclus le niveau d\'expérience si pertinent'
        ],
        examples: [
            'Tu es un développeur senior Python avec 10 ans d\'expérience en data science.',
            'Tu es un critique littéraire bienveillant qui encourage les auteurs débutants.'
        ],
        commonMistakes: [
            'Rôle trop générique ("Tu es un expert")',
            'Personnalité contradictoire'
        ]
    },
    goal: {
        tips: [
            'Commence par un verbe d\'action (Rédige, Analyse, Crée...)',
            'Sois spécifique sur le livrable attendu',
            'Indique les critères de succès si possible'
        ],
        examples: [
            'Rédige un email de relance client de 150 mots maximum.',
            'Analyse ce code et identifie les 3 problèmes de performance principaux.'
        ],
        commonMistakes: [
            'But trop vague ("Aide-moi avec mon projet")',
            'Plusieurs objectifs mélangés'
        ]
    },
    context: {
        tips: [
            'Fournis les informations de background essentielles',
            'Précise ce qui a déjà été fait ou tenté',
            'Indique les contraintes externes (deadline, budget...)'
        ],
        examples: [
            'Le client a déjà reçu 2 relances sans réponse. C\'est un compte important.',
            'Ce code fait partie d\'une API REST en production avec 10k requêtes/jour.'
        ],
        commonMistakes: [
            'Contexte absent (l\'IA doit deviner)',
            'Trop de détails non pertinents'
        ]
    },
    reasoning_steps: {
        tips: [
            'Numérote les étapes clairement',
            'Chaque étape doit être vérifiable',
            'Inclus une étape de vérification finale'
        ],
        examples: [
            '1. Analyser le problème\n2. Identifier les variables\n3. Appliquer la formule\n4. Vérifier le résultat',
            '1. Lister les faits\n2. Identifier les hypothèses\n3. Évaluer chaque option\n4. Conclure'
        ],
        commonMistakes: [
            'Étapes trop vagues',
            'Sauter l\'étape de vérification'
        ]
    },
    thinking_process: {
        tips: [
            'Décris comment l\'IA doit réfléchir, pas juste ce qu\'elle doit faire',
            'Encourage l\'exploration de plusieurs angles',
            'Demande une auto-évaluation'
        ],
        examples: [
            'Avant de répondre, considère les pour et contre de chaque option.',
            'Pense à voix haute et montre ton raisonnement étape par étape.'
        ],
        commonMistakes: [
            'Confondre processus de réflexion et étapes de raisonnement',
            'Ne pas demander d\'expliciter le raisonnement'
        ]
    },
    few_shot_examples: {
        tips: [
            'Fournis 2-5 exemples représentatifs',
            'Couvre les cas limites si possible',
            'Utilise un format cohérent (Input/Output)'
        ],
        examples: [
            'Input: "Je suis très content!"\nOutput: Positif\n\nInput: "C\'est décevant."\nOutput: Négatif'
        ],
        commonMistakes: [
            'Un seul exemple (pas assez pour généraliser)',
            'Exemples trop similaires'
        ]
    },
    output_schema: {
        tips: [
            'Définis un schéma JSON/XML précis',
            'Indique les types de données attendus',
            'Précise les champs obligatoires vs optionnels'
        ],
        examples: [
            '{\n  "summary": "string",\n  "confidence": "number (0-1)",\n  "tags": ["string"]\n}'
        ],
        commonMistakes: [
            'Schéma ambigu',
            'Pas d\'exemple de sortie attendue'
        ]
    },
    constraints: {
        tips: [
            'Sois explicite sur ce qui est interdit',
            'Définis les limites de longueur',
            'Précise le niveau de formalité'
        ],
        examples: [
            'Maximum 200 mots.',
            'Ne pas mentionner les concurrents.',
            'Éviter le jargon technique.'
        ],
        commonMistakes: [
            'Contraintes contradictoires',
            'Trop de contraintes (paralysie)'
        ]
    },
    format: {
        tips: [
            'Spécifie la structure attendue (liste, tableau, paragraphes)',
            'Indique si tu veux du Markdown, JSON, texte brut...',
            'Fournis un exemple de format si complexe'
        ],
        examples: [
            'Retourne un tableau Markdown avec colonnes: Problème | Cause | Solution',
            'Format JSON avec les clés: title, description, priority'
        ],
        commonMistakes: [
            'Format non spécifié (l\'IA choisit)',
            'Format incompatible avec le contenu'
        ]
    },
    tone: {
        tips: [
            'Décris le ton avec des adjectifs précis',
            'Donne un exemple de style si nécessaire',
            'Adapte le ton à l\'audience'
        ],
        examples: [
            'Ton professionnel mais accessible, évite le jargon.',
            'Style direct et concis, comme un email entre collègues.'
        ],
        commonMistakes: [
            'Ton non adapté à l\'audience',
            'Instructions de ton contradictoires'
        ]
    }
};

/**
 * Model + Technique best practices
 * Specific recommendations for each model-technique combination
 */
export const MODEL_TECHNIQUE_GUIDANCE = {
    claude: {
        'chain-of-thought': {
            bestPractices: [
                'Claude excelle avec le raisonnement structuré en XML',
                'Utilise des balises <thinking> pour le raisonnement interne',
                'Demande explicitement de montrer le travail'
            ],
            tips: 'Claude suit naturellement les instructions de raisonnement étape par étape.'
        },
        'few-shot': {
            bestPractices: [
                'Claude généralise bien avec 2-3 exemples',
                'Sépare clairement les exemples avec des délimiteurs',
                'Utilise Human:/Assistant: pour les exemples de dialogue'
            ],
            tips: 'Claude est sensible au format des exemples - sois cohérent.'
        },
        'role-prompting': {
            bestPractices: [
                'Claude adopte bien les personas complexes',
                'Définis le background et les motivations du personnage',
                'Claude peut maintenir un rôle sur de longues conversations'
            ],
            tips: 'Plus le rôle est détaillé, plus Claude sera cohérent.'
        }
    },
    gpt: {
        'chain-of-thought': {
            bestPractices: [
                'GPT répond bien à "Let\'s think step by step"',
                'Structure le raisonnement en sections numérotées',
                'Demande une conclusion explicite après le raisonnement'
            ],
            tips: 'GPT peut avoir tendance à conclure trop vite - demande de détailler.'
        },
        'few-shot': {
            bestPractices: [
                'GPT apprend vite avec des exemples bien formatés',
                '3-5 exemples sont généralement optimaux',
                'Inclus des exemples de cas limites'
            ],
            tips: 'Le format des exemples influence fortement la sortie.'
        },
        'structured-output': {
            bestPractices: [
                'GPT supporte nativement le mode JSON',
                'Fournis un schéma JSON clair',
                'Utilise response_format: { type: "json_object" } si disponible'
            ],
            tips: 'GPT-4 est plus fiable que GPT-3.5 pour les sorties structurées.'
        }
    },
    gemini: {
        'chain-of-thought': {
            bestPractices: [
                'Gemini répond bien aux instructions de raisonnement explicites',
                'Utilise des sections Markdown claires',
                'Demande de citer les sources quand pertinent'
            ],
            tips: 'Gemini peut parfois être trop concis - demande des détails.'
        },
        'few-shot': {
            bestPractices: [
                'Gemini généralise bien à partir d\'exemples',
                'Utilise un format Input/Output cohérent',
                'Inclus des exemples variés'
            ],
            tips: 'Gemini est bon pour les tâches multimodales avec exemples.'
        }
    },
    deepseek: {
        'chain-of-thought': {
            bestPractices: [
                'DeepSeek excelle dans le raisonnement mathématique',
                'Structure les étapes avec des numéros',
                'Demande de vérifier le résultat à la fin'
            ],
            tips: 'DeepSeek est particulièrement fort pour les problèmes logiques.'
        },
        'react': {
            bestPractices: [
                'DeepSeek suit bien le pattern Thought/Action/Observation',
                'Définis clairement les actions disponibles',
                'Limite le nombre d\'itérations'
            ],
            tips: 'DeepSeek est efficace pour les tâches de raisonnement itératif.'
        }
    },
    llama: {
        'chain-of-thought': {
            bestPractices: [
                'Llama répond bien aux instructions structurées',
                'Utilise des délimiteurs clairs (###, ---)',
                'Sois explicite sur le format de sortie attendu'
            ],
            tips: 'Llama peut nécessiter des instructions plus explicites.'
        },
        'few-shot': {
            bestPractices: [
                'Llama bénéficie de plus d\'exemples (3-5)',
                'Format très cohérent entre les exemples',
                'Inclus un exemple négatif si pertinent'
            ],
            tips: 'La qualité des exemples est cruciale pour Llama.'
        }
    }
};

/**
 * Get guidance for a specific section
 * @param {string} sectionType - Section type (goal, context, etc.)
 * @returns {Object} Guidance object with tips, examples, commonMistakes
 */
export function getSectionGuidance(sectionType) {
    return SECTION_GUIDANCE[sectionType] || {
        tips: ['Sois clair et précis dans cette section.'],
        examples: [],
        commonMistakes: []
    };
}

/**
 * Get best practices for a model + technique combination
 * @param {string} modelId - Model identifier
 * @param {string} techniqueId - Technique identifier
 * @returns {Object} Best practices and tips
 */
export function getModelTechniqueGuidance(modelId, techniqueId) {
    const modelGuidance = MODEL_TECHNIQUE_GUIDANCE[modelId];
    if (modelGuidance && modelGuidance[techniqueId]) {
        return modelGuidance[techniqueId];
    }

    // Fallback generic guidance
    return {
        bestPractices: [
            'Suis les sections recommandées pour cette technique',
            'Adapte le niveau de détail à la complexité de ta tâche',
            'Teste et itère sur ton prompt'
        ],
        tips: 'Consulte la documentation de la technique pour plus de détails.'
    };
}

/**
 * Get a quick tip for the current context
 * @param {string} modelId - Current model
 * @param {string} techniqueId - Current technique
 * @param {string} sectionType - Section being edited (optional)
 * @returns {string} A contextual tip
 */
export function getQuickTip(modelId, techniqueId, sectionType = null) {
    if (sectionType) {
        const sectionGuidance = getSectionGuidance(sectionType);
        if (sectionGuidance.tips.length > 0) {
            return sectionGuidance.tips[Math.floor(Math.random() * sectionGuidance.tips.length)];
        }
    }

    const modelTechGuidance = getModelTechniqueGuidance(modelId, techniqueId);
    if (modelTechGuidance.tips) {
        return modelTechGuidance.tips;
    }

    return 'Sois précis et structuré pour de meilleurs résultats.';
}

/**
 * Get technique explanation with examples
 * @param {string} techniqueId - Technique identifier
 * @returns {Object} Full technique documentation
 */
export function getTechniqueDocumentation(techniqueId) {
    const technique = PROMPTING_TECHNIQUES[techniqueId];
    if (!technique) {
        return null;
    }

    const examples = {
        'zero-shot': {
            before: 'Écris un email.',
            after: 'Rédige un email de relance client de 150 mots maximum, ton professionnel mais chaleureux, pour un client qui n\'a pas répondu depuis 2 semaines.',
            explanation: 'Le zero-shot fonctionne mieux avec des instructions précises et complètes.'
        },
        'few-shot': {
            before: 'Classifie ce texte.',
            after: 'Classifie le sentiment du texte suivant.\n\nExemples:\n"Super produit!" → Positif\n"Décevant" → Négatif\n"Correct" → Neutre\n\nTexte à classifier: "J\'adore!"',
            explanation: 'Les exemples guident l\'IA sur le format et les catégories attendus.'
        },
        'chain-of-thought': {
            before: 'Résous ce problème de math.',
            after: 'Résous ce problème étape par étape:\n1. Identifie les données\n2. Choisis la méthode\n3. Applique les calculs\n4. Vérifie le résultat\n\nProblème: [...]',
            explanation: 'Demander de montrer le raisonnement améliore la précision.'
        },
        'role-prompting': {
            before: 'Donne-moi des conseils.',
            after: 'Tu es un coach sportif certifié avec 15 ans d\'expérience. Un débutant te demande comment commencer la course à pied. Donne des conseils pratiques et motivants.',
            explanation: 'Le rôle défini influence l\'expertise et le style de la réponse.'
        }
    };

    return {
        ...technique,
        example: examples[techniqueId] || null,
        sections: technique.requiredSections.map(s => ({
            type: s,
            label: (PROMPT_SECTIONS[s] && PROMPT_SECTIONS[s].label) || s,
            guidance: getSectionGuidance(s)
        }))
    };
}