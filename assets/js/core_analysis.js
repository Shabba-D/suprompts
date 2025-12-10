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
        const goalCard = byType.Goal;
        if (recommended.includes('Goal') && (!goalCard || !goalCard.content || !goalCard.content.trim())) {
            recommendations.push('Ajoute une section Goal claire pour expliciter l’objectif de la tâche.');
        }
        const contextCard = byType.Context;
        if (recommended.includes('Context') && (!contextCard || !contextCard.content || !contextCard.content.trim())) {
            recommendations.push('Ajoute une section Context pour donner plus de contexte à l’IA.');
        }
        const examplesCard = byType.Examples;
        if (recommended.includes('Examples') && (!examplesCard || !examplesCard.content || !examplesCard.content.trim())) {
            recommendations.push('Ajoute des exemples concrets dans la section Examples.');
        }
    }

    const constraintsCard = byType.Constraints;
    if (!constraintsCard || !constraintsCard.content || !constraintsCard.content.trim()) {
        score -= 10;
        recommendations.push('Ajoute des contraintes explicites (format, longueur, style, éléments à éviter).');
    }

    const personaCard = byType.Persona;
    if (!personaCard || !personaCard.content || !personaCard.content.trim()) {
        score -= 8;
        recommendations.push('Précise la persona de l’IA (rôle, niveau d’expertise, posture).');
    }

    const toneCard = byType.Tone;
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
