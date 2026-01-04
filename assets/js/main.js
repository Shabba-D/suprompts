// Main entry point: initialize and wire modules

import * as coreModule from './main_core.js';
import * as promptsModule from './main_prompts.js';
import * as abModule from './main_ab.js';
import {
    initPersonaSystem
} from './core_personas.js';

function initializeApp() {
    // Initialize core module
    coreModule.initializeCoreModule();

    // Initialize prompts and A/B modules with core reference
    promptsModule.initPromptsModule(coreModule);
    abModule.initABModule(coreModule);

    // Initialize persona system with callback to apply persona to profil card
    initPersonaSystem((personaPrompt) => {
        applyPersonaToCards(personaPrompt, coreModule);
    });

    // Optionally start with analysis panel collapsed
    const analysisPanel = document.querySelector('.analysis-panel');
    if (analysisPanel) {
        analysisPanel.classList.add('analysis-collapsed');
    }

    // Expose A/B overlay functions globally if needed by other scripts
    window.openABOverlay = abModule.openABOverlay;
    window.closeABOverlay = abModule.closeABOverlay;
    window.applyRightPromptToLeft = abModule.applyRightPromptToLeft;
}

/**
 * Apply a persona prompt to the profil/persona card
 * @param {string} personaPrompt - The persona prompt text
 * @param {Object} core - Reference to the core module
 */
function applyPersonaToCards(personaPrompt, core) {
    if (!personaPrompt || !core || !core.cards) {
        return;
    }

    // Find or create the profil card
    let profilCard = core.cards.find(card => card.type === 'profil');

    if (profilCard) {
        // Update existing card
        core.updateCardContent(profilCard, personaPrompt);
    } else {
        // Add new profil card with persona content
        core.cards.unshift({
            id: Date.now(),
            type: 'profil',
            content: personaPrompt
        });
    }

    core.renderCards();
    core.updatePrompt();
    core.showToast('Persona appliqué à la section Profil', 'success');
}

// Script is loaded at the end of <body>, DOM is ready
initializeApp();