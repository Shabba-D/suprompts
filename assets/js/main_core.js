// Core module extracted from main_v2.js

import {
    PROMPT_TYPES
} from './data/prompt_types.js';
import {
    TEMPLATES
} from './data/templates.js';
import {
    MODEL_CONFIGS,
    DEFAULT_MODEL
} from './data/models.js';
import {
    PROMPTING_TECHNIQUES
} from './data/techniques.js';
import {
    formatPromptForModel
} from './model_formatters.js';
import {
    getModelTechniqueGuidance,
    getSectionGuidance
} from './core_guidance.js';

import {
    triggerActionButtonAnimation,
    generatePromptText,
    comparePromptsByFavoriteAndUpdatedAtDesc,
    showToast,
    showConfirm,
    showInput,
    getBaseNameFromPromptName,
    findNextVariantName,
    ensureUniquePromptName
} from './core_utils.js';

import {
    computeAnalysis
} from './core_analysis.js';

import {
    loadStorageData,
    saveStorageData
} from './core_storage.js';

import * as UI from './core_ui.js';
import {
    paragraphCards
} from './core_ui.js';

// DOM Elements
const cardsContainer = document.getElementById('cards-container');
const promptOutput = document.getElementById('prompt-output');
const modeSelector = document.getElementById('mode-select');
const modelSelector = document.getElementById('model-select');
const promptTypeSelector = document.getElementById('prompt-type-select');
const modelInfoButton = document.getElementById('model-info-btn');
const modelInfoModal = document.getElementById('model-info-modal');
const modelInfoClose = document.getElementById('model-info-close');
const techniqueSelector = document.getElementById('technique-select');
const techniqueInfoButton = document.getElementById('technique-info-btn');
const techniqueInfoModal = document.getElementById('technique-info-modal');
const techniqueInfoClose = document.getElementById('technique-info-close');
const techniqueApplyTemplate = document.getElementById('technique-apply-template');

const languageSelector = document.getElementById('language');

const copyPromptButton = document.getElementById('copy-prompt-btn');
const copyFeedback = document.getElementById('copy-feedback');
const completionIndicator = document.getElementById('completion-indicator');
const analysisScoreElement = document.getElementById('analysis-score');
const analysisRecommendationsElement = document.getElementById('analysis-recommendations');
const analysisPanel = document.querySelector('.analysis-panel');
const analysisToggleButton = document.getElementById('analysis-toggle');

const advancedToolsWrapper = document.querySelector('.advanced-tools-wrapper');
const advancedToolsHeader = document.querySelector('.advanced-tools-header');

const leftPanelElement = document.querySelector('.left-panel');
const centerPanelElement = document.querySelector('.center-panel');
const rightPanelElement = document.querySelector('.right-panel');

// State
const STORAGE_KEY = 'suprompts_storage_v1';
let currentModel = DEFAULT_MODEL;
let currentPromptType = 'general';
let storageData = {
    lastSession: null,
    prompts: {},
    versions: {}
};
let cards = [];
let copyFeedbackTimeoutId = null;

// Initialization
if (advancedToolsHeader && advancedToolsWrapper) {
    advancedToolsHeader.addEventListener('click', () => {
        const isOpen = advancedToolsWrapper.classList.toggle('advanced-tools-open');
        advancedToolsHeader.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
}

document.addEventListener('click', event => {
    if (!advancedToolsWrapper || !advancedToolsWrapper.classList.contains('advanced-tools-open')) {
        return;
    }
    if (advancedToolsWrapper.contains(event.target)) {
        return;
    }
    advancedToolsWrapper.classList.remove('advanced-tools-open');

    if (advancedToolsHeader) {
        advancedToolsHeader.setAttribute('aria-expanded', 'false');
    }
});

// Helper functions that bridge logic and UI
function showCopyFeedbackWrapper(message, isError) {
    if (copyFeedback) {
        UI.showCopyFeedback(copyFeedback, message, isError);
        clearTimeout(copyFeedbackTimeoutId);
        copyFeedbackTimeoutId = setTimeout(() => {
            copyFeedback.textContent = '';
        }, 2000);
    }
}

function updateCardContent(target, content) {
    if (!target) {
        return;
    }
    target.content = content;
    updatePrompt();
}

function addCard(type) {
    if (cards.some(card => card.type === type)) {
        return;
    }
    cards.push({
        id: Date.now(),
        type: type,
        content: ''
    });
    renderCardsWrapper();
    updatePrompt();
}

function removeCard(target) {
    cards = cards.filter(card => card !== target);
    renderCardsWrapper();
    updatePrompt();
}

function renderCardsWrapper() {
    UI.renderCards(cardsContainer, cards, updateCardContent, removeCard);
}

function updatePrompt() {
    if (!promptOutput || !languageSelector) {
        return;
    }
    const language = languageSelector.value;
    const promptText = formatPromptForModel(cards, currentModel, language);
    promptOutput.textContent = promptText;
    saveLastSession();
    updateQualityIndicator();
    updateAnalysis();
}

function loadStorage() {
    storageData = loadStorageData(STORAGE_KEY);
}

function saveStorage() {
    saveStorageData(STORAGE_KEY, storageData);
}

function saveLastSession() {
    storageData.lastSession = {
        language: languageSelector ? languageSelector.value : 'markdown',
        model: currentModel,
        promptType: currentPromptType,
        cards: cards.map(card => ({
            type: card.type,
            content: card.content || ''
        }))
    };
    saveStorage();
}

function initializeFromStorage() {
    if (!storageData.lastSession) {
        return;
    }

    // Restore model selection
    if (storageData.lastSession.model && MODEL_CONFIGS[storageData.lastSession.model]) {
        currentModel = storageData.lastSession.model;
    }

    // Restore prompt type selection
    if (storageData.lastSession.promptType && PROMPT_TYPES[storageData.lastSession.promptType]) {
        currentPromptType = storageData.lastSession.promptType;
    }

    // Restore language format
    if (languageSelector && storageData.lastSession.language) {
        languageSelector.value = storageData.lastSession.language;
    }

    // Restore cards
    if (Array.isArray(storageData.lastSession.cards)) {
        cards = storageData.lastSession.cards.map(card => ({
            type: card.type,
            content: card.content || ''
        }));
        renderCardsWrapper();
        updatePrompt();
    }
}

function applyTemplate(templateId) {
    const template = TEMPLATES[templateId];
    if (!template) {
        return;
    }
    cards = template.sections.map(type => {
        const presets = template.presets || {};
        const content = typeof presets[type] === 'string' ? presets[type] : '';
        return {
            type: type,
            content: content
        };
    });
    renderCardsWrapper();
    updatePrompt();
}

function getCurrentPromptTypeConfig() {
    const config = PROMPT_TYPES[currentPromptType];
    if (config) {
        return config;
    }
    const keys = Object.keys(PROMPT_TYPES);
    if (keys.length === 0) {
        return null;
    }
    return PROMPT_TYPES[keys[0]];
}

function getRecommendedSections() {
    const config = getCurrentPromptTypeConfig();
    if (!config || !Array.isArray(config.recommendedSections)) {
        return [];
    }
    return config.recommendedSections;
}

function getVisibleSections() {
    const config = getCurrentPromptTypeConfig();
    if (config && Array.isArray(config.visibleSections) && config.visibleSections.length > 0) {
        return config.visibleSections;
    }
    // Fallback if no specific config
    return UI.paragraphCards && UI.paragraphCards.length > 0 ?
        Array.from(UI.paragraphCards).map(card => card.dataset.paragraph).filter(Boolean) : [];
}

function applyPromptTypeConfig() {
    UI.updateVisibleParagraphCards(getVisibleSections());
    const recommended = getRecommendedSections();
    UI.updateRecommendedSectionBadges(recommended);
    UI.reorderParagraphCards(recommended);
    updateQualityIndicator();
    updateAnalysis();
    renderCardsWrapper();
}

function setupModelSelector() {
    if (!modelSelector) {
        return;
    }
    modelSelector.innerHTML = '';
    Object.keys(MODEL_CONFIGS).forEach(id => {
        const config = MODEL_CONFIGS[id];
        const option = document.createElement('option');
        option.value = id;
        option.textContent = config.displayName;
        modelSelector.appendChild(option);
    });
    if (!MODEL_CONFIGS[currentModel]) {
        const keys = Object.keys(MODEL_CONFIGS);
        if (keys.length > 0) {
            currentModel = keys[0];
        }
    }
    if (currentModel) {
        modelSelector.value = currentModel;
    }
    modelSelector.addEventListener('change', () => {
        const value = modelSelector.value;
        if (!value || !MODEL_CONFIGS[value]) {
            return;
        }
        currentModel = value;
        updatePrompt();
        updateFormatHint();
    });
}

function setupModelInfoModal() {
    if (modelInfoButton) {
        modelInfoButton.addEventListener('click', showModelInfo);
    }
    if (modelInfoClose) {
        modelInfoClose.addEventListener('click', hideModelInfo);
    }
    if (modelInfoModal) {
        modelInfoModal.addEventListener('click', (e) => {
            if (e.target === modelInfoModal) {
                hideModelInfo();
            }
        });
    }
}

function showModelInfo() {
    const config = MODEL_CONFIGS[currentModel];
    if (!config || !modelInfoModal) {
        return;
    }

    // Populate modal content
    const nameEl = document.getElementById('model-info-name');
    const vendorEl = document.getElementById('model-info-vendor');
    const formatEl = document.getElementById('model-info-format');
    const techniquesEl = document.getElementById('model-info-techniques');
    const instructionsEl = document.getElementById('model-info-instructions');
    const formatNotesEl = document.getElementById('model-info-format-notes');
    const tokensEl = document.getElementById('model-info-tokens');

    if (nameEl) nameEl.textContent = config.displayName;
    if (vendorEl) vendorEl.textContent = config.vendor;
    if (formatEl) formatEl.textContent = config.preferredFormat.toUpperCase();
    if (instructionsEl) instructionsEl.textContent = config.specialInstructions;
    if (tokensEl) tokensEl.textContent = `~${config.maxTokensGuideline.toLocaleString()} tokens`;

    // Populate techniques with French translations
    const techniqueTranslations = {
        'zero-shot': 'Zero-shot (sans exemple)',
        'few-shot': 'Few-shot (avec exemples)',
        'chain-of-thought': 'Chain of Thought (raisonnement étape par étape)',
        'react': 'ReAct (raisonnement et action)',
        'tree-of-thoughts': 'Tree of Thoughts (arbre de pensées)',
        'self-consistency': 'Self-consistency (cohérence interne)',
        'multimodal': 'Multimodal (multimodal)'
    };

    if (techniquesEl) {
        techniquesEl.innerHTML = '';
        config.supportedTechniques.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = techniqueTranslations[tech] || tech;
            techniquesEl.appendChild(li);
        });
    }

    // Populate format notes
    if (formatNotesEl && config.formatNotes) {
        formatNotesEl.innerHTML = '';
        Object.keys(config.formatNotes).forEach(format => {
            const p = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = format.toUpperCase() + ':';
            p.appendChild(strong);
            p.appendChild(document.createTextNode(' ' + config.formatNotes[format]));
            p.style.marginBottom = '8px';
            formatNotesEl.appendChild(p);
        });
    }

    // Show modal
    modelInfoModal.classList.add('active');
}

function hideModelInfo() {
    if (modelInfoModal) {
        modelInfoModal.classList.remove('active');
    }
}

function updateFormatHint() {
    const config = MODEL_CONFIGS[currentModel];
    if (!config) return;

    let hintEl = document.querySelector('.format-hint');
    if (!hintEl && promptOutput) {
        hintEl = document.createElement('div');
        hintEl.className = 'format-hint';
        promptOutput.parentElement.insertBefore(hintEl, promptOutput);
    }

    if (hintEl && languageSelector) {
        const currentFormat = languageSelector.value;
        const preferredFormat = config.preferredFormat;

        if (currentFormat === preferredFormat) {
            hintEl.textContent = `✓ Format optimal pour ${config.displayName}`;
            hintEl.style.borderColor = 'var(--secondary)';
            hintEl.style.background = 'rgba(166, 226, 46, 0.1)';
        } else {
            hintEl.textContent = '';
            hintEl.appendChild(document.createTextNode(`💡 ${config.displayName} préfère le format `));
            const strong = document.createElement('strong');
            strong.textContent = preferredFormat.toUpperCase();
            hintEl.appendChild(strong);
            hintEl.style.borderColor = 'var(--primary)';
            hintEl.style.background = 'rgba(255, 122, 0, 0.1)';
        }
    }
}

function setupPromptTypeSelector() {
    if (!promptTypeSelector) {
        return;
    }
    promptTypeSelector.innerHTML = '';
    Object.keys(PROMPT_TYPES).forEach(id => {
        const config = PROMPT_TYPES[id];
        const option = document.createElement('option');
        option.value = id;
        option.textContent = config.label;
        promptTypeSelector.appendChild(option);
    });
    if (!PROMPT_TYPES[currentPromptType]) {
        const keys = Object.keys(PROMPT_TYPES);
        if (keys.length > 0) {
            currentPromptType = keys[0];
        }
    }
    if (currentPromptType) {
        promptTypeSelector.value = currentPromptType;
    }
    applyPromptTypeConfig();
    promptTypeSelector.addEventListener('change', () => {
        const value = promptTypeSelector.value;
        if (!value || !PROMPT_TYPES[value]) {
            return;
        }
        currentPromptType = value;
        applyPromptTypeConfig();
    });
}

function getCompatibleTechniques() {
    const techniques = Object.keys(PROMPTING_TECHNIQUES);
    return techniques.filter(id => {
        const tech = PROMPTING_TECHNIQUES[id];
        return tech.compatibleModels.includes(currentModel);
    });
}

function setupTechniqueSelector() {
    if (!techniqueSelector) {
        return;
    }

    const compatibleTechniques = getCompatibleTechniques();
    techniqueSelector.innerHTML = '';

    compatibleTechniques.forEach(id => {
        const tech = PROMPTING_TECHNIQUES[id];
        const option = document.createElement('option');
        option.value = id;
        option.textContent = tech.displayName;
        techniqueSelector.appendChild(option);
    });

    if (compatibleTechniques.length > 0) {
        techniqueSelector.value = compatibleTechniques[0];
    }
}

function showTechniqueInfo() {
    if (!techniqueSelector || !techniqueInfoModal) {
        return;
    }

    const techId = techniqueSelector.value;
    const tech = PROMPTING_TECHNIQUES[techId];
    if (!tech) {
        return;
    }

    const nameEl = document.getElementById('technique-info-name');
    const descEl = document.getElementById('technique-info-description');
    const requiredEl = document.getElementById('technique-info-required');
    const optionalEl = document.getElementById('technique-info-optional');
    const modelsEl = document.getElementById('technique-info-models');
    const usecasesEl = document.getElementById('technique-info-usecases');
    const bestpracticesEl = document.getElementById('technique-info-bestpractices');
    const tipEl = document.getElementById('technique-info-tip');
    const bestpracticesSection = document.getElementById('technique-info-bestpractices-section');

    if (nameEl) nameEl.textContent = tech.displayName;
    if (descEl) descEl.textContent = tech.description;

    if (requiredEl) {
        requiredEl.innerHTML = '';
        tech.requiredSections.forEach(section => {
            const li = document.createElement('li');
            const strong = document.createElement('strong');
            strong.textContent = section;
            li.appendChild(strong);
            requiredEl.appendChild(li);
        });
    }

    if (optionalEl) {
        optionalEl.innerHTML = '';
        tech.optionalSections.forEach(section => {
            const li = document.createElement('li');
            li.textContent = section;
            optionalEl.appendChild(li);
        });
    }

    if (modelsEl) {
        modelsEl.textContent = tech.compatibleModels.map(m => {
            const cfg = MODEL_CONFIGS[m];
            return cfg ? cfg.displayName : m;
        }).join(', ');
    }

    if (usecasesEl) {
        usecasesEl.innerHTML = '';
        tech.useCases.forEach(usecase => {
            const li = document.createElement('li');
            li.textContent = usecase;
            usecasesEl.appendChild(li);
        });
    }

    // Display model-specific best practices
    const guidance = getModelTechniqueGuidance(currentModel, techId);
    if (bestpracticesEl && guidance.bestPractices) {
        bestpracticesEl.innerHTML = '';
        guidance.bestPractices.forEach(practice => {
            const li = document.createElement('li');
            li.textContent = practice;
            bestpracticesEl.appendChild(li);
        });
        if (bestpracticesSection) bestpracticesSection.style.display = 'block';
    } else if (bestpracticesSection) {
        bestpracticesSection.style.display = 'none';
    }

    if (tipEl && guidance.tips) {
        tipEl.textContent = guidance.tips;
    } else if (tipEl) {
        tipEl.textContent = '';
    }

    techniqueInfoModal.classList.add('active');
}

function hideTechniqueInfo() {
    if (techniqueInfoModal) {
        techniqueInfoModal.classList.remove('active');
    }
}

function applyTechniqueTemplate() {
    if (!techniqueSelector) {
        return;
    }

    const techId = techniqueSelector.value;
    const tech = PROMPTING_TECHNIQUES[techId];
    if (!tech || !tech.template) {
        return;
    }

    const existingByType = {};
    cards.forEach(card => {
        if (card.content && card.content.trim()) {
            existingByType[card.type] = card.content;
        }
    });

    const allSections = [...tech.requiredSections, ...tech.optionalSections];
    cards = allSections.map(type => {
        const templateContent = tech.template[type] || '';
        const existingContent = existingByType[type] || '';

        let finalContent = '';
        if (templateContent && templateContent.trim()) {
            if (existingContent && existingContent.trim()) {
                finalContent = templateContent + '\n\n--- Contenu précédent ---\n\n' + existingContent;
            } else {
                finalContent = templateContent;
            }
        } else {
            finalContent = existingContent || '';
        }

        return {
            id: Date.now() + Math.random(),
            type: type,
            content: finalContent
        };
    });

    renderCardsWrapper();
    updatePrompt();
    hideTechniqueInfo();
    showToast(`Template "${tech.displayName}" appliqué (contenu existant préservé)`);
}

function setupTechniqueInfoModal() {
    if (techniqueInfoButton) {
        techniqueInfoButton.addEventListener('click', showTechniqueInfo);
    }
    if (techniqueInfoClose) {
        techniqueInfoClose.addEventListener('click', hideTechniqueInfo);
    }
    if (techniqueInfoModal) {
        techniqueInfoModal.addEventListener('click', (e) => {
            if (e.target === techniqueInfoModal) {
                hideTechniqueInfo();
            }
        });
    }
    if (techniqueApplyTemplate) {
        techniqueApplyTemplate.addEventListener('click', applyTechniqueTemplate);
    }
}

function updateQualityIndicator() {
    const byType = {};
    cards.forEach(card => {
        byType[card.type] = card;
    });
    const recommended = getRecommendedSections();
    let filled = 0;
    recommended.forEach(type => {
        const card = byType[type];
        if (card && card.content && card.content.trim()) {
            filled += 1;
        }
    });
    UI.updateCompletionIndicator(completionIndicator, filled, recommended.length);
}

function setupModeSelector() {
    if (!modeSelector) {
        return;
    }

    const savedMode = localStorage.getItem('suprompts_mode') || 'simple';
    modeSelector.value = savedMode;
    applyMode(savedMode);

    modeSelector.addEventListener('change', () => {
        const mode = modeSelector.value;
        applyMode(mode);
        localStorage.setItem('suprompts_mode', mode);
    });
}

function showOnboardingHint() {
    const hasSeenOnboarding = localStorage.getItem('suprompts_onboarding_seen');
    if (hasSeenOnboarding) {
        return;
    }

    const hint = document.createElement('div');
    hint.className = 'onboarding-hint';
    hint.innerHTML = `
        <div class="onboarding-content">
            <h3>👋 Bienvenue sur Suprompts !</h3>
            <p>Créez des prompts optimisés pour différents modèles d'IA.</p>
            <ul>
                <li><strong>Mode Simple</strong> : Interface épurée pour débuter</li>
                <li><strong>Mode Avancé</strong> : Accès à toutes les techniques</li>
            </ul>
            <p>Cliquez sur les <strong>cartes de sections</strong> à gauche pour construire votre prompt.</p>
            <button class="primary-button onboarding-dismiss">Commencer</button>
        </div>
    `;

    document.body.appendChild(hint);

    const dismissBtn = hint.querySelector('.onboarding-dismiss');
    dismissBtn.addEventListener('click', () => {
        hint.classList.add('onboarding-hiding');
        setTimeout(() => {
            hint.remove();
        }, 300);
        localStorage.setItem('suprompts_onboarding_seen', 'true');
    });
}

function applyMode(mode) {
    if (mode === 'simple') {
        document.body.classList.add('mode-simple');
        document.body.classList.remove('mode-advanced');
    } else {
        document.body.classList.remove('mode-simple');
        document.body.classList.add('mode-advanced');
    }
}

function updateAnalysis() {
    const recommendedSections = getRecommendedSections();
    const result = computeAnalysis(cards, recommendedSections);
    let score = typeof result.score === 'number' ? result.score : 0;
    if (score < 0) {
        score = 0;
    } else if (score > 100) {
        score = 100;
    }
    const recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
    UI.updateAnalysisUI(analysisScoreElement, analysisRecommendationsElement, score, recommendations);
}

function initializeCoreModule() {
    // UI Initialization
    UI.createParagraphCards();
    UI.setupParagraphCardListeners(addCard);
    UI.setupMobileTabs(leftPanelElement, centerPanelElement, rightPanelElement);
    UI.initCopyButton(copyPromptButton, promptOutput, showCopyFeedbackWrapper, triggerActionButtonAnimation);
    UI.initAnalysisToggle(analysisToggleButton, analysisPanel);

    // Logic Initialization
    loadStorage();
    setupModeSelector();
    if (languageSelector) {
        languageSelector.addEventListener('change', () => {
            updatePrompt();
            updateFormatHint();
        });
    }
    initializeFromStorage();
    setupModelSelector();
    setupModelInfoModal();
    setupPromptTypeSelector();
    setupTechniqueSelector();
    setupTechniqueInfoModal();
    updatePrompt();
    updateAnalysis();
    updateQualityIndicator();
    updateFormatHint();
    showOnboardingHint();
}

// Exports
export {
    languageSelector,
    TEMPLATES,
    storageData,
    cards,
    paragraphCards,
    triggerActionButtonAnimation,
    updateCardContent,
    renderCardsWrapper as renderCards,
    updatePrompt,
    generatePromptText,
    comparePromptsByFavoriteAndUpdatedAtDesc,
    showToast,
    showConfirm,
    showInput,
    getBaseNameFromPromptName,
    findNextVariantName,
    ensureUniquePromptName,
    saveStorage,
    initializeCoreModule
};