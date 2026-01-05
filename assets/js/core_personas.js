// Persona management module
// Handles persona library display, builder, and application

import {
    PERSONA_DIMENSIONS,
    PERSONA_CATEGORIES,
    PERSONA_LIBRARY,
    MODEL_PERSONA_FORMATS,
    SPECIALIZED_EXPERTISE,
    buildPersonaPrompt,
    buildPersonaPromptForModel,
    getPersonasByCategory,
    searchPersonas
} from './data/personas.js';

// DOM Elements
const personaLibraryBtn = document.getElementById('persona-library-btn');
const personaBuilderBtn = document.getElementById('persona-builder-btn');
const personaLibraryModal = document.getElementById('persona-library-modal');
const personaBuilderModal = document.getElementById('persona-builder-modal');
const personaLibraryClose = document.getElementById('persona-library-close');
const personaBuilderClose = document.getElementById('persona-builder-close');

// Library elements
const personaSearch = document.getElementById('persona-search');
const personaCategories = document.getElementById('persona-categories');
const personaList = document.getElementById('persona-list');
const personaPreview = document.getElementById('persona-preview');
const personaPreviewName = document.getElementById('persona-preview-name');
const personaPreviewDescription = document.getElementById('persona-preview-description');
const personaPreviewDimensions = document.getElementById('persona-preview-dimensions');
const personaPreviewPrompt = document.getElementById('persona-preview-prompt');
const personaApplyBtn = document.getElementById('persona-apply-btn');

// Builder elements
const builderName = document.getElementById('builder-name');
const builderStyle = document.getElementById('builder-style');
const builderExpertise = document.getElementById('builder-expertise');
const builderBehavior = document.getElementById('builder-behavior');
const builderExperience = document.getElementById('builder-experience');
const builderContext = document.getElementById('builder-context');
const builderModelFormat = document.getElementById('builder-model-format');
const builderDepthLevel = document.getElementById('builder-depth-level');
const builderReflectionMode = document.getElementById('builder-reflection-mode');
const builderEvaluationCriteria = document.getElementById('builder-evaluation-criteria');
const builderFormatIndicator = document.getElementById('builder-format-indicator');
const builderPreviewOutput = document.getElementById('builder-preview-output');
const hintRag = document.getElementById('hint-rag');
const builderApplyBtn = document.getElementById('builder-apply-btn');
const builderSaveBtn = document.getElementById('builder-save-btn');

// Reference to main model selector
const mainModelSelector = document.getElementById('model-selector');

// Storage key for custom personas
const CUSTOM_PERSONAS_KEY = 'suprompts_custom_personas';

// State
let selectedPersona = null;
let currentCategory = null;
let applyPersonaCallback = null;
let customPersonas = {};

/**
 * Initialize the persona system
 * @param {Function} onApplyPersona - Callback when a persona is applied
 */
export function initPersonaSystem(onApplyPersona) {
    applyPersonaCallback = onApplyPersona;

    loadCustomPersonas();
    setupLibraryModal();
    setupBuilderModal();
    populateCategories();
    populateBuilderSelects();
    renderPersonaList();
}

/**
 * Load custom personas from localStorage
 */
function loadCustomPersonas() {
    try {
        const stored = localStorage.getItem(CUSTOM_PERSONAS_KEY);
        if (stored) {
            customPersonas = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load custom personas:', e);
        customPersonas = {};
    }
}

/**
 * Save custom personas to localStorage
 */
function saveCustomPersonas() {
    try {
        localStorage.setItem(CUSTOM_PERSONAS_KEY, JSON.stringify(customPersonas));
    } catch (e) {
        console.error('Failed to save custom personas:', e);
    }
}

/**
 * Get all personas (built-in + custom)
 */
function getAllPersonas() {
    return {
        ...PERSONA_LIBRARY,
        ...customPersonas
    };
}

function setupLibraryModal() {
    if (personaLibraryBtn) {
        personaLibraryBtn.addEventListener('click', openLibraryModal);
    }
    if (personaLibraryClose) {
        personaLibraryClose.addEventListener('click', closeLibraryModal);
    }
    if (personaLibraryModal) {
        personaLibraryModal.addEventListener('click', (e) => {
            if (e.target === personaLibraryModal) {
                closeLibraryModal();
            }
        });
    }
    if (personaSearch) {
        personaSearch.addEventListener('input', handleSearch);
    }
    if (personaApplyBtn) {
        personaApplyBtn.addEventListener('click', applySelectedPersona);
    }
}

function setupBuilderModal() {
    if (personaBuilderBtn) {
        personaBuilderBtn.addEventListener('click', openBuilderModal);
    }
    if (personaBuilderClose) {
        personaBuilderClose.addEventListener('click', closeBuilderModal);
    }
    if (personaBuilderModal) {
        personaBuilderModal.addEventListener('click', (e) => {
            if (e.target === personaBuilderModal) {
                closeBuilderModal();
            }
        });
    }
    if (builderApplyBtn) {
        builderApplyBtn.addEventListener('click', applyBuiltPersona);
    }
    if (builderSaveBtn) {
        builderSaveBtn.addEventListener('click', saveBuiltPersona);
    }

    // Update preview on any change
    [builderName, builderStyle, builderExpertise, builderBehavior, builderExperience, builderContext, builderModelFormat, builderDepthLevel, builderReflectionMode, builderEvaluationCriteria, builderFormatIndicator].forEach(el => {
        if (el) {
            el.addEventListener('change', updateBuilderPreview);
            el.addEventListener('input', updateBuilderPreview);
        }
    });
}

function openLibraryModal() {
    if (personaLibraryModal) {
        personaLibraryModal.classList.add('active');
    }
}

function closeLibraryModal() {
    if (personaLibraryModal) {
        personaLibraryModal.classList.remove('active');
    }
}

function openBuilderModal() {
    if (personaBuilderModal) {
        personaBuilderModal.classList.add('active');
        updateBuilderPreview();
    }
}

function closeBuilderModal() {
    if (personaBuilderModal) {
        personaBuilderModal.classList.remove('active');
    }
}

function populateCategories() {
    if (!personaCategories) return;

    personaCategories.innerHTML = '';

    // Add "All" button
    const allBtn = document.createElement('button');
    allBtn.className = 'persona-category-btn active';
    allBtn.textContent = '🔍 Tous';
    allBtn.dataset.category = '';
    allBtn.addEventListener('click', () => selectCategory(null, allBtn));
    personaCategories.appendChild(allBtn);

    // Add category buttons
    Object.values(PERSONA_CATEGORIES).forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'persona-category-btn';
        btn.textContent = cat.label;
        btn.dataset.category = cat.id;
        btn.addEventListener('click', () => selectCategory(cat.id, btn));
        personaCategories.appendChild(btn);
    });

    // Add custom personas category if any exist
    const customBtn = document.createElement('button');
    customBtn.className = 'persona-category-btn';
    customBtn.textContent = '⭐ Mes personas';
    customBtn.dataset.category = 'custom';
    customBtn.addEventListener('click', () => selectCategory('custom', customBtn));
    personaCategories.appendChild(customBtn);
}

function selectCategory(categoryId, btnElement) {
    currentCategory = categoryId;

    // Update active state
    document.querySelectorAll('.persona-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (btnElement) {
        btnElement.classList.add('active');
    }

    renderPersonaList();
}

function handleSearch() {
    const query = personaSearch ? personaSearch.value : '';
    renderPersonaList(query);
}

function renderPersonaList(searchQuery = '') {
    if (!personaList) return;

    personaList.innerHTML = '';

    let personas;
    if (searchQuery) {
        // Search in both built-in and custom personas
        const allPersonas = Object.values(getAllPersonas());
        const q = searchQuery.toLowerCase().trim();
        personas = allPersonas.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(q);
            const descMatch = p.description.toLowerCase().includes(q);
            const tagMatch = p.tags && p.tags.some(tag => tag.toLowerCase().includes(q));
            return nameMatch || descMatch || tagMatch;
        });
    } else if (currentCategory === 'custom') {
        personas = Object.values(customPersonas);
    } else if (currentCategory) {
        personas = getPersonasByCategory(currentCategory);
    } else {
        personas = Object.values(getAllPersonas());
    }

    personas.forEach(persona => {
        const card = document.createElement('div');
        card.className = 'persona-card';
        card.dataset.personaId = persona.id;

        const title = document.createElement('h4');
        title.textContent = persona.name;
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = persona.description;
        card.appendChild(desc);

        // Add action buttons for custom personas
        if (persona.isCustom) {
            const actions = document.createElement('div');
            actions.className = 'persona-card-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'persona-action-btn edit';
            editBtn.textContent = '✏️';
            editBtn.title = 'Modifier';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editCustomPersona(persona);
            });
            actions.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'persona-action-btn delete';
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = 'Supprimer';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                confirmDeletePersona(persona);
            });
            actions.appendChild(deleteBtn);

            card.appendChild(actions);
        }

        card.addEventListener('click', () => selectPersona(persona));

        personaList.appendChild(card);
    });

    // Hide preview when list changes
    hidePersonaPreview();
}

function selectPersona(persona) {
    selectedPersona = persona;

    // Update selection UI
    document.querySelectorAll('.persona-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.personaId === persona.id) {
            card.classList.add('selected');
        }
    });

    showPersonaPreview(persona);
}

function showPersonaPreview(persona) {
    if (!personaPreview) return;

    if (personaPreviewName) {
        personaPreviewName.textContent = persona.name;
    }
    if (personaPreviewDescription) {
        personaPreviewDescription.textContent = persona.description;
    }

    // Show dimension tags
    if (personaPreviewDimensions) {
        personaPreviewDimensions.innerHTML = '';
        Object.entries(persona.dimensions).forEach(([dimId, valueId]) => {
            const dim = PERSONA_DIMENSIONS[dimId];
            if (dim) {
                const option = dim.options.find(o => o.id === valueId);
                if (option) {
                    const tag = document.createElement('span');
                    tag.className = 'persona-dimension-tag';
                    tag.textContent = `${dim.icon} ${option.label}`;
                    personaPreviewDimensions.appendChild(tag);
                }
            }
        });
    }

    if (personaPreviewPrompt) {
        personaPreviewPrompt.textContent = persona.prompt;
    }

    personaPreview.classList.add('visible');
}

function hidePersonaPreview() {
    if (personaPreview) {
        personaPreview.classList.remove('visible');
    }
    selectedPersona = null;
}

function applySelectedPersona() {
    if (!selectedPersona || !applyPersonaCallback) return;

    applyPersonaCallback(selectedPersona.prompt);
    closeLibraryModal();
}

function populateBuilderSelects() {
    populateSelect(builderStyle, PERSONA_DIMENSIONS.style);
    populateSelect(builderExpertise, PERSONA_DIMENSIONS.expertise);
    populateSelect(builderBehavior, PERSONA_DIMENSIONS.behavior);
    populateSelect(builderExperience, PERSONA_DIMENSIONS.experience);
}

function populateSelect(selectEl, dimension) {
    if (!selectEl || !dimension) return;

    selectEl.innerHTML = '';

    dimension.options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.id;
        opt.textContent = `${option.label} – ${option.description}`;
        selectEl.appendChild(opt);
    });
}

function updateBuilderPreview() {
    if (!builderPreviewOutput) return;

    const dimensions = {
        style: builderStyle ? builderStyle.value : '',
        expertise: builderExpertise ? builderExpertise.value : '',
        behavior: builderBehavior ? builderBehavior.value : '',
        experience: builderExperience ? builderExperience.value : ''
    };

    const customContext = builderContext ? builderContext.value : '';
    const reflectionMode = builderReflectionMode ? builderReflectionMode.checked : false;
    const depthLevel = builderDepthLevel ? builderDepthLevel.value : 'basic';
    const evaluationCriteria = builderEvaluationCriteria ? builderEvaluationCriteria.checked : false;

    // Get selected format or auto-detect from main model selector
    let formatKey = builderModelFormat ? builderModelFormat.value : 'default';
    let formatName = 'Standard';

    if (formatKey === 'auto') {
        // Auto-detect from main model selector
        const selectedModel = mainModelSelector ? mainModelSelector.value : '';
        formatKey = getFormatKeyFromModel(selectedModel);
        formatName = MODEL_PERSONA_FORMATS[formatKey].name || 'Standard';
    } else {
        formatName = MODEL_PERSONA_FORMATS[formatKey].name || formatKey;
    }

    // Update format indicator with options status
    if (builderFormatIndicator) {
        const indicators = [];
        if (depthLevel !== 'basic') indicators.push(`📈 ${depthLevel}`);
        if (reflectionMode) indicators.push('🧠 R-CHAR');
        if (evaluationCriteria) indicators.push('✅ Éval');
        const indicatorText = indicators.length > 0 ? ` + ${indicators.join(' + ')}` : '';
        builderFormatIndicator.textContent = `(${formatName}${indicatorText})`;
    }

    // Show/hide RAG warning for specialized expertise
    if (hintRag) {
        const isSpecialized = SPECIALIZED_EXPERTISE.includes(dimensions.expertise);
        const isAdvancedOrExpert = depthLevel === 'advanced' || depthLevel === 'expert';
        hintRag.style.display = (isSpecialized && isAdvancedOrExpert) ? 'block' : 'none';
    }

    const options = {
        reflectionMode,
        depthLevel,
        evaluationCriteria
    };

    const prompt = buildPersonaPromptForModel(dimensions, customContext, formatKey, options);
    builderPreviewOutput.textContent = prompt;
}

/**
 * Get format key from model ID
 */
function getFormatKeyFromModel(modelId) {
    if (!modelId) return 'default';

    const id = modelId.toLowerCase();

    if (id.includes('claude')) return 'claude';
    if (id.includes('gpt') || id.includes('openai')) return 'gpt';
    if (id.includes('gemini') || id.includes('google')) return 'gemini';
    if (id.includes('llama') || id.includes('mistral')) return 'llama';
    if (id.includes('deepseek')) return 'deepseek';

    return 'default';
}

function applyBuiltPersona() {
    if (!applyPersonaCallback || !builderPreviewOutput) return;

    const prompt = builderPreviewOutput.textContent;
    if (prompt) {
        applyPersonaCallback(prompt);
        closeBuilderModal();
    }
}

/**
 * Save the built persona to the custom library
 */
function saveBuiltPersona() {
    const name = builderName ? builderName.value.trim() : '';

    if (!name) {
        alert('Veuillez donner un nom à votre persona avant de le sauvegarder.');
        if (builderName) builderName.focus();
        return;
    }

    const dimensions = {
        style: builderStyle ? builderStyle.value : '',
        expertise: builderExpertise ? builderExpertise.value : '',
        behavior: builderBehavior ? builderBehavior.value : '',
        experience: builderExperience ? builderExperience.value : ''
    };

    const customContext = builderContext ? builderContext.value : '';
    const prompt = builderPreviewOutput ? builderPreviewOutput.textContent : buildPersonaPrompt(dimensions, customContext);

    // Use existing ID if editing, or generate new one
    const id = editingPersonaId || ('custom-' + Date.now());
    const isUpdate = !!editingPersonaId;

    // Create persona object
    const persona = {
        id: id,
        name: name,
        category: 'custom',
        description: `Persona personnalisé : ${getShortDescription(dimensions)}`,
        dimensions: dimensions,
        customContext: customContext,
        prompt: prompt,
        tags: ['personnalisé', dimensions.expertise, dimensions.style],
        isCustom: true,
        createdAt: (customPersonas[id] && customPersonas[id].createdAt) || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Save to custom personas
    customPersonas[id] = persona;
    saveCustomPersonas();

    // Reset editing state
    editingPersonaId = null;

    // Refresh the list
    renderPersonaList();

    // Show confirmation
    const action = isUpdate ? 'mis à jour' : 'sauvegardé';
    alert(`Persona "${name}" ${action} avec succès !`);

    // Clear the form
    if (builderName) builderName.value = '';
    if (builderContext) builderContext.value = '';
}

/**
 * Get a short description from dimensions
 */
function getShortDescription(dimensions) {
    const parts = [];
    if (dimensions.expertise) {
        const exp = PERSONA_DIMENSIONS.expertise.options.find(o => o.id === dimensions.expertise);
        if (exp) parts.push(exp.label);
    }
    if (dimensions.experience) {
        const lvl = PERSONA_DIMENSIONS.experience.options.find(o => o.id === dimensions.experience);
        if (lvl) parts.push(lvl.label);
    }
    return parts.join(', ') || 'Personnalisé';
}

// State for editing
let editingPersonaId = null;

/**
 * Edit a custom persona - loads it into the builder
 */
function editCustomPersona(persona) {
    editingPersonaId = persona.id;

    // Close library and open builder
    closeLibraryModal();
    openBuilderModal();

    // Populate builder with persona data
    if (builderName) builderName.value = persona.name;
    if (builderStyle && persona.dimensions.style) builderStyle.value = persona.dimensions.style;
    if (builderExpertise && persona.dimensions.expertise) builderExpertise.value = persona.dimensions.expertise;
    if (builderBehavior && persona.dimensions.behavior) builderBehavior.value = persona.dimensions.behavior;
    if (builderExperience && persona.dimensions.experience) builderExperience.value = persona.dimensions.experience;
    if (builderContext && persona.customContext) builderContext.value = persona.customContext;

    // Update preview
    updateBuilderPreview();
}

/**
 * Confirm deletion of a custom persona
 */
function confirmDeletePersona(persona) {
    if (confirm(`Voulez-vous vraiment supprimer le persona "${persona.name}" ?`)) {
        deleteCustomPersona(persona.id);
    }
}

/**
 * Delete a custom persona
 */
export function deleteCustomPersona(personaId) {
    if (customPersonas[personaId]) {
        delete customPersonas[personaId];
        saveCustomPersonas();
        renderPersonaList();
        hidePersonaPreview();
    }
}

export {
    PERSONA_LIBRARY,
    PERSONA_CATEGORIES,
    PERSONA_DIMENSIONS
};