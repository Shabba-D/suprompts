export const PROMPT_SECTIONS = {
    system_instructions: {
        label: 'Instructions système',
        description: 'Instructions de haut niveau pour configurer le comportement global de l\'IA. Ces instructions sont prioritaires et persistantes.',
        tooltip: 'Ex : Tu dois toujours vérifier tes sources. Ne jamais inventer de données. Répondre en français.'
    },
    profil: {
        label: 'Profil',
        description: 'Définissez le profil complet de l\'IA. Pensez à son rôle, mais aussi à son contexte : époque, localisation, statut social, etc.',
        tooltip: 'Ex : "Tu es un vieux sage du 18ème siècle", "Tu es une développeuse frontend à Paris", "Tu es un critique d\'art cynique."'
    },
    travail: {
        label: 'Travail',
        description: 'Quel est le métier ou la fonction spécifique du Persona ? Cela permet d’ancrer son expertise dans un domaine précis.',
        tooltip: 'Ex : Consultant marketing, poète, ingénieur en chef, coach sportif.'
    },
    localisation: {
        label: 'Localisation',
        description: 'Dans quel lieu (pays, région, ville), quelle langue ou quel cadre culturel le Persona doit-il opérer ? Ceci affine le contexte.',
        tooltip: 'Ex : France (langue française), Japon (culture et langue japonaises), contexte international anglophone.'
    },
    goal: {
        label: 'But',
        description: 'Quel est l’objectif principal de ce prompt ? Que doit accomplir l’IA ?',
        tooltip: 'Ex : Rédiger un e-mail de prospection, générer 5 idées de slogans, écrire une fonction Python.'
    },
    context: {
        label: 'Contexte',
        description: 'Décrivez le contexte global et fournissez les informations essentielles ou l’historique pertinent pour que l’IA comprenne bien la situation.',
        tooltip: 'Ex : Le client est mécontent suite à un bug. L’objectif est de le rassurer et de lui proposer une solution.'
    },
    audience: {
        label: 'Audience',
        description: 'À qui s’adresse la réponse de l’IA ? Précisez le public cible (experts, enfants, clients...) pour adapter le niveau de langage et la complexité.',
        tooltip: 'Ex : Des enfants de 10 ans, des directeurs techniques, des utilisateurs débutants.'
    },
    constraints: {
        label: 'Contraintes',
        description: 'Définissez les règles strictes que l’IA doit suivre : format de réponse (taille, structure), éléments à inclure ou à exclure, limites de contenu ou de style. C’est essentiel pour contrôler la sortie.',
        tooltip: 'Ex : Ne pas utiliser de jargon. La réponse doit faire moins de 200 mots. Exclure toute mention de prix.'
    },
    format: {
        label: 'Format',
        description: 'Spécifiez la structure de la réponse attendue : texte brut, Markdown (liste, tableau, titres), JSON, XML, YAML. Plus c’est précis, mieux c’est.',
        tooltip: 'Ex : Un tableau Markdown à 3 colonnes, un objet JSON avec les clés "nom" et "email", une liste à puces.'
    },
    tone: {
        label: 'Ton',
        description: 'Définissez le ton et le style de communication de l’IA (formel, amical, académique, humoristique, directif...). Cela influence directement la perception du message.',
        tooltip: 'Ex : Ton professoral et patient, style direct et concis, langage fleuri et poétique.'
    },
    examples: {
        label: 'Exemples',
        description: 'Fournissez des exemples concrets qui illustrent les entrées que recevra l’IA et les sorties que vous attendez, ou même des dialogues. C’est crucial pour affiner son comportement.',
        tooltip: 'Ex : Pour une traduction : [Input: "Hello world"] → [Output: "Bonjour le monde"].'
    },
    few_shot_examples: {
        label: 'Exemples Few-shot',
        description: 'Fournissez plusieurs exemples entrée/sortie formatés pour guider l’IA par démonstration. Chaque exemple doit illustrer le comportement attendu.',
        tooltip: 'Ex : Input: "2+2" → Output: "4" | Input: "5*3" → Output: "15"'
    },
    reasoning_steps: {
        label: 'Étapes de raisonnement',
        description: 'Définissez la structure de raisonnement que l’IA doit suivre (Chain of Thought). Décomposez le problème en étapes logiques explicites.',
        tooltip: 'Ex : 1) Analyser le problème, 2) Identifier les variables, 3) Appliquer la formule, 4) Vérifier le résultat.'
    },
    thinking_process: {
        label: 'Processus de réflexion',
        description: 'Guidez l’IA sur comment elle doit réfléchir avant de répondre. Utile pour les tâches complexes nécessitant une analyse approfondie.',
        tooltip: 'Ex : Avant de répondre, analyse les pour et contre, considère les alternatives, puis conclus.'
    },
    output_schema: {
        label: 'Schéma de sortie',
        description: 'Définissez précisément la structure de données attendue en sortie (JSON, XML, ou autre format structuré).',
        tooltip: 'Ex : {"name": string, "age": number, "skills": string[]}'
    },
    rhythm: {
        label: 'Rythme',
        description: 'Pour un contenu créatif (ex: musical, poétique), décrivez le tempo, la cadence, les variations et la dynamique souhaités.',
        tooltip: 'Ex : Tempo lent et constant, accélération progressive, structure AABA, rythme syncopé.'
    },
    ambiance: {
        label: 'Ambiance',
        description: 'Décrivez l’atmosphère générale, l’énergie ou l’émotion dominante attendue (calme, épique, sombre, joyeuse, mystérieuse...). Applicable au texte, à la musique ou à l’image.',
        tooltip: 'Ex : Une atmosphère mélancolique de fin d’automne, une énergie épique de bataille, un sentiment de mystère.'
    },
    performers: {
        label: 'Interprètes',
        description: 'Pour les créations audio/visuelles, précisez les voix, les instruments, les personnages ou les types d’acteurs à inclure ou à mettre en avant.',
        tooltip: 'Ex : Une voix de femme douce, un solo de guitare électrique, un duo de violoncelles.'
    },
    background: {
        label: 'Arrière-plan',
        description: 'Décrivez les éléments ou le décor qui doivent constituer l’arrière-plan de votre image ou scène visuelle.',
        tooltip: 'Ex : Une forêt brumeuse au crépuscule, une ville futuriste, un simple fond blanc.'
    },
    filter: {
        label: 'Filtre',
        description: 'Indiquez les effets visuels ou les post-traitements désirés : grain, flou, luminosité, contraste, saturation, teintes, etc.',
        tooltip: 'Ex : Effet noir et blanc très contrasté, filtre sépia, forte saturation des couleurs, léger flou d’arrière-plan.'
    },
    style: {
        label: 'Style',
        description: 'Définissez le style artistique ou visuel global : réaliste, bande dessinée, aquarelle, peinture à l\'huile, rendu 3D, pixel art, photo, etc.',
        tooltip: 'Ex : Style manga des années 90, peinture à l\'huile impressionniste, rendu 3D photoréaliste.'
    }
};