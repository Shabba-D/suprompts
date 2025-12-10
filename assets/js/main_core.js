// Core module extracted from main_v2.js

import {
    PROMPT_TYPES,
    TEMPLATES,
    PARAGRAPH_SECTIONS
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

let paragraphCards = document.querySelectorAll('.paragraph-card');

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

const mobileTabButtons = document.querySelectorAll('.mobile-tab-button');
const leftPanelElement = document.querySelector('.left-panel');
const centerPanelElement = document.querySelector('.center-panel');
const rightPanelElement = document.querySelector('.right-panel');

if (advancedToolsHeader && advancedToolsWrapper) {
    advancedToolsHeader.addEventListener('click', () => {
        const isOpen = advancedToolsWrapper.classList.toggle('advanced-tools-open');
        advancedToolsHeader.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
}

function createParagraphCards() {
    const container = document.querySelector('.paragraph-cards');
    if (!container) {
        return;
    }
    container.innerHTML = '';
    PARAGRAPH_SECTIONS.forEach(section => {
        const card = document.createElement('div');
        card.className = 'paragraph-card';
        card.dataset.paragraph = section.id;
        if (section.tooltip) {
            card.title = section.tooltip;
        }

        const titleElement = document.createElement('h3');
        titleElement.textContent = section.label;
        card.appendChild(titleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = section.description;
        card.appendChild(descriptionElement);

        container.appendChild(card);
    });

    paragraphCards = document.querySelectorAll('.paragraph-card');
}

createParagraphCards();

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

const STORAGE_KEY = 'suprompts_storage_v1';

let currentPromptType = 'general';

let storageData = {

    lastSession: null,
    prompts: {},
    versions: {}
};

let cards = [];

function showCopyFeedback(message, isError) {
    if (!copyFeedback) {
        return;
    }
    copyFeedback.textContent = message;
    copyFeedback.style.color = isError ? '#e74c3c' : '';
    clearTimeout(showCopyFeedback._timeoutId);
    showCopyFeedback._timeoutId = setTimeout(() => {
        copyFeedback.textContent = '';
    }, 2000);
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
    renderCards();
    updatePrompt();
}

function removeCard(target) {
    cards = cards.filter(card => card !== target);
    renderCards();
    updatePrompt();
}

function updateCardContent(target, content) {
    if (!target) {
        return;
    }
    target.content = content;
    updatePrompt();
}

function renderCards() {
    const order = Array.from(paragraphCards).map(card => card.dataset.paragraph);
    cards.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
    if (!cardsContainer) {
        return;
    }
    cardsContainer.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const titleElement = document.createElement('h3');
        titleElement.textContent = card.type;
        cardElement.appendChild(titleElement);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Saisis le contenu pour ' + card.type + '...';
        textarea.value = card.content || '';
        cardElement.appendChild(textarea);

        const footer = document.createElement('div');
        footer.className = 'card-footer';

        const charCount = document.createElement('span');
        charCount.className = 'char-count';

        const buttonsWrapper = document.createElement('div');

        const clearButton = document.createElement('button');
        clearButton.className = 'clear-btn';
        clearButton.textContent = 'Vider';

        const removeButton = document.createElement('button');
        removeButton.className = 'remove-btn';
        removeButton.textContent = 'Supprimer la carte';

        buttonsWrapper.appendChild(clearButton);
        buttonsWrapper.appendChild(removeButton);

        footer.appendChild(charCount);
        footer.appendChild(buttonsWrapper);

        cardElement.appendChild(footer);
        cardsContainer.appendChild(cardElement);

        const updateCharCount = () => {
            charCount.textContent = `${textarea.value.length} caractères`;
        };

        updateCharCount();

        textarea.addEventListener('input', () => {
            updateCardContent(card, textarea.value);
            updateCharCount();
        });

        clearButton.addEventListener('click', () => {
            textarea.value = '';
            updateCardContent(card, '');
            updateCharCount();
        });

        removeButton.addEventListener('click', () => {
            removeCard(card);
        });
    });
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
        renderCards();
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
    renderCards();
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
    if (!paragraphCards || paragraphCards.length === 0) {
        return [];
    }
    return Array.from(paragraphCards)
        .map(card => card.dataset.paragraph)
        .filter(Boolean);
}

function updateVisibleParagraphCards() {
    if (!paragraphCards || paragraphCards.length === 0) {
        return;
    }
    const visible = getVisibleSections();
    paragraphCards.forEach(card => {
        const type = card.dataset.paragraph;
        if (!type) {
            return;
        }
        if (visible.includes(type)) {
            card.classList.remove('paragraph-card-hidden');
        } else {
            card.classList.add('paragraph-card-hidden');
        }
    });
}

function updateRecommendedSectionBadges() {
    if (!paragraphCards || paragraphCards.length === 0) {
        return;
    }
    const recommended = getRecommendedSections();
    paragraphCards.forEach(card => {
        card.classList.remove('paragraph-card-recommended');
    });
    recommended.forEach(type => {
        paragraphCards.forEach(card => {
            if (card.dataset.paragraph === type) {
                card.classList.add('paragraph-card-recommended');
            }
        });
    });
}

function applyPromptTypeConfig() {
    updateVisibleParagraphCards();
    updateRecommendedSectionBadges();
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
    if (!completionIndicator) {
        return;
    }
    const byType = {};
    cards.forEach(card => {
        byType[card.type] = card;
    });
    const recommended = getRecommendedSections();
    if (recommended.length === 0) {
        completionIndicator.textContent = '';
        return;
    }
    let filled = 0;
    recommended.forEach(type => {
        const card = byType[type];
        if (card && card.content && card.content.trim()) {
            filled += 1;
        }
    });
    completionIndicator.textContent = 'Complétude : ' + filled + '/' + recommended.length + ' sections recommandées remplies.';
}

function updateAnalysis() {
    if (!analysisScoreElement || !analysisRecommendationsElement) {
        return;
    }
    const recommendedSections = getRecommendedSections();
    const result = computeAnalysis(cards, recommendedSections);
    let score = typeof result.score === 'number' ? result.score : 0;
    if (score < 0) {
        score = 0;
    } else if (score > 100) {
        score = 100;
    }
    analysisScoreElement.textContent = 'Score : ' + score + '/100';
    analysisRecommendationsElement.innerHTML = '';
    const recommendations = Array.isArray(result.recommendations) ? result.recommendations : [];
    if (recommendations.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Le prompt semble bien structuré. Tu peux l’utiliser tel quel ou affiner des détails de style.';
        analysisRecommendationsElement.appendChild(li);
        return;
    }
    recommendations.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        analysisRecommendationsElement.appendChild(li);
    });
}

// Kept for backward compatibility if any external code calls it directly, though internal calls use the imported one.
// Actually, `computeLocalAnalysis` was exported.
// We can re-export a wrapper or just remove it if we are sure nobody calls it.
// The audit said it's local analysis.
// I'll make a wrapper to be safe as I see `computeLocalAnalysis` in the original exports.
function computeLocalAnalysis() {
    const recommendedSections = getRecommendedSections();
    return computeAnalysis(cards, recommendedSections);
}

function setupParagraphCardListeners() {
    if (!paragraphCards || paragraphCards.length === 0) {
        return;
    }
    paragraphCards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.paragraph;
            if (!type) {
                return;
            }
            addCard(type);
        });
    });
}

function setupMobileTabs() {
    if (!mobileTabButtons || mobileTabButtons.length === 0) {
        return;
    }
    mobileTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            if (!target) {
                return;
            }
            document.querySelectorAll('.panel-active').forEach(panel => {
                panel.classList.remove('panel-active');
            });
            if (target === 'sections' && leftPanelElement) {
                leftPanelElement.classList.add('panel-active');
            } else if (target === 'editor' && centerPanelElement) {
                centerPanelElement.classList.add('panel-active');
            } else if (target === 'prompt' && rightPanelElement) {
                rightPanelElement.classList.add('panel-active');
            }
        });
    });
}

function initCopyButton() {
    if (!copyPromptButton) {
        return;
    }
    copyPromptButton.addEventListener('click', async () => {
        if (!promptOutput || !navigator.clipboard) {
            showCopyFeedback('Copie non disponible.', true);
            return;
        }
        try {
            await navigator.clipboard.writeText(promptOutput.textContent || '');
            showCopyFeedback('Prompt copié !');
            triggerActionButtonAnimation(copyPromptButton);
        } catch (e) {
            showCopyFeedback('Impossible de copier.', true);
        }
    });
}

function initLanguageSelector() {
    if (!languageSelector) {
        return;
    }
    languageSelector.addEventListener('change', () => {
        updatePrompt();
    });
}

function initAnalysisToggle() {
    if (!analysisToggleButton || !analysisPanel) {
        return;
    }
    analysisToggleButton.addEventListener('click', () => {
        const collapsed = analysisPanel.classList.toggle('analysis-collapsed');
        analysisToggleButton.textContent = collapsed ? 'Afficher les conseils' : 'Masquer les conseils';
        analysisToggleButton.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
}

function initializeCoreModule() {
    loadStorage();
    initializeFromStorage();
    setupParagraphCardListeners();
    setupMobileTabs();
    initCopyButton();
    initLanguageSelector();
    initAnalysisToggle();
    setupPromptTypeSelector();
    updatePrompt();
    updateAnalysis();
    updateQualityIndicator();
}

export {
    paragraphCards,
    languageSelector,
    TEMPLATES,
    storageData,
    cards,
    triggerActionButtonAnimation,
    updateCardContent,
    renderCards,
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
