// Core module extracted from main_v2.js

import {
    PROMPT_TYPES,
    TEMPLATES
} from './prompt_data.js';

import {
    triggerActionButtonAnimation,
    generatePromptText,
    comparePromptsByFavoriteAndUpdatedAtDesc,
    showToast,
    showConfirm,
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
import { paragraphCards } from './core_ui.js';

// DOM Elements
const cardsContainer = document.getElementById('cards-container');
const promptOutput = document.getElementById('prompt-output');
const promptTypeSelector = document.getElementById('prompt-type-select');

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
    const promptText = generatePromptText(cards, language);
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
        promptType: currentPromptType,
        cards: cards.map(card => ({
            type: card.type,
            content: card.content || ''
        }))
    };
    saveStorage();
}

function initializeFromStorage() {
    if (storageData.lastSession && Array.isArray(storageData.lastSession.cards)) {
        cards = storageData.lastSession.cards.map(card => ({
            type: card.type,
            content: card.content || ''
        }));
        if (languageSelector && storageData.lastSession.language) {
            languageSelector.value = storageData.lastSession.language;
        }
        if (storageData.lastSession.promptType && PROMPT_TYPES[storageData.lastSession.promptType]) {
            currentPromptType = storageData.lastSession.promptType;
        }
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
    return UI.paragraphCards && UI.paragraphCards.length > 0
        ? Array.from(UI.paragraphCards).map(card => card.dataset.paragraph).filter(Boolean)
        : [];
}

function applyPromptTypeConfig() {
    UI.updateVisibleParagraphCards(getVisibleSections());
    const recommended = getRecommendedSections();
    UI.updateRecommendedSectionBadges(recommended);
    UI.reorderParagraphCards(recommended);
    updateQualityIndicator();
    updateAnalysis();
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
    if (languageSelector) {
        languageSelector.addEventListener('change', () => {
            updatePrompt();
        });
    }
    initializeFromStorage();
    setupPromptTypeSelector();
    updatePrompt();
    updateAnalysis();
    updateQualityIndicator();
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
    getBaseNameFromPromptName,
    findNextVariantName,
    ensureUniquePromptName,
    saveStorage,
    initializeCoreModule
};
