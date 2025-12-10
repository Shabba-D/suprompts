import {
    PARAGRAPH_SECTIONS
} from './prompt_data.js';

/**
 * Triggers a simple animation on an action button.
 * @param {HTMLElement} button - The button element to animate.
 */
function triggerActionButtonAnimation(button) {
    if (!button) {
        return;
    }
    button.classList.remove('action-button-animate');
    void button.offsetWidth; // Force reflow
    button.classList.add('action-button-animate');
}

/**
 * Generates the prompt text based on the cards and selected language.
 * @param {Array} cardsToFormat - The list of cards to format.
 * @param {string} language - The target language (markdown, xml, json, yaml).
 * @returns {string} The generated prompt text.
 */
function generatePromptText(cardsToFormat, language) {
    const order = PARAGRAPH_SECTIONS.map(section => section.id);
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

/**
 * Compares two prompts for sorting: favorites first, then by updated date descending.
 * @param {Object} a - First prompt data.
 * @param {Object} b - Second prompt data.
 * @returns {number} Sort order.
 */
function comparePromptsByFavoriteAndUpdatedAtDesc(a, b) {
    // Les favoris d'abord
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;

    // Puis par date de modification (les plus récents d'abord)
    const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
    const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
    return dateB - dateA;
}

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 * @param {string} type - The type of toast (info, success, error).
 */
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

/**
 * Shows a confirmation modal.
 * @param {string} message - The confirmation message.
 * @param {Function} onConfirm - The callback function to execute on confirmation.
 * @param {Object} options - Additional options (isDanger, onCancel).
 */
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

/**
 * Gets the base name from a prompt name (removes version suffixes like " (2)" or " 3").
 * @param {string} name - The prompt name.
 * @returns {string} The base name.
 */
function getBaseNameFromPromptName(name) {
    if (!name) return '';
    // Supprime les numéros de version entre parenthèses à la fin
    const baseName = name.replace(/\s*\([^)]*\)$/, '').trim();
    // Supprime les suffixes de variante (espace suivi d'un nombre)
    return baseName.replace(/\s+\d+$/, '');
}

/**
 * Finds the next available variant name for a given base name.
 * @param {string} baseName - The base name.
 * @param {Object} existingPrompts - The object containing existing prompts keys.
 * @returns {string} The next variant name (e.g. "Name 2").
 */
function findNextVariantName(baseName, existingPrompts) {
    const trimmed = baseName ? baseName.trim() : '';
    if (!trimmed) return '';

    let maxIndex = 1;
    Object.keys(existingPrompts || {}).forEach(existingName => {
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

/**
 * Ensures a prompt name is unique, generating a default if empty.
 * @param {string} currentName - The current name input.
 * @param {Object} existingPrompts - The map of existing prompts.
 * @returns {string} A unique prompt name.
 */
function ensureUniquePromptName(currentName, existingPrompts) {
    let name = currentName ? currentName.trim() : '';
    if (!name) {
        const now = new Date();
        name = `Prompt ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }

    if (existingPrompts && existingPrompts[name]) {
        const baseName = getBaseNameFromPromptName(name);
        name = findNextVariantName(baseName, existingPrompts);
    }
    return name;
}

export {
    triggerActionButtonAnimation,
    generatePromptText,
    comparePromptsByFavoriteAndUpdatedAtDesc,
    showToast,
    showConfirm,
    getBaseNameFromPromptName,
    findNextVariantName,
    ensureUniquePromptName
};
