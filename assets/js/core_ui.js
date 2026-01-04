// UI management module
import {
    PROMPT_SECTIONS
} from './core_i18n.js';

// import {
//     triggerActionButtonAnimation
// } from './core_utils.js';

let paragraphCards = document.querySelectorAll('.paragraph-card');

export function createParagraphCards() {
    const container = document.querySelector('.paragraph-cards');
    if (!container) {
        return;
    }
    container.innerHTML = '';
    for (const [key, section] of Object.entries(PROMPT_SECTIONS)) {
        const card = document.createElement('div');
        card.className = 'paragraph-card';
        card.dataset.paragraph = key; // Use the key (e.g., 'persona') as the identifier
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
    }

    paragraphCards = document.querySelectorAll('.paragraph-card');
}

export function setupParagraphCardListeners(addCardCallback) {
    if (!paragraphCards || paragraphCards.length === 0) {
        return;
    }
    paragraphCards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.dataset.paragraph;
            if (!type) {
                return;
            }
            if (typeof addCardCallback === 'function') {
                addCardCallback(type);
            }
        });
    });
}

export function setupMobileTabs(leftPanelElement, centerPanelElement, rightPanelElement) {
    const mobileTabButtons = document.querySelectorAll('.mobile-tab-button');
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

export function initCopyButton(copyPromptButton, promptOutput, showCopyFeedback, animationCallback) {
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
            if (typeof animationCallback === 'function') {
                animationCallback(copyPromptButton);
            }
        } catch (e) {
            showCopyFeedback('Impossible de copier.', true);
        }
    });
}

export function initAnalysisToggle(analysisToggleButton, analysisPanel) {
    if (!analysisToggleButton || !analysisPanel) {
        return;
    }

    // Synchronize button text with initial panel state
    const isCollapsed = analysisPanel.classList.contains('analysis-collapsed');
    analysisToggleButton.textContent = isCollapsed ? 'Afficher les conseils' : 'Masquer les conseils';
    analysisToggleButton.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');

    analysisToggleButton.addEventListener('click', () => {
        const collapsed = analysisPanel.classList.toggle('analysis-collapsed');
        analysisToggleButton.textContent = collapsed ? 'Afficher les conseils' : 'Masquer les conseils';
        analysisToggleButton.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });
}

export function renderCards(cardsContainer, cards, updateCardContentCallback, removeCardCallback) {
    const order = Array.from(paragraphCards).map(card => card.dataset.paragraph);
    cards.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
    if (!cardsContainer) {
        return;
    }
    cardsContainer.innerHTML = '';
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const sectionInfo = PROMPT_SECTIONS[card.type] || {
            label: card.type
        }; // Fallback for safety

        const titleElement = document.createElement('h3');
        titleElement.textContent = sectionInfo.label;
        cardElement.appendChild(titleElement);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Saisis le contenu pour ' + sectionInfo.label + '...';
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
            updateCardContentCallback(card, textarea.value);
            updateCharCount();
        });

        clearButton.addEventListener('click', () => {
            textarea.value = '';
            updateCardContentCallback(card, '');
            updateCharCount();
        });

        removeButton.addEventListener('click', () => {
            removeCardCallback(card);
        });
    });
}

export function updateVisibleParagraphCards(visibleSections) {
    if (!paragraphCards || paragraphCards.length === 0) {
        return;
    }
    paragraphCards.forEach(card => {
        const type = card.dataset.paragraph;
        if (!type) {
            return;
        }
        if (visibleSections.includes(type)) {
            card.classList.remove('paragraph-card-hidden');
        } else {
            card.classList.add('paragraph-card-hidden');
        }
    });
}

export function updateRecommendedSectionBadges(recommendedSections) {
    if (!paragraphCards || paragraphCards.length === 0) {
        return;
    }
    paragraphCards.forEach(card => {
        card.classList.remove('paragraph-card-recommended');
    });
    recommendedSections.forEach(type => {
        paragraphCards.forEach(card => {
            if (card.dataset.paragraph === type) {
                card.classList.add('paragraph-card-recommended');
            }
        });
    });
}

export function showCopyFeedback(copyFeedback, message, isError) {
    if (!copyFeedback) {
        return;
    }
    copyFeedback.textContent = message;
    if (isError) {
        copyFeedback.classList.add('error-text');
    } else {
        copyFeedback.classList.remove('error-text');
    }
    // Note: timeout handling is better done in a wrapper or state manager if possible,
    // but here we can just set it. To manage clearing previous timeouts,
    // the caller might need to handle the state.
    // For simplicity, we assume one toast at a time or the caller handles the timeout ID.
}

export function updateAnalysisUI(scoreElement, recommendationsElement, score, recommendations) {
    if (!scoreElement || !recommendationsElement) {
        return;
    }

    scoreElement.textContent = 'Score : ' + score + '/100';
    recommendationsElement.innerHTML = '';

    if (recommendations.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Le prompt semble bien structuré. Tu peux l’utiliser tel quel ou affiner des détails de style.';
        recommendationsElement.appendChild(li);
        return;
    }
    recommendations.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        recommendationsElement.appendChild(li);
    });
}

export function updateCompletionIndicator(indicatorElement, filledCount, totalCount) {
    if (!indicatorElement) {
        return;
    }
    if (totalCount === 0) {
        indicatorElement.textContent = '';
        return;
    }
    indicatorElement.textContent = 'Complétude : ' + filledCount + '/' + totalCount + ' sections recommandées remplies.';
}

export function reorderParagraphCards(recommendedSections) {
    const container = document.querySelector('.paragraph-cards');
    if (!container) {
        return;
    }

    // Get current cards (preserving existing DOM elements to keep event listeners)
    const cardsArray = Array.from(document.querySelectorAll('.paragraph-card'));

    // Sort logic: recommended first, maintaining original relative order within groups
    const recommended = [];
    const others = [];

    cardsArray.forEach(card => {
        const type = card.dataset.paragraph;
        if (recommendedSections.includes(type)) {
            recommended.push(card);
        } else {
            others.push(card);
        }
    });

    // Re-append elements in the new order
    [...recommended, ...others].forEach(card => {
        container.appendChild(card);
    });

    // Update the internal reference
    paragraphCards = document.querySelectorAll('.paragraph-card');
}

export {
    paragraphCards
};