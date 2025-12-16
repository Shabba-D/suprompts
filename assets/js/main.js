// Main entry point: initialize and wire modules

import * as coreModule from './main_core.js';
import * as promptsModule from './main_prompts.js';
import * as abModule from './main_ab.js';

function initializeApp() {
    // Initialize core module
    coreModule.initializeCoreModule();

    // Initialize prompts and A/B modules with core reference
    promptsModule.initPromptsModule(coreModule);
    abModule.initABModule(coreModule);

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

// Script is loaded at the end of <body>, DOM is ready
initializeApp();