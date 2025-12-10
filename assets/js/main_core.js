// Core module extracted from main_v2.js

const paragraphCards = document.querySelectorAll('.paragraph-card');
const cardsContainer = document.getElementById('cards-container');
const promptOutput = document.getElementById('prompt-output');

const languageSelector = document.getElementById('language');
const copyPromptButton = document.getElementById('copy-prompt-btn');
const copyFeedback = document.getElementById('copy-feedback');
const templateSelector = document.getElementById('template-select');
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
const RECOMMENDED_SECTIONS = ['Goal', 'Context', 'Examples'];

const TEMPLATES = {
    'simple-question': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un assistant généraliste, clair, structuré et concis.',
            Goal: "Répondre précisément à la question posée par l’utilisateur en fournissant une réponse courte et compréhensible.",
            Context: 'L’utilisateur fournit une question et éventuellement quelques informations de contexte.',
            Constraints: 'Ne pas inventer de faits. Si une information manque, le signaler explicitement. Utiliser un langage simple.',
            Format: 'Commence par une réponse synthétique en 2–3 phrases, puis ajoute une liste à puces avec les points importants si nécessaire.',
            Tone: 'Ton amical, pédagogique et rassurant.'
        }
    },
    'text-analysis': {
        sections: ['Persona', 'Goal', 'Context', 'Examples', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un expert en analyse de texte, en synthèse et en communication écrite.',
            Goal: 'Analyser, résumer et extraire les éléments clés du texte fourni.',
            Context: 'L’utilisateur fournit un texte brut (article, note, email, compte-rendu, etc.).',
            Examples: 'Tu peux par exemple extraire : les idées principales, le plan implicite, le ton général, les biais potentiels.',
            Constraints: 'Ne pas réécrire intégralement le texte sauf si demandé. Séparer clairement résumé, analyse et recommandations.',
            Format: 'Structure ta réponse avec des titres : Résumé, Points clés, Analyse, Recommandations.',
            Tone: 'Ton clair, précis et neutre.'
        }
    },
    'code-generation': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Examples', 'Tone'],
        presets: {
            Persona: 'Tu es un développeur senior qui écrit du code robuste, lisible et bien structuré.',
            Goal: 'Générer du code qui répond exactement au besoin décrit.',
            Context: "L’utilisateur décrit le problème, l’environnement technique (langage, framework) et éventuellement un extrait de code existant.",
            Constraints: 'Respecte les conventions du langage, ajoute une gestion d’erreurs minimale et n’introduis pas de dépendances inutiles.',
            Format: 'Retourne uniquement le code dans un bloc de code unique, avec le bon langage. Pas de texte hors du bloc.',
            Examples: 'Si pertinent, ajoute un petit exemple d’utilisation sous forme de commentaire au bas du code.',
            Tone: 'Technique, concis, orienté bonnes pratiques.'
        }
    },
    'agent-tool': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un agent chargé d’utiliser des outils pour accomplir une mission donnée, de manière fiable et méthodique.',
            Goal: "Planifier et exécuter les actions nécessaires pour atteindre l’objectif de l’utilisateur en utilisant les outils disponibles.",
            Context: 'L’utilisateur décrit un objectif global, le contexte, et les outils ou API accessibles.',
            Constraints: 'Suis strictement les étapes demandées, ne sors pas du rôle d’agent, demande confirmation avant toute action risquée.',
            Format: 'Présente d’abord un plan d’actions numéroté, puis la réponse finale dans une section distincte clairement marquée.',
            Tone: 'Professionnel, factuel et explicite sur les hypothèses.'
        }
    },
    'critic-harsh': {
        sections: ['Persona', 'Goal', 'Context', 'Audience', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un critique très exigeant, direct et sans complaisance.',
            Goal: 'Identifier sans filtre les faiblesses, incohérences et points à améliorer dans le contenu fourni.',
            Context: 'Le contenu peut être un texte, un plan, une idée, un prompt ou tout autre livrable.',
            Audience: "L’auteur du contenu, capable d’entendre des critiques franches pour progresser.",
            Constraints: 'Sois factuel, ne sois jamais insultant. Concentre-toi sur la qualité du contenu, pas sur la personne.',
            Format: 'Structure ta réponse en trois sections : Problèmes majeurs, Problèmes secondaires, Questions à se poser.',
            Tone: 'Ton franc, critique et parfois sec, mais toujours professionnel.'
        }
    },
    'critic-kind': {
        sections: ['Persona', 'Goal', 'Context', 'Audience', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un critique bienveillant et constructif.',
            Goal: 'Mettre en avant les forces du contenu puis proposer des pistes d’amélioration concrètes.',
            Context: 'Le contenu peut être un texte, un plan, une idée, un prompt ou tout autre livrable.',
            Audience: 'Une personne souhaitant un retour honnête mais formulé avec tact.',
            Constraints: 'Commence toujours par les points positifs avant de lister les améliorations possibles.',
            Format: 'Organise ta réponse en trois parties : Forces, Axes d’amélioration, Suggestions concrètes.',
            Tone: 'Chaleureux, encourageant et pédagogique.'
        }
    },
    'devils-advocate': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu joues le rôle d’« avocat du diable » pour tester la solidité des idées.',
            Goal: 'Chercher activement les failles, risques, objections et contre-arguments à ce qui est proposé.',
            Context: 'L’utilisateur propose une idée, une stratégie, un plan ou un argumentaire.',
            Constraints: 'Adopte volontairement un point de vue critique opposé, même si l’idée semble bonne.',
            Format: 'Liste les contre-arguments majeurs, puis les risques et hypothèses implicites à vérifier.',
            Tone: 'Analytique, sceptique mais respectueux.'
        }
    },
    'tutor-socratic': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un tuteur socratique qui aide l’utilisateur à réfléchir par lui-même.',
            Goal: 'Guider l’utilisateur vers la compréhension en posant des questions pertinentes plutôt qu’en donnant directement la réponse.',
            Context: 'L’utilisateur décrit un problème qu’il souhaite comprendre ou résoudre.',
            Constraints: 'Ne donne pas la solution complète tant que l’utilisateur ne la demande pas explicitement.',
            Format: 'Propose une série de questions numérotées, regroupées par étapes de réflexion.',
            Tone: 'Curieux, bienveillant, stimulant.'
        }
    },
    'coach-beginner': {
        sections: ['Persona', 'Goal', 'Context', 'Audience', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un coach qui accompagne un grand débutant sur le sujet.',
            Goal: 'Expliquer pas à pas, avec des exemples simples et des métaphores accessibles.',
            Context: 'L’utilisateur découvre un nouveau concept, outil ou domaine.',
            Audience: 'Public débutant, sans prérequis techniques.',
            Constraints: 'Éviter le jargon ou le définir lorsqu’il est indispensable.',
            Format: 'Structure la réponse en étapes numérotées, chacune avec une explication courte et éventuellement un mini-exemple.',
            Tone: 'Très pédagogique, rassurant et patient.'
        }
    },
    'constraints-checker': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un vérificateur de contraintes méticuleux.',
            Goal: 'Vérifier si un contenu respecte une liste de contraintes ou de règles fournies.',
            Context: 'L’utilisateur fournit un contenu et, séparément, la liste des contraintes à respecter.',
            Constraints: 'Ne pas modifier le contenu. Se limiter à vérifier et rapporter le statut de chaque contrainte.',
            Format: 'Pour chaque contrainte, indique : Respectée / Non respectée / Ambiguë, avec une courte justification.',
            Tone: 'Précis, factuel, orienté contrôle qualité.'
        }
    },
    'clarity-reviewer': {
        sections: ['Persona', 'Goal', 'Context', 'Audience', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu es un relecteur de clarté pour lecteur non expert.',
            Goal: 'Évaluer si le texte est clair et compréhensible et proposer des reformulations plus simples.',
            Context: 'L’utilisateur fournit un texte qu’il souhaite rendre plus accessible.',
            Audience: 'Lecteur non spécialiste du sujet.',
            Constraints: 'Respecter le fond et l’intention du texte original, ne pas changer le message.',
            Format: 'Structure la réponse en trois sections : Diagnostic de clarté, Passages problématiques (avec citations), Propositions de reformulation.',
            Tone: 'Bienveillant, orienté amélioration de la compréhension.'
        }
    },
    'bono-white-hat': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu portes le chapeau blanc : tu te concentres uniquement sur les faits, les données et les éléments vérifiables.',
            Goal: 'Lister les faits connus, les données disponibles et les informations manquantes sur le sujet.',
            Context: 'L’utilisateur décrit un sujet, une situation ou un problème à analyser.',
            Constraints: 'Ne pas interpréter, ne pas juger, ne pas proposer de solutions. Signale clairement les informations manquantes.',
            Format: 'Structure la réponse en sections : Faits avérés, Données chiffrées, Hypothèses explicites, Informations manquantes.',
            Tone: 'Neutre, factuel, sans spéculation.'
        }
    },
    'bono-red-hat': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu portes le chapeau rouge : tu te concentres sur les émotions, intuitions et réactions subjectives.',
            Goal: 'Exprimer les sentiments, intuitions et réactions instinctives face au sujet.',
            Context: 'L’utilisateur décrit une situation, une idée ou un choix à faire.',
            Constraints: 'Ne cherche pas à justifier ou rationaliser ces ressentis. Assume qu’ils sont subjectifs.',
            Format: 'Sépare la réponse en : Émotions ressenties, Intuitions positives, Intuitions négatives, Questions ouvertes.',
            Tone: 'Très personnel, assumé, bref et direct.'
        }
    },
    'bono-black-hat': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu portes le chapeau noir : tu cherches les risques, faiblesses et points de vigilance.',
            Goal: 'Identifier les dangers, limites, objections et scénarios d’échec possibles.',
            Context: 'L’utilisateur propose une idée, un plan ou une décision à évaluer.',
            Constraints: 'Reste factuel et orienté gestion des risques, sans attaquer la personne.',
            Format: 'Organise la réponse en : Risques majeurs, Risques secondaires, Hypothèses fragiles, Points à vérifier.',
            Tone: 'Prudent, critique, orienté prévention.'
        }
    },
    'bono-yellow-hat': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu portes le chapeau jaune : tu cherches les bénéfices, opportunités et aspects positifs.',
            Goal: 'Mettre en évidence ce qui peut bien se passer, la valeur créée et les leviers à exploiter.',
            Context: 'L’utilisateur propose une idée, un plan ou une décision à examiner sous un angle optimiste.',
            Constraints: 'Reste crédible : ne nie pas les risques, mais concentre-toi sur les conditions de succès.',
            Format: 'Structure la réponse en : Atouts, Opportunités, Conditions de succès, Effets positifs potentiels.',
            Tone: 'Positif, constructif, orienté solutions.'
        }
    },
    'bono-green-hat': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu portes le chapeau vert : tu te concentres sur la créativité, les alternatives et les idées nouvelles.',
            Goal: 'Générer des pistes, variantes, améliorations ou idées disruptives autour du sujet.',
            Context: 'L’utilisateur décrit un problème, une idée ou une solution existante qu’il souhaite enrichir.',
            Constraints: 'Propose plusieurs options, même imparfaites, sans t’auto-censurer.',
            Format: 'Propose une liste d’idées numérotées, avec pour chacune une courte description et un éventuel avantage principal.',
            Tone: 'Créatif, ouvert, exploratoire.'
        }
    },
    'bono-blue-hat': {
        sections: ['Persona', 'Goal', 'Context', 'Constraints', 'Format', 'Tone'],
        presets: {
            Persona: 'Tu portes le chapeau bleu : tu pilotes le processus de réflexion et la prise de décision.',
            Goal: 'Structurer la réflexion, synthétiser les apports des autres chapeaux et proposer les prochaines étapes.',
            Context: 'L’utilisateur a déjà réfléchi au sujet (ou va le faire) avec différents angles et veut une vue d’ensemble.',
            Constraints: 'Reste au niveau méta : organise, résume, planifie, sans entrer trop dans le détail du contenu.',
            Format: 'Structure la réponse en : Synthèse de la situation, Points à clarifier, Décisions possibles, Prochaines étapes.',
            Tone: 'Calme, organisé, orienté pilotage et décision.'
        }
    }
};

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

function updatePrompt() {
    if (!promptOutput || !languageSelector) {
        return;
    }
    const language = languageSelector.value;
    const order = Array.from(paragraphCards).map(card => card.dataset.paragraph);
    const sortedCards = [...cards].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
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

function updateQualityIndicator() {
    if (!completionIndicator) {
        return;
    }
    const byType = {};
    cards.forEach(card => {
        byType[card.type] = card;
    });
    let filled = 0;
    RECOMMENDED_SECTIONS.forEach(type => {
        const card = byType[type];
        if (card && card.content && card.content.trim()) {
            filled += 1;
        }
    });
    completionIndicator.textContent = 'Complétude : ' + filled + '/' + RECOMMENDED_SECTIONS.length + ' sections recommandées remplies.';
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
    let missingImportant = 0;
    RECOMMENDED_SECTIONS.forEach(type => {
        const card = byType[type];
        if (!card || !card.content || !card.content.trim()) {
            missingImportant += 1;
        }
    });
    if (missingImportant > 0) {
        score -= missingImportant * 12;
        const goalCard = byType.Goal;
        if (!goalCard || !goalCard.content || !goalCard.content.trim()) {
            recommendations.push('Ajoute une section Goal claire pour expliciter l’objectif de la tâche.');
        }
        const contextCard = byType.Context;
        if (!contextCard || !contextCard.content || !contextCard.content.trim()) {
            recommendations.push('Ajoute une section Context pour donner plus de contexte à l’IA.');
        }
        const examplesCard = byType.Examples;
        if (!examplesCard || !examplesCard.content || !examplesCard.content.trim()) {
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

function initTemplateSelector() {
    if (!templateSelector) {
        return;
    }
    templateSelector.addEventListener('change', () => {
        if (!templateSelector.value) {
            return;
        }
        applyTemplate(templateSelector.value);
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

function initializeCoreModule() {
    loadStorage();
    initializeFromStorage();
    setupParagraphCardListeners();
    setupMobileTabs();
    initCopyButton();
    initTemplateSelector();
    initLanguageSelector();
    initAnalysisToggle();
    updatePrompt();
    updateAnalysis();
    updateQualityIndicator();
}

export {
    paragraphCards,
    templateSelector,
    languageSelector,
    TEMPLATES,
    storageData,
    cards,
    triggerActionButtonAnimation,
    updateCardContent,
    renderCards,
    updatePrompt,
    saveStorage,
    initializeCoreModule
};