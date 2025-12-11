// Gestion de l'overlay de comparaison A/B

// Éléments DOM
const abOverlay = document.getElementById('ab-overlay');
const abOpenButton = document.getElementById('ab-open-btn');
const abCloseButton = document.getElementById('ab-close-btn');
const abLeftCardsContainer = document.getElementById('ab-left-cards');
const abRightPrompt = document.getElementById('ab-right-prompt');
const abApplyRightToLeftButton = document.getElementById('ab-apply-right-to-left');
const abTemplatesList = document.getElementById('ab-templates-list');
const abNamedPromptsList = document.getElementById('ab-named-prompts-list');
const abVersionsList = document.getElementById('ab-versions-list');

// État de la sélection A/B
let abRightSelection = null;
let abRightCardsSnapshot = null;
let abRightLanguage = null;

// Référence au module core (sera initialisé par initABModule)
let coreModule = null;

function initABModule(core) {
    coreModule = core;

    // Initialiser les écouteurs d'événements
    setupABEventListeners();
}

function setupABEventListeners() {
    // Ouvrir l'overlay A/B
    if (abOpenButton && abOverlay) {
        abOpenButton.addEventListener('click', () => {
            openABOverlay();
            coreModule.triggerActionButtonAnimation(abOpenButton);
        });
    }

    // Fermer l'overlay A/B
    if (abCloseButton && abOverlay) {
        abCloseButton.addEventListener('click', closeABOverlay);
    }

    // Appliquer la version de droite à gauche
    if (abApplyRightToLeftButton) {
        abApplyRightToLeftButton.addEventListener('click', applyRightPromptToLeft);
    }
}

// --- Fonctions principales de l'overlay A/B ---

function openABOverlay() {
    if (!abOverlay) {
        return;
    }

    abOverlay.classList.remove('ab-overlay-hidden');
    renderABLeftFromCards();
    clearABRightSelection();
    populateABLists();
}

function closeABOverlay() {
    if (!abOverlay) {
        return;
    }
    abOverlay.classList.add('ab-overlay-hidden');
    coreModule.renderCards();
    coreModule.updatePrompt();
}

function renderABLeftFromCards() {
    if (!abLeftCardsContainer) {
        return;
    }

    abLeftCardsContainer.innerHTML = '';

    // Fix: Access paragraphCards from exported object or use a getter if possible.
    // Since paragraphCards is a NodeList and we might not have direct access if it's not exported directly as a live binding,
    // we should rely on coreModule to provide the order or list.
    // However, looking at main_core.js, paragraphCards IS exported.

    // Safety check in case paragraphCards is empty or undefined
    const pCards = coreModule.paragraphCards || [];
    const order = Array.from(pCards).map(card => card.dataset.paragraph);
    const sortedCards = [...coreModule.cards].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

    sortedCards.forEach(card => {
        const wrapper = document.createElement('div');
        wrapper.className = 'ab-left-card';

        const title = document.createElement('h4');
        title.textContent = card.type;
        wrapper.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.value = card.content || '';
        textarea.addEventListener('input', () => {
            coreModule.updateCardContent(card, textarea.value);
            coreModule.renderCards();
        });

        wrapper.appendChild(textarea);
        abLeftCardsContainer.appendChild(wrapper);
    });
}

function clearABRightSelection() {
    abRightSelection = null;
    abRightCardsSnapshot = null;
    abRightLanguage = null;

    if (abRightPrompt) {
        abRightPrompt.textContent = '';
    }

    if (!abOverlay) {
        return;
    }

    const allChoices = abOverlay.querySelectorAll('.ab-choice');
    allChoices.forEach(input => {
        input.checked = false;
    });
}

function populateABLists() {
    populateABTemplatesList();
    populateABNamedPromptsList();
    populateABVersionsList();
}

function populateABTemplatesList() {
    if (!abTemplatesList) {
        return;
    }

    abTemplatesList.innerHTML = '';

    Object.keys(coreModule.TEMPLATES).forEach(id => {
        const template = coreModule.TEMPLATES[id];
        if (!template) {
            return;
        }

        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'ab-choice';
        input.dataset.source = 'template';
        input.dataset.id = id;
        input.addEventListener('change', handleABChoiceChange);

        const span = document.createElement('span');
        span.textContent = template.displayName || id;

        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        abTemplatesList.appendChild(li);
    });
}

function populateABNamedPromptsList() {
    if (!abNamedPromptsList) {
        return;
    }

    abNamedPromptsList.innerHTML = '';

    const entries = Object.keys(coreModule.storageData.prompts || {}).map(name => coreModule.storageData.prompts[name]);
    entries.sort(coreModule.comparePromptsByFavoriteAndUpdatedAtDesc);

    entries.forEach(entry => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'ab-choice';
        input.dataset.source = 'named';
        input.dataset.id = entry.name;
        input.addEventListener('change', handleABChoiceChange);

        const span = document.createElement('span');
        const star = entry.isFavorite ? '★ ' : '';
        const dateLabel = entry.updatedAt ? ' (' + formatDateLabel(entry.updatedAt) + ')' : '';
        span.textContent = star + (entry.name || 'Sans titre') + dateLabel;

        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        abNamedPromptsList.appendChild(li);
    });
}

function populateABVersionsList() {
    if (!abVersionsList) {
        return;
    }

    abVersionsList.innerHTML = '';

    const key = '(current)';
    const list = coreModule.storageData.versions && coreModule.storageData.versions[key] ? [...coreModule.storageData.versions[key]] : [];
    sortVersionsByCreatedAtDesc(list);

    list.forEach(version => {
        const li = document.createElement('li');
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'ab-choice';
        input.dataset.source = 'version';
        input.dataset.id = version.id;
        input.addEventListener('change', handleABChoiceChange);

        const span = document.createElement('span');
        const labelDate = version.createdAt ? formatDateLabel(version.createdAt) : version.id;
        span.textContent = labelDate;

        label.appendChild(input);
        label.appendChild(span);
        li.appendChild(label);
        abVersionsList.appendChild(li);
    });
}

function handleABChoiceChange(event) {
    const target = event.target;
    if (!target || !target.classList.contains('ab-choice')) {
        return;
    }

    if (!target.checked) {
        if (!abOverlay) {
            return;
        }
        const anyChecked = abOverlay.querySelector('.ab-choice:checked');
        if (!anyChecked) {
            clearABRightSelection();
        }
        return;
    }

    if (!abOverlay) {
        return;
    }

    const allChoices = abOverlay.querySelectorAll('.ab-choice');
    allChoices.forEach(input => {
        if (input !== target) {
            input.checked = false;
        }
    });

    const source = target.dataset.source;
    const id = target.dataset.id;
    let cardsSource = null;
    let language = 'markdown';

    if (source === 'template') {
        const template = coreModule.TEMPLATES[id];
        if (!template) {
            clearABRightSelection();
            return;
        }
        cardsSource = template.sections.map(type => {
            const presets = template.presets || {};
            const content = typeof presets[type] === 'string' ? presets[type] : '';
            return {
                type: type,
                content: content
            };
        });
        language = coreModule.languageSelector && coreModule.languageSelector.value ?
            coreModule.languageSelector.value :
            'markdown';
    } else if (source === 'named') {
        const data = coreModule.storageData.prompts[id];
        if (!data) {
            clearABRightSelection();
            return;
        }
        cardsSource = Array.isArray(data.cards) ?
            data.cards.map(card => ({
                type: card.type,
                content: card.content || ''
            })) : [];
        language = data.language ||
            (coreModule.languageSelector && coreModule.languageSelector.value ?
                coreModule.languageSelector.value :
                'markdown');
    } else if (source === 'version') {
        const key = '(current)';
        const list = coreModule.storageData.versions && coreModule.storageData.versions[key] ?
            coreModule.storageData.versions[key] : [];
        const version = list.find(v => v.id === id);
        if (!version) {
            clearABRightSelection();
            return;
        }
        cardsSource = Array.isArray(version.cards) ?
            version.cards.map(card => ({
                type: card.type,
                content: card.content || ''
            })) : [];
        language = version.language ||
            (coreModule.languageSelector && coreModule.languageSelector.value ?
                coreModule.languageSelector.value :
                'markdown');
    } else {
        clearABRightSelection();
        return;
    }

    abRightSelection = {
        source: source,
        id: id
    };
    abRightCardsSnapshot = cardsSource;
    abRightLanguage = language;
    renderABRightPrompt();
}

function renderABRightPrompt() {
    if (!abRightPrompt || !abRightCardsSnapshot) {
        return;
    }

    // Créer un conteneur pour le prompt formaté
    const container = document.createElement('div');
    container.className = 'ab-right-prompt-content';

    // Formater le prompt en fonction du langage sélectionné
    const effectiveLanguage = abRightLanguage ||
        (coreModule.languageSelector && coreModule.languageSelector.value) ||
        'markdown';

    const formattedPrompt = coreModule.generatePromptText(abRightCardsSnapshot, effectiveLanguage);
    container.textContent = formattedPrompt;

    // Mettre à jour l'affichage
    abRightPrompt.innerHTML = '';
    abRightPrompt.appendChild(container);
}

function applyRightPromptToLeft() {
    if (!abRightCardsSnapshot || !Array.isArray(abRightCardsSnapshot)) {
        return;
    }

    // Mettre à jour les cartes avec la sélection
    const newCards = abRightCardsSnapshot.map(card => ({
        type: card.type,
        content: card.content || '',
        id: card.id || Date.now()
    }));

    coreModule.cards.length = 0;
    newCards.forEach(card => coreModule.cards.push(card));

    // Mettre à jour le sélecteur de langue si nécessaire
    if (coreModule.languageSelector && abRightLanguage) {
        coreModule.languageSelector.value = abRightLanguage;
    }

    // Mettre à jour l'interface
    coreModule.renderCards();
    coreModule.updatePrompt();
    renderABLeftFromCards();

    // Donner le focus au premier champ de texte
    const firstTextarea = document.querySelector('.paragraph-card textarea');
    if (firstTextarea) {
        firstTextarea.focus();
    }
}

// --- Fonctions utilitaires ---

function sortVersionsByCreatedAtDesc(versions) {
    if (!Array.isArray(versions)) {
        return [];
    }
    return versions.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
    });
}

function formatDateLabel(dateString) {
    if (!dateString) {
        return '';
    }

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Erreur de formatage de date :', e);
        return dateString;
    }
}

// Exporter les fonctions nécessaires
export {
    initABModule,
    openABOverlay,
    closeABOverlay,
    applyRightPromptToLeft
};