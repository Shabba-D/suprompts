/**
 * Computes the analysis score and recommendations for the current prompt.
 * @param {Array} cards - The current list of cards.
 * @param {Array} recommendedSections - The list of recommended section IDs for the current prompt type.
 * @returns {Object} An object containing the score and a list of recommendations.
 */
function computeAnalysis(cards, recommendedSections) {
    const byType = {};
    cards.forEach(card => {
        byType[card.type] = card;
    });

    let score = 100;
    const recommendations = [];
    const recommended = recommendedSections || [];

    let missingImportant = 0;
    recommended.forEach(type => {
        const card = byType[type];
        if (!card || !card.content || !card.content.trim()) {
            missingImportant += 1;
        }
    });

    if (missingImportant > 0) {
        score -= missingImportant * 12;
        const goalCard = byType.goal;
        if (recommended.includes('goal') && (!goalCard || !goalCard.content || !goalCard.content.trim())) {
            recommendations.push('Ajoute une section But claire pour expliciter l\'objectif de la tâche.');
        }
        const contextCard = byType.context;
        if (recommended.includes('context') && (!contextCard || !contextCard.content || !contextCard.content.trim())) {
            recommendations.push('Ajoute une section Contexte pour donner plus de contexte à l\'IA.');
        }
        const examplesCard = byType.examples;
        if (recommended.includes('examples') && (!examplesCard || !examplesCard.content || !examplesCard.content.trim())) {
            recommendations.push('Ajoute des exemples concrets dans la section Exemples.');
        }
    }

    // Advanced prompting checks
    const systemCard = byType.system_instructions;
    if (recommended.includes('system_instructions') && (!systemCard || !systemCard.content || !systemCard.content.trim())) {
        recommendations.push('Ajoute des Instructions système pour définir le comportement global de l\'IA.');
    }

    const reasoningCard = byType.reasoning_steps;
    if (recommended.includes('reasoning_steps') && (!reasoningCard || !reasoningCard.content || !reasoningCard.content.trim())) {
        recommendations.push('Définis les Étapes de raisonnement (Chain of Thought) pour guider la réflexion de l\'IA.');
    }

    const fewShotCard = byType.few_shot_examples;
    if (recommended.includes('few_shot_examples')) {
        if (!fewShotCard || !fewShotCard.content || !fewShotCard.content.trim()) {
            recommendations.push('Ajoute des Exemples Few-shot (2-3 minimum) pour démontrer le comportement attendu.');
        } else {
            // Check for minimum examples
            const exampleCount = (fewShotCard.content.match(/Input\s*:/gi) || []).length;
            if (exampleCount < 2) {
                score -= 8;
                recommendations.push('Le Few-shot fonctionne mieux avec au moins 2-3 exemples. Tu n\'en as que ' + exampleCount + '.');
            }
        }
    }

    const schemaCard = byType.output_schema;
    if (recommended.includes('output_schema') && (!schemaCard || !schemaCard.content || !schemaCard.content.trim())) {
        recommendations.push('Définis un Schéma de sortie pour structurer précisément la réponse attendue.');
    }

    const constraintsCard = byType.constraints;
    if (!constraintsCard || !constraintsCard.content || !constraintsCard.content.trim()) {
        score -= 10;
        recommendations.push('Ajoute des contraintes explicites (format, longueur, style, éléments à éviter).');
    }

    const personaCard = byType.profil;
    if (!personaCard || !personaCard.content || !personaCard.content.trim()) {
        score -= 8;
        recommendations.push('Précise la persona de l’IA (rôle, niveau d’expertise, posture).');
    }

    const toneCard = byType.tone;
    if (!toneCard || !toneCard.content || !toneCard.content.trim()) {
        score -= 4;
        recommendations.push('Indique le ton souhaité (pédagogique, concis, formel, etc.).');
    }

    let totalChars = 0;
    cards.forEach(card => {
        if (card.content) {
            totalChars += card.content.length;
        }
    });

    if (totalChars < 300) {
        score -= 10;
        recommendations.push('Le prompt est très court : détaille davantage le contexte, l’objectif et les attentes.');
    } else if (totalChars < 800) {
        score -= 4;
        recommendations.push('Tu peux encore préciser certains éléments (contexte, exemples ou contraintes) pour mieux guider l’IA.');
    } else if (totalChars > 4000) {
        score -= 4;
        recommendations.push('Le prompt est très long : vérifie si certaines parties peuvent être simplifiées ou déplacées en annexe.');
    }

    // Limit recommendations count
    if (recommendations.length > 6) {
        const unique = [];
        recommendations.forEach(text => {
            if (!unique.includes(text)) {
                unique.push(text);
            }
        });
        while (unique.length > 6) {
            unique.pop();
        }
        return {
            score: score,
            recommendations: unique
        };
    }

    return {
        score: score,
        recommendations: recommendations
    };
}

export {
    computeAnalysis
};