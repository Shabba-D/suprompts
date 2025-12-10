// Gestion des prompts nommés, versions, favoris et import/export

// Éléments DOM
const promptNameInput = document.getElementById('prompt-name-input');
const savePromptButton = document.getElementById('save-prompt-btn');
const saveVersionButton = document.getElementById('save-version-btn');
const loadPromptButton = document.getElementById('load-prompt-btn');
const savedPromptsSelect = document.getElementById('saved-prompts-select');
const deletePromptButton = document.getElementById('delete-prompt-btn');
const favoritePromptButton = document.getElementById('favorite-prompt-btn');
const exportPromptButton = document.getElementById('export-prompt-btn');
const importPromptInput = document.getElementById('import-prompt-input');
const importPromptButton = document.getElementById('import-prompt-btn');

// Référence au module core (sera initialisé par initPromptsModule)
let coreModule = null;

// Suivi du prompt courant et de la proposition de renommage
let currentPromptName = '';
let renameSuggestionContainer = null;
let renameSuggestionTextElement = null;
let renameSuggestionButton = null;
let renameSuggestionTimeoutId = null;
let promptNameDatalist = null;

function initPromptsModule(core) {
    coreModule = core;

    // Initialiser les écouteurs d'événements
    setupPromptEventListeners();

    // Charger les prompts sauvegardés dans le select
    updateSavedPromptsSelect();
}

function setupPromptEventListeners() {
    // Sauvegarder le prompt actuel
    if (savePromptButton) {
        savePromptButton.addEventListener('click', handleSavePrompt);
    }

    // Sauvegarder une nouvelle version
    if (saveVersionButton) {
        saveVersionButton.addEventListener('click', handleSaveVersion);
    }

    // Charger un prompt sauvegardé
    if (loadPromptButton && savedPromptsSelect) {
        loadPromptButton.addEventListener('click', handleLoadPrompt);
    }

    // Supprimer un prompt
    if (deletePromptButton) {
        deletePromptButton.addEventListener('click', handleDeletePrompt);
    }

    // Basculer le statut favori
    if (favoritePromptButton) {
        favoritePromptButton.addEventListener('click', handleToggleFavorite);
    }

    // Exporter le prompt actuel
    if (exportPromptButton) {
        exportPromptButton.addEventListener('click', handleExportPrompt);
    }

    // Importer un prompt
    if (importPromptButton && importPromptInput) {
        importPromptButton.addEventListener('click', () => importPromptInput.click());
        importPromptInput.addEventListener('change', handleImportPrompt);
    }

    // Saisie et sélection du nom de prompt
    if (promptNameInput) {
        promptNameInput.addEventListener('focus', (event) => {
            const input = event.target;
            if (input && typeof input.select === 'function') {
                input.select();
            }
        });

        promptNameInput.addEventListener('change', () => {
            const name = promptNameInput.value.trim();
            const prompts = (coreModule && coreModule.storageData && coreModule.storageData.prompts) || {};
            if (prompts[name]) {
                loadNamedPrompt(name);

                if (savedPromptsSelect) {
                    const option = Array.from(savedPromptsSelect.options)
                        .find(opt => opt.value === `prompt|${name}`);
                    if (option) {
                        savedPromptsSelect.value = option.value;
                    }
                }
            }
        });

        promptNameInput.addEventListener('input', handlePromptNameInputChange);
    }
}

// --- Fonctions de gestion des prompts ---

function parseSavedSelectionValue(value) {
    if (!value || typeof value !== 'string') {
        return null;
    }

    const parts = value.split('|');
    if (parts.length !== 2) {
        return null;
    }

    return {
        type: parts[0],
        name: parts[1]
    };
}

function loadNamedPrompt(name) {
    const data = coreModule.storageData.prompts[name];

    if (!data) {
        return;
    }

    // Mettre à jour le nom du prompt
    if (promptNameInput) {
        promptNameInput.value = name;
    }

    currentPromptName = name;
    clearRenameSuggestion();

    // Mettre à jour les cartes avec les données chargées
    if (data.cards && Array.isArray(data.cards)) {
        const newCards = data.cards.map(card => ({
            type: card.type,
            content: card.content || '',
            id: card.id || Date.now()
        }));

        coreModule.cards.length = 0;
        newCards.forEach(card => coreModule.cards.push(card));

        // Mettre à jour l'affichage
        coreModule.renderCards();
        coreModule.updatePrompt();
    }

    // Mettre à jour l'interface utilisateur
    updateFavoriteButton(name);
    updateSavedPromptsSelect();
}

function savePromptDataUnderName(name) {
    if (!name) {
        return null;
    }

    const promptData = {
        name: name,
        cards: coreModule.cards.map(card => ({
            type: card.type,
            content: card.content || '',
            id: card.id || Date.now()
        })),
        updatedAt: new Date().toISOString(),
        isFavorite: (coreModule.storageData.prompts[name] && coreModule.storageData.prompts[name].isFavorite) || false
    };

    // Sauvegarder dans le stockage local
    coreModule.storageData.prompts[name] = promptData;
    coreModule.saveStorage();

    // Mettre à jour l'interface utilisateur
    updateSavedPromptsSelect();
    updateFavoriteButton(name);

    currentPromptName = name;
    clearRenameSuggestion();

    return promptData;
}

// --- Gestion des favoris ---

function updateFavoriteButton(promptName) {
    if (!favoritePromptButton) {
        return;
    }

    const isFavorite = coreModule.storageData.prompts[promptName] && coreModule.storageData.prompts[promptName].isFavorite;
    favoritePromptButton.textContent = isFavorite ? '★' : '☆';
    favoritePromptButton.title = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
    favoritePromptButton.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
}

function toggleFavoriteByName(name) {
    if (!name || !coreModule.storageData.prompts[name]) {
        return;
    }

    // Basculer le statut favori
    coreModule.storageData.prompts[name].isFavorite = !coreModule.storageData.prompts[name].isFavorite;
    coreModule.saveStorage();

    // Mettre à jour l'interface utilisateur
    updateFavoriteButton(name);
    updateSavedPromptsSelect();
}

// --- Gestion de l'import/export ---

function exportPrompt() {
    if (!coreModule.cards || coreModule.cards.length === 0) {
        alert('Aucun prompt à exporter.');
        return;
    }

    const promptName = prompt('Nom du fichier (sans extension) :', 'mon_prompt');
    if (!promptName) {
        return;
    }

    const data = {
        name: promptName,
        version: '1.0',
        cards: coreModule.cards,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${promptName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importPromptFromFile(file) {
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            importPromptFromData(data, file.name);
        } catch (error) {
            console.error('Erreur lors de l\'import du fichier :', error);
            alert('Impossible d\'importer le fichier. Format invalide.');
        }
    };
    reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier.');
    };
    reader.readAsText(file);
}

function importPromptFromData(data, fileName) {
    if (!data || typeof data !== 'object') {
        return;
    }

    // Vérifier la structure des données
    if (!Array.isArray(data.cards) || data.cards.length === 0) {
        alert('Le fichier ne contient pas de données de prompt valides.');
        return;
    }

    // Extraire le nom du prompt à partir du nom de fichier si non fourni
    let promptName = data.name || 'imported_prompt';
    if (fileName) {
        const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
        if (nameWithoutExt) {
            promptName = nameWithoutExt;
        }
    }

    // Demander confirmation avant d'importer
    if (!confirm(`Importer le prompt "${promptName}" avec ${data.cards.length} sections ?`)) {
        return;
    }

    // Mettre à jour les cartes avec les données importées
    const newCards = data.cards.map(card => ({
        type: card.type,
        content: card.content || '',
        id: card.id || Date.now()
    }));

    coreModule.cards.length = 0;
    newCards.forEach(card => coreModule.cards.push(card));

    // Mettre à jour l'interface utilisateur
    if (promptNameInput) {
        promptNameInput.value = promptName;
    }

    coreModule.renderCards();
    coreModule.updatePrompt();

    // Sauvegarder le prompt importé
    savePromptDataUnderName(promptName);

    alert(`Prompt "${promptName}" importé avec succès !`);
}

// --- Gestion de l'interface utilisateur ---

function getTemplateDisplayName(templateId) {
    let displayName = templateId;

    if (coreModule && coreModule.templateSelector) {
        const option = coreModule.templateSelector.querySelector('option[value="' + templateId + '"]');
        if (option && option.textContent) {
            displayName = option.textContent;
        }
    }

    // Normaliser les espaces internes et couper les retours à la ligne
    return displayName.replace(/\s+/g, ' ').trim();
}

function loadTemplateAsNewPrompt(templateId) {
    if (!coreModule || !coreModule.TEMPLATES) {
        return;
    }

    const template = coreModule.TEMPLATES[templateId];
    if (!template) {
        return;
    }

    const baseName = getTemplateDisplayName(templateId) || templateId;

    // Générer un nom unique à partir du nom de base
    let name = baseName;
    let maxIndex = 1;

    Object.keys(coreModule.storageData.prompts || {}).forEach(existingName => {
        if (existingName === baseName) {
            if (maxIndex === 1) {
                maxIndex = 2;
            }
            return;
        }
        if (existingName.indexOf(baseName + ' ') === 0) {
            const suffix = existingName.substring(baseName.length + 1);
            const num = parseInt(suffix, 10);
            if (!isNaN(num) && num >= maxIndex) {
                maxIndex = num + 1;
            }
        }
    });

    if (maxIndex > 1) {
        name = baseName + ' ' + maxIndex;
    }

    if (promptNameInput) {
        promptNameInput.value = name;
    }

    // Construire les cartes à partir du template
    const newCards = template.sections.map(type => {
        const presets = template.presets || {};
        const content = typeof presets[type] === 'string' ? presets[type] : '';
        return {
            type: type,
            content: content || '',
            id: Date.now()
        };
    });

    coreModule.cards.length = 0;
    newCards.forEach(card => coreModule.cards.push(card));

    coreModule.renderCards();
    coreModule.updatePrompt();

    // Sauvegarder le nouveau prompt
    savePromptDataUnderName(name);

    // Mettre à jour l'interface utilisateur
    updateSavedPromptsSelect();
    updateFavoriteButton(name);

    if (savedPromptsSelect) {
        const option = Array.from(savedPromptsSelect.options)
            .find(opt => opt.value === `prompt|${name}`);
        if (option) {
            savedPromptsSelect.value = option.value;
        }
    }

    coreModule.triggerActionButtonAnimation(loadPromptButton);
}

function handleSaveVersion() {
    const name = promptNameInput ? promptNameInput.value.trim() : '';
    if (!name) {
        alert('Veuillez d\'abord sauvegarder le prompt avec un nom.');
        return;
    }

    // S'assurer que le prompt de base existe
    let existing = coreModule.storageData.prompts[name];
    if (!existing) {
        existing = savePromptDataUnderName(name);
    }

    // Créer un nouveau nom de variante localement
    // On supprime d'abord les éventuels suffixes de version (ex. "Nom 2")
    const baseName = name
        .replace(/\s*\([^)]*\)$/, '')
        .trim()
        .replace(/\s+\d+$/, '');

    let maxIndex = 1;

    Object.keys(coreModule.storageData.prompts || {}).forEach(existingName => {
        if (existingName === baseName) {
            if (maxIndex === 1) {
                maxIndex = 2;
            }
            return;
        }
        if (existingName.indexOf(baseName + ' ') === 0) {
            const suffix = existingName.substring(baseName.length + 1);
            const num = parseInt(suffix, 10);
            if (!isNaN(num) && num >= maxIndex) {
                maxIndex = num + 1;
            }
        }
    });

    const variantName = baseName + ' ' + maxIndex;

    if (!variantName) {
        alert('Impossible de créer une nouvelle version.');
        return;
    }

    // Mettre à jour le nom et sauvegarder
    if (promptNameInput) {
        promptNameInput.value = variantName;
    }
    savePromptDataUnderName(variantName);
    coreModule.triggerActionButtonAnimation(saveVersionButton);

    // Mettre à jour la sélection
    if (savedPromptsSelect) {
        const option = Array.from(savedPromptsSelect.options)
            .find(opt => opt.value === `prompt|${variantName}`);
        if (option) {
            savedPromptsSelect.value = option.value;
        }
    }
}

function updateSavedPromptsSelect() {
    if (!savedPromptsSelect) {
        return;
    }

    const currentValue = savedPromptsSelect.value;
    savedPromptsSelect.innerHTML = '';

    // Trier les prompts par favoris puis par date de modification
    const sortedPrompts = Object.entries(coreModule.storageData.prompts)
        .sort(([nameA, dataA], [nameB, dataB]) => {
            // Les favoris d'abord
            if (dataA.isFavorite && !dataB.isFavorite) return -1;
            if (!dataA.isFavorite && dataB.isFavorite) return 1;

            // Puis par date de modification (les plus récents d'abord)
            return new Date(dataB.updatedAt || 0) - new Date(dataA.updatedAt || 0);
        });

    // Ajouter une option vide
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Sélectionner un modèle ou un prompt --';
    savedPromptsSelect.appendChild(defaultOption);

    // Ajouter les modèles (lecture seule)
    if (coreModule && coreModule.TEMPLATES) {
        const templatesGroup = document.createElement('optgroup');
        templatesGroup.label = 'Modèles (lecture seule)';

        Object.keys(coreModule.TEMPLATES).forEach(id => {
            const template = coreModule.TEMPLATES[id];
            if (!template) {
                return;
            }

            let displayName = id;
            if (coreModule.templateSelector) {
                const opt = coreModule.templateSelector.querySelector('option[value="' + id + '"]');
                if (opt && opt.textContent) {
                    displayName = opt.textContent.trim();
                }
            }

            const option = document.createElement('option');
            option.value = `template|${id}`;
            option.textContent = displayName;
            templatesGroup.appendChild(option);
        });

        savedPromptsSelect.appendChild(templatesGroup);
    }

    // Ajouter les prompts enregistrés
    const promptsGroup = document.createElement('optgroup');
    promptsGroup.label = 'Prompts enregistrés';

    sortedPrompts.forEach(([name, data]) => {
        const option = document.createElement('option');
        option.value = `prompt|${name}`;
        option.textContent = `${data.isFavorite ? '★ ' : ''}${name}`;
        promptsGroup.appendChild(option);
    });

    savedPromptsSelect.appendChild(promptsGroup);

    // Restaurer la sélection précédente si elle existe toujours
    if (currentValue) {
        const optionToSelect = Array.from(savedPromptsSelect.options)
            .find(option => option.value === currentValue);
        if (optionToSelect) {
            savedPromptsSelect.value = currentValue;
        }
    }

    refreshPromptNameDatalist();
}

function refreshPromptNameDatalist() {
    if (!promptNameInput) {
        return;
    }

    if (!promptNameDatalist) {
        promptNameDatalist = document.createElement('datalist');
        promptNameDatalist.id = 'prompt-name-datalist';
        document.body.appendChild(promptNameDatalist);
        promptNameInput.setAttribute('list', promptNameDatalist.id);
    }

    if (!coreModule || !coreModule.storageData) {
        return;
    }

    promptNameDatalist.innerHTML = '';

    Object.keys(coreModule.storageData.prompts || {}).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        promptNameDatalist.appendChild(option);
    });
}

// --- Gestionnaires d'événements ---

function handleSavePrompt() {
    const name = promptNameInput ? promptNameInput.value.trim() : '';
    if (!name) {
        alert('Veuillez saisir un nom pour le prompt.');
        return;
    }

    savePromptDataUnderName(name);
    coreModule.triggerActionButtonAnimation(savePromptButton);

    // Mettre à jour l'interface utilisateur
    updateSavedPromptsSelect();
    updateFavoriteButton(name);

    // Sélectionner le prompt sauvegardé
    if (savedPromptsSelect) {
        const option = Array.from(savedPromptsSelect.options)
            .find(opt => opt.value === `prompt|${name}`);
        if (option) {
            savedPromptsSelect.value = option.value;
        }
    }
}

function handleLoadPrompt() {
    const raw = savedPromptsSelect ? savedPromptsSelect.value : '';
    if (!raw) {
        return;
    }

    const parsed = parseSavedSelectionValue(raw);
    if (!parsed) {
        return;
    }

    if (parsed.type === 'prompt') {
        loadNamedPrompt(parsed.name);
        coreModule.triggerActionButtonAnimation(loadPromptButton);
    } else if (parsed.type === 'template') {
        loadTemplateAsNewPrompt(parsed.name);
    }
}

function handleDeletePrompt() {
    const raw = savedPromptsSelect ? savedPromptsSelect.value : '';
    if (!raw) {
        return;
    }

    const parsed = parseSavedSelectionValue(raw);
    if (!parsed || parsed.type !== 'prompt') {
        return;
    }

    if (!confirm(`Supprimer définitivement le prompt "${parsed.name}" ?`)) {
        return;
    }

    // Supprimer le prompt
    delete coreModule.storageData.prompts[parsed.name];
    coreModule.saveStorage();

    // Mettre à jour l'interface utilisateur
    updateSavedPromptsSelect();

    // Réinitialiser le champ de nom si c'était le prompt actuel
    if (promptNameInput && promptNameInput.value === parsed.name) {
        promptNameInput.value = '';
    }

    if (currentPromptName === parsed.name) {
        currentPromptName = '';
        clearRenameSuggestion();
    }

    // Mettre à jour le bouton favori
    updateFavoriteButton('');

    alert(`Le prompt "${parsed.name}" a été supprimé.`);
}

function handleToggleFavorite() {
    const raw = savedPromptsSelect ? savedPromptsSelect.value : '';
    if (!raw) {
        return;
    }

    const parsed = parseSavedSelectionValue(raw);
    if (!parsed || parsed.type !== 'prompt') {
        return;
    }

    toggleFavoriteByName(parsed.name);
    coreModule.triggerActionButtonAnimation(favoritePromptButton);
}

function handleExportPrompt() {
    exportPrompt();
    coreModule.triggerActionButtonAnimation(exportPromptButton);
}

function handleImportPrompt(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) {
        return;
    }

    // Réinitialiser l'input de fichier pour permettre la réimportation du même fichier
    event.target.value = '';

    importPromptFromFile(file);
    coreModule.triggerActionButtonAnimation(importPromptButton);
}

function ensureRenameSuggestionElements() {
    if (!promptNameInput) {
        return;
    }

    if (renameSuggestionContainer && renameSuggestionTextElement && renameSuggestionButton) {
        return;
    }

    const row = promptNameInput.closest('.prompt-name-row') || promptNameInput.parentElement;
    if (!row) {
        return;
    }

    renameSuggestionContainer = document.createElement('div');
    renameSuggestionContainer.className = 'rename-suggestion';

    renameSuggestionTextElement = document.createElement('span');
    renameSuggestionTextElement.className = 'rename-suggestion-text';

    renameSuggestionButton = document.createElement('button');
    renameSuggestionButton.type = 'button';
    renameSuggestionButton.className = 'secondary-button action-button rename-suggestion-button';
    renameSuggestionButton.textContent = 'Renommer maintenant';

    renameSuggestionContainer.appendChild(renameSuggestionTextElement);
    renameSuggestionContainer.appendChild(renameSuggestionButton);

    row.appendChild(renameSuggestionContainer);

    renameSuggestionContainer.style.display = 'none';

    renameSuggestionButton.addEventListener('click', handleConfirmRename);
}

function clearRenameSuggestion() {
    if (renameSuggestionTimeoutId) {
        clearTimeout(renameSuggestionTimeoutId);
        renameSuggestionTimeoutId = null;
    }

    if (renameSuggestionContainer) {
        renameSuggestionContainer.style.display = 'none';
    }
}

function handlePromptNameInputChange() {
    if (!promptNameInput) {
        return;
    }

    if (renameSuggestionTimeoutId) {
        clearTimeout(renameSuggestionTimeoutId);
    }

    const newName = promptNameInput.value.trim();

    if (!currentPromptName || newName === currentPromptName) {
        clearRenameSuggestion();
        return;
    }

    if (!coreModule || !coreModule.storageData || !coreModule.storageData.prompts[currentPromptName]) {
        clearRenameSuggestion();
        return;
    }

    renameSuggestionTimeoutId = setTimeout(() => {
        if (!promptNameInput) {
            return;
        }

        const latestName = promptNameInput.value.trim();

        if (!currentPromptName || latestName === currentPromptName) {
            clearRenameSuggestion();
            return;
        }

        if (!coreModule || !coreModule.storageData || !coreModule.storageData.prompts[currentPromptName]) {
            clearRenameSuggestion();
            return;
        }

        ensureRenameSuggestionElements();

        if (!renameSuggestionContainer || !renameSuggestionTextElement) {
            return;
        }

        const labelName = latestName || '(sans nom)';
        renameSuggestionTextElement.textContent = 'Renommer le prompt en « ' + labelName + ' » ?';
        renameSuggestionContainer.style.display = 'flex';
    }, 2000);
}

function handleConfirmRename() {
    if (!promptNameInput) {
        clearRenameSuggestion();
        return;
    }

    const oldName = currentPromptName;
    const newName = promptNameInput.value.trim();

    if (!newName || !oldName || oldName === newName) {
        clearRenameSuggestion();
        return;
    }

    const prompts = (coreModule && coreModule.storageData && coreModule.storageData.prompts) || {};
    const hasOld = !!prompts[oldName];
    const hasNew = !!prompts[newName];

    if (!hasOld && !hasNew) {
        savePromptDataUnderName(newName);
        currentPromptName = newName;
        clearRenameSuggestion();
        return;
    }

    if (hasNew && newName !== oldName) {
        const shouldReplace = window.confirm('Un prompt nommé "' + newName + '" existe déjà. Voulez-vous le remplacer par la version actuelle ?');
        if (!shouldReplace) {
            promptNameInput.value = oldName;
            clearRenameSuggestion();
            return;
        }
    }

    savePromptDataUnderName(newName);

    if (hasOld && oldName !== newName) {
        delete prompts[oldName];
        coreModule.saveStorage();
        updateSavedPromptsSelect();
    }

    currentPromptName = newName;
    clearRenameSuggestion();
}

// Exporter les fonctions nécessaires
export {
    initPromptsModule,
    savePromptDataUnderName,
    loadNamedPrompt,
    toggleFavoriteByName,
    importPromptFromData
};