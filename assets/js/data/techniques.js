// Prompting technique definitions
// Each technique defines required/optional sections and compatible models

export const PROMPTING_TECHNIQUES = {
    'zero-shot': {
        id: 'zero-shot',
        displayName: 'Zero-shot',
        description: 'Instruction directe sans exemples. L\'IA répond uniquement basée sur ses connaissances.',
        requiredSections: ['goal', 'constraints'],
        optionalSections: ['profil', 'context', 'format', 'tone'],
        compatibleModels: ['claude', 'gpt', 'gemini', 'llama', 'deepseek'],
        useCases: ['Tâches simples', 'Questions directes', 'Génération créative libre'],
        template: {
            profil: 'Tu es un assistant polyvalent, précis et concis.',
            goal: '[DÉCRIS TA TÂCHE ICI]\n\nSois direct et va à l\'essentiel. Fournis une réponse complète mais concise.',
            constraints: '- Réponds de manière structurée\n- Évite les répétitions\n- Si tu n\'es pas sûr, indique-le clairement',
            format: 'Utilise des paragraphes courts et des listes à puces si pertinent.',
            tone: 'Professionnel et accessible'
        }
    },
    'few-shot': {
        id: 'few-shot',
        displayName: 'Few-shot',
        description: 'Apprentissage par l\'exemple. Fournis 2-5 exemples input/output pour guider l\'IA.',
        requiredSections: ['goal', 'few_shot_examples'],
        optionalSections: ['profil', 'context', 'constraints', 'format'],
        compatibleModels: ['claude', 'gpt', 'gemini', 'llama', 'deepseek'],
        useCases: ['Classification', 'Traduction', 'Formatage consistant', 'Extraction de données'],
        template: {
            profil: 'Tu es un expert en reconnaissance de patterns et en application de règles par l\'exemple.',
            goal: 'Analyse les exemples fournis, identifie le pattern, puis applique-le au nouveau cas.\n\n[DÉCRIS LA TÂCHE SPÉCIFIQUE ICI]',
            few_shot_examples: '### Exemple 1\nInput: "Le produit est vraiment génial, je recommande !"\nOutput: Positif\n\n### Exemple 2\nInput: "Service client inexistant, déçu."\nOutput: Négatif\n\n### Exemple 3\nInput: "Correct, sans plus."\nOutput: Neutre\n\n---\n### Nouveau cas à traiter\nInput: [TON TEXTE ICI]\nOutput: ?',
            constraints: '- Applique exactement le même format que les exemples\n- Ne dévie pas du pattern établi\n- En cas d\'ambiguïté, choisis la catégorie la plus proche',
            format: 'Retourne uniquement le label de classification, sans explication sauf si demandé.'
        }
    },
    'chain-of-thought': {
        id: 'chain-of-thought',
        displayName: 'Chain of Thought (CoT)',
        description: 'Raisonnement étape par étape. L\'IA explicite son processus de réflexion avant de conclure.',
        requiredSections: ['goal', 'reasoning_steps'],
        optionalSections: ['profil', 'context', 'examples', 'thinking_process', 'constraints'],
        compatibleModels: ['claude', 'gpt', 'gemini', 'deepseek'],
        useCases: ['Problèmes mathématiques', 'Logique complexe', 'Analyse multi-étapes', 'Décisions argumentées'],
        template: {
            profil: 'Tu es un expert en raisonnement logique et en résolution de problèmes complexes.',
            goal: '[DÉCRIS TON PROBLÈME ICI]\n\nRésous ce problème en expliquant chaque étape de ton raisonnement avant d\'arriver à la conclusion.',
            reasoning_steps: '1. **Comprendre** : Reformule le problème dans tes propres mots\n2. **Identifier** : Liste les données, variables et contraintes clés\n3. **Planifier** : Décris ta stratégie de résolution\n4. **Exécuter** : Applique ta méthode étape par étape\n5. **Vérifier** : Contrôle ta réponse en la testant\n6. **Conclure** : Formule ta réponse finale clairement',
            thinking_process: 'Pense à voix haute. Montre ton travail. Si tu hésites entre plusieurs approches, explique pourquoi tu en choisis une.',
            constraints: '- Ne saute pas d\'étapes\n- Si tu détectes une erreur, corrige-la explicitement\n- Indique ton niveau de confiance final'
        }
    },
    'react': {
        id: 'react',
        displayName: 'ReAct (Reasoning + Acting)',
        description: 'Alternance entre réflexion et action. L\'IA pense, agit, observe, puis répète.',
        requiredSections: ['goal', 'reasoning_steps', 'thinking_process'],
        optionalSections: ['profil', 'context', 'constraints', 'format'],
        compatibleModels: ['claude', 'gpt', 'gemini'],
        useCases: ['Recherche d\'information', 'Tâches interactives', 'Agents autonomes', 'Débogage'],
        template: {
            profil: 'Tu es un agent autonome capable de raisonner et d\'agir de manière itérative pour accomplir des tâches complexes.',
            goal: '[DÉCRIS LA TÂCHE À ACCOMPLIR]\n\nUtilise le cycle Thought/Action/Observation pour progresser méthodiquement.',
            reasoning_steps: 'Pour chaque itération, suis ce format :\n\n**Thought 1:** [Ce que tu penses devoir faire et pourquoi]\n**Action 1:** [L\'action concrète que tu effectues]\n**Observation 1:** [Ce que tu observes comme résultat]\n\n**Thought 2:** [Analyse de l\'observation et prochaine étape]\n**Action 2:** [Action suivante]\n**Observation 2:** [Résultat]\n\n... continue jusqu\'à la résolution.',
            thinking_process: 'À chaque étape :\n- Thought : Réfléchis à l\'état actuel et ce qui reste à faire\n- Action : Effectue UNE action précise et observable\n- Observation : Note factuellement le résultat\n\nSi une action échoue, adapte ta stratégie.',
            constraints: '- Maximum 10 itérations\n- Chaque action doit être concrète et vérifiable\n- Termine par une synthèse finale'
        }
    },
    'tree-of-thoughts': {
        id: 'tree-of-thoughts',
        displayName: 'Tree of Thoughts (ToT)',
        description: 'Exploration de multiples chemins de raisonnement en parallèle, puis sélection du meilleur.',
        requiredSections: ['goal', 'reasoning_steps', 'thinking_process'],
        optionalSections: ['profil', 'context', 'constraints', 'output_schema'],
        compatibleModels: ['claude', 'gpt'],
        useCases: ['Problèmes créatifs', 'Planification', 'Décisions complexes', 'Puzzles'],
        template: {
            profil: 'Tu es un stratège expert capable d\'explorer simultanément plusieurs pistes de réflexion et de converger vers la solution optimale.',
            goal: '[DÉCRIS TON PROBLÈME COMPLEXE ICI]\n\nExplore au moins 3 approches différentes avant de choisir la meilleure.',
            reasoning_steps: '## Phase 1 : Génération des branches\n\n**Branche A :** [Première approche]\n- Principe : ...\n- Étapes clés : ...\n\n**Branche B :** [Deuxième approche]\n- Principe : ...\n- Étapes clés : ...\n\n**Branche C :** [Troisième approche]\n- Principe : ...\n- Étapes clés : ...\n\n## Phase 2 : Évaluation\n\n| Branche | Avantages | Inconvénients | Score /10 |\n|---------|-----------|---------------|----------|\n| A | ... | ... | ? |\n| B | ... | ... | ? |\n| C | ... | ... | ? |\n\n## Phase 3 : Développement de la branche choisie\n\n[Détaille la solution complète]',
            thinking_process: 'Pense comme un arbre de décision :\n1. Diverge : génère des options diverses\n2. Évalue : note chaque option objectivement\n3. Converge : développe la meilleure\n4. Valide : vérifie que c\'est bien la solution optimale',
            constraints: '- Minimum 3 branches distinctes\n- Évaluation objective avec critères explicites\n- Justifie ton choix final'
        }
    },
    'self-consistency': {
        id: 'self-consistency',
        displayName: 'Self-Consistency',
        description: 'Génère plusieurs réponses indépendantes puis sélectionne la plus cohérente ou la plus fréquente.',
        requiredSections: ['goal', 'reasoning_steps', 'constraints'],
        optionalSections: ['profil', 'context', 'few_shot_examples'],
        compatibleModels: ['claude', 'gpt', 'gemini'],
        useCases: ['Mathématiques', 'Questions factuelles', 'Validation de réponses', 'Réduction d\'erreurs'],
        template: {
            profil: 'Tu es un expert en vérification et validation, capable de croiser plusieurs raisonnements indépendants.',
            goal: '[DÉCRIS TON PROBLÈME ICI]\n\nRésous ce problème 3 fois de manière indépendante, puis compare les résultats.',
            reasoning_steps: '## Raisonnement 1 (Approche directe)\n[Résous le problème une première fois]\n→ Conclusion 1 : ...\n\n## Raisonnement 2 (Approche alternative)\n[Résous avec une méthode différente]\n→ Conclusion 2 : ...\n\n## Raisonnement 3 (Vérification)\n[Résous encore différemment ou vérifie]\n→ Conclusion 3 : ...\n\n## Synthèse\n- Conclusions identiques : ✓/✗\n- Réponse majoritaire : ...\n- Niveau de confiance : ...%\n\n**Réponse finale :** ...',
            constraints: '- Chaque raisonnement doit être réellement indépendant\n- N\'influence pas un raisonnement par les précédents\n- Si divergence, analyse pourquoi et choisis la réponse la plus solide'
        }
    },
    'role-prompting': {
        id: 'role-prompting',
        displayName: 'Role Prompting',
        description: 'L\'IA adopte un rôle ou une persona spécifique pour influencer son style et son expertise.',
        requiredSections: ['profil', 'goal'],
        optionalSections: ['context', 'constraints', 'tone', 'audience'],
        compatibleModels: ['claude', 'gpt', 'gemini', 'llama', 'deepseek'],
        useCases: ['Expertise spécialisée', 'Style d\'écriture', 'Simulation', 'Créativité'],
        template: {
            profil: 'Tu es [RÔLE PRÉCIS], expert reconnu en [DOMAINE].\n\n**Background :**\n- [X] années d\'expérience dans [secteur]\n- Spécialisé en [compétences clés]\n- Connu pour [trait distinctif]\n\n**Style de communication :**\n- [Formel/Informel/Technique/Vulgarisé]\n- [Direct/Nuancé/Pédagogue]\n- [Autres traits de personnalité]',
            goal: 'En tant que [rôle], ta mission est de :\n\n[DÉCRIS LA TÂCHE SPÉCIFIQUE]\n\nApplique ton expertise pour fournir une réponse de qualité professionnelle.',
            context: '[Contexte de la situation, informations de background pertinentes pour le rôle]',
            tone: '[Définis le ton attendu : expert mais accessible, autoritaire, bienveillant, etc.]',
            audience: '[Qui est le destinataire ? Niveau d\'expertise ? Attentes ?]',
            constraints: '- Reste dans le personnage tout au long\n- Utilise le vocabulaire propre au domaine\n- Si tu ne sais pas, dis-le comme le ferait ce professionnel'
        }
    },
    'structured-output': {
        id: 'structured-output',
        displayName: 'Structured Output',
        description: 'Force une sortie dans un format structuré précis (JSON, XML, tableau).',
        requiredSections: ['goal', 'output_schema', 'format'],
        optionalSections: ['profil', 'context', 'few_shot_examples', 'constraints'],
        compatibleModels: ['claude', 'gpt', 'gemini', 'llama', 'deepseek'],
        useCases: ['APIs', 'Extraction de données', 'Intégration système', 'Parsing automatisé'],
        template: {
            profil: 'Tu es un extracteur de données expert, capable de parser des informations et les structurer dans des formats précis.',
            goal: '[DÉCRIS LES DONNÉES À EXTRAIRE OU GÉNÉRER]\n\nRetourne les informations dans le format structuré spécifié ci-dessous.',
            output_schema: '```json\n{\n  "metadata": {\n    "source": "string",\n    "date": "YYYY-MM-DD",\n    "confidence": "number (0-1)"\n  },\n  "data": [\n    {\n      "id": "string",\n      "field1": "string",\n      "field2": "number",\n      "tags": ["string"]\n    }\n  ],\n  "summary": "string"\n}\n```',
            format: 'Retourne UNIQUEMENT le JSON valide.\n- Pas de texte avant ou après\n- Pas de commentaires dans le JSON\n- Utilise null pour les valeurs manquantes\n- Les nombres sans guillemets',
            constraints: '- Le JSON doit être valide et parsable\n- Respecte exactement le schéma fourni\n- Si une information est incertaine, utilise le champ confidence',
            few_shot_examples: '### Exemple\nInput: "Marie Dupont, 32 ans, développeuse senior chez TechCorp"\nOutput:\n```json\n{"name": "Marie Dupont", "age": 32, "role": "développeuse senior", "company": "TechCorp"}\n```'
        }
    }
};