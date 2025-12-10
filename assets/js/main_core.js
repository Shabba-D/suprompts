// Core module extracted from main_v2.js

import {
    PROMPT_TYPES,
    TEMPLATES,
    PARAGRAPH_SECTIONS
} from './prompt_data.js';

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

function triggerActionButtonAnimation(button) {
    if (!button) {
        return;
    }
    button.classList.remove('action-button-animate');
    void button.offsetWidth;
    button.classList.add('action-button-animate');
}

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

function generatePromptText(cardsToFormat, language) {
    const order = Array.from(paragraphCards).map(card => card.dataset.paragraph);
    const sortedCards = [...cardsToFormat].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
    let promptText = '';
    if (language === 'markdown') {
        sortedCards.forEach(card => {
            if (card.content) {
                promptText += `## ${card.type}\n\n${card.content}\n\n`;
            }
        });
    } else if (language === 'xml') {
        promptText += '<prompt>\n';
        sortedCards.forEach(card => {
            if (card.content) {
                promptText += `    <${card.type.toLowerCase()}>${card.content}</${card.type.toLowerCase()}>\n`;
            }
        });
        promptText += '</prompt>';
    } else if (language === 'json') {
        const obj = {};
        sortedCards.forEach(card => {
            if (card.content && card.content.trim()) {
                obj[card.type.toLowerCase()] = card.content;
            }
        });
        promptText = JSON.stringify(obj, null, 2);
    } else if (language === 'yaml') {
        const lines = [];
        sortedCards.forEach(card => {
            if (card.content && card.content.trim()) {
                const key = card.type.toLowerCase();
                lines.push(key + ': |');
                card.content.split('\n').forEach(line => {
                    lines.push('  ' + line);
                });
            }
        });
        promptText = lines.join('\n');
    }
    return promptText;
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
    try {
        if (!window.localStorage) {
            storageData = {
                lastSession: null,
                prompts: {},
                versions: {}
            };
            return;
        }
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            storageData = {
                lastSession: null,
                prompts: {},
                versions: {}
            };
            return;
        }
        const parsed = JSON.parse(raw);
        storageData = {
            lastSession: parsed && parsed.lastSession ? parsed.lastSession : null,
            prompts: parsed && parsed.prompts && typeof parsed.prompts === 'object' ? parsed.prompts : {},
            versions: parsed && parsed.versions && typeof parsed.versions === 'object' ? parsed.versions : {}
        };
    } catch (e) {
        storageData = {
            lastSession: null,
            prompts: {},
            versions: {}
        };
    }
}

function saveStorage() {
    try {
        if (!window.localStorage) {
            return;
        }
        const data = {
            lastSession: storageData.lastSession,
            prompts: storageData.prompts,
            versions: storageData.versions || {}
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        // ignore storage errors
    }
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
    const result = computeLocalAnalysis();
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

function computeLocalAnalysis() {
    const byType = {};
    cards.forEach(card => {
        byType[card.type] = card;
    });
    let score = 100;
    const recommendations = [];
    const recommended = getRecommendedSections();
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

function getBaseNameFromPromptName(name) {
    if (!name) return '';
    // Supprime les numéros de version entre parenthèses à la fin
    const baseName = name.replace(/\s*\([^)]*\)$/, '').trim();
    // Supprime les suffixes de variante (espace suivi d'un nombre)
    return baseName.replace(/\s+\d+$/, '');
}

function findNextVariantName(baseName) {
    const trimmed = baseName ? baseName.trim() : '';
    if (!trimmed) return '';

    let maxIndex = 1;
    Object.keys(storageData.prompts || {}).forEach(existingName => {
        if (existingName === trimmed) {
            if (maxIndex === 1) {
                maxIndex = 2;
            }
            return;
        }
        if (existingName.indexOf(trimmed + ' ') === 0) {
            const suffix = existingName.substring(trimmed.length + 1);
            const num = parseInt(suffix, 10);
            if (!isNaN(num) && num >= maxIndex) {
                maxIndex = num + 1;
            }
        }
    });

    return trimmed + ' ' + maxIndex;
}

function comparePromptsByFavoriteAndUpdatedAtDesc(a, b) {
    // Les favoris d'abord
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    // Puis par date de modification (les plus récents d'abord)
    const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
    const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
    return dateB - dateA;
}

function ensurePromptName() {
    if (!promptNameInput) return '';

    let name = promptNameInput.value.trim();
    if (!name) {
        // Si le champ est vide, on utilise la date et l'heure
        const now = new Date();
        name = `Prompt ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        promptNameInput.value = name;
    }

    // Si le nom existe déjà, on ajoute un numéro de version
    if (storageData.prompts[name]) {
        const baseName = getBaseNameFromPromptName(name);
        name = findNextVariantName(baseName);
        promptNameInput.value = name;
    }

    return name;
}

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Force reflow for animation
    void toast.offsetWidth;
    toast.classList.add('toast-show');

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function showConfirm(message, onConfirm, options = {}) {
    const modal = document.getElementById('confirm-modal');
    const msgEl = document.getElementById('confirm-modal-message');
    const cancelBtn = document.getElementById('confirm-modal-cancel');
    const okBtn = document.getElementById('confirm-modal-ok');

    if (!modal || !msgEl || !cancelBtn || !okBtn) {
        // Fallback if modal elements missing
        if (window.confirm(message)) {
            onConfirm();
        }
        return;
    }

    msgEl.textContent = message;

    // Optional: customize button style (e.g., danger)
    if (options.isDanger) {
        okBtn.classList.add('modal-btn-danger');
        okBtn.classList.remove('modal-btn-confirm');
    } else {
        okBtn.classList.add('modal-btn-confirm');
        okBtn.classList.remove('modal-btn-danger');
    }

    // Handlers
    const close = () => {
        modal.classList.remove('modal-open');
        cleanup();
    };

    const handleCancel = () => {
        if (options.onCancel && typeof options.onCancel === 'function') {
            options.onCancel();
        }
        close();
    };

    const handleOk = () => {
        onConfirm();
        close();
    };

    const handleKey = (e) => {
        if (e.key === 'Escape') handleCancel();
    };

    const cleanup = () => {
        cancelBtn.removeEventListener('click', handleCancel);
        okBtn.removeEventListener('click', handleOk);
        document.removeEventListener('keydown', handleKey);
    };

    cancelBtn.addEventListener('click', handleCancel);
    okBtn.addEventListener('click', handleOk);
    document.addEventListener('keydown', handleKey);

    modal.classList.add('modal-open');
    okBtn.focus();
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
    saveStorage,
    initializeCoreModule
};