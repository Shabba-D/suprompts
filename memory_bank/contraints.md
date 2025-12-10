## 1. Contraintes / risques techniques

- Front‑only + localStorage comme “pseudo‑backend”
- - Limite de taille (quelques Mo) selon le navigateur → risque de saturation si beaucoup de prompts/versionnage.
- - Données liées à un seul navigateur / profil → pas de synchro, pas de backup natif → risque de perte en cas de nettoyage de cache ou changement de machine.
- Compatibilité navigateur & vieillissement du code
- - Dépendance forte à quelques APIs Web (Clipboard, localStorage, layout responsive, etc.) → comportements parfois différents (Safari, Firefox, navigateurs d’entreprise verrouillés).
- - Sans CI/tests, chaque refactor ou nouvelle feature peut casser un comportement dans un navigateur minoritaire.
- Performance & ergonomie sur gros volumes
- - Liste de prompts / variantes stockée entièrement côté client → si l’utilisateur “collectionne” des dizaines/centaines de prompts, risque de :
- - - lenteurs (rendering DOM, filtres, tri),
- - - UI qui devient difficile à naviguer (liste longue, surcharge cognitive).
- Offline / mise à jour de l’application
- - L’app est “offline‐friendly” mais pas une vraie PWA aujourd’hui :
- - - Sans cache de version (Service Worker), les mises à jour peuvent surprendre (break d’anciens prompts si structure JSON change),
- - - Pas de gestion de migration de schéma localStorage → risque de données corrompues après une grosse évolution.

## 2. Contraintes / risques organisationnels / temps

- Projet solo / side project
- - Capacité limitée pour :
- - - corriger rapidement les bugs,
- - - suivre les évolutions d’UX / navigateur,
- - - faire de la doc utilisateur.
- - Risque que des parties du code deviennent “intouchables” faute de temps pour les refactor proprement.
- Dette technique vs roadmap ambitieuse
- - Roadmap déjà fournie (historique, A/B, analyse qualité, responsive, templates, etc.) → risque de superposer des couches de features sans nettoyage systématique.
- - Sans discipline de refactor, la file main_v2.js peut devenir difficile à maintenir (complexité croisée entre persistance, UI, analyse, comparaison A/B).
- Maintenance à long terme et support
- - Suivi d’issues/retours (surtout si l’outil est publié publiquement) peut devenir chronophage.
- - Décalage possible entre ce que promet la doc / le site et ce qui est vraiment maintenu (par ex. certaines features “expérimentales” qui cassent silencieusement).

## 3. Contraintes / risques écologiques / sobriété

- Limitation des appels aux API d’IA (future extension)
- - Aujourd’hui, pas d’appel IA → très sobre.
- - Demain, si tu ajoutes l’analyse IA (score, recommandations) :
- - - risque de sur‑sollicitation de l’API si l’utilisateur clique souvent,
- - - tentation d’appels “à chaque frappe” ou à chaque autosave → explosion de consommation côté LLM.
- Stockage local et taille des prompts
- - Prompts + historique de versions + exemples longs → localStorage peut grossir vite.
- - En soi, l’impact écologique est faible, mais :
- - - plus de données à synchroniser/backuper côté utilisateur,
- - - risque de garder indéfiniment des données inutiles (aucune politique d’expiration/clean‑up).
- Tracking et analytics
- - Si tu ajoutes un jour des analytics classiques (Google Analytics, etc.) :
- - - risque d’amener un tracking lourd et peu utile pour un outil de niche,
- - - contradiction potentielle avec la promesse de sobriété / confidentialité (outil local).

## 4. Contraintes / risques légaux & éthiques

- Données sensibles dans les prompts
- - Cas très probable : utilisateurs collent des infos sensibles (santé, RH, juridique, stratégies internes, données clients).
- - Même sans backend, ces données sont :
- - - stockées en clair dans localStorage,
- - - potentiellement exportées en JSON → risque de fuite si le fichier traîne dans un drive/email.
- RGPD & responsabilité
- - Tu ne traites pas ces données côté serveur, mais :
- - - tu fournis un outil qui facilite leur stockage, leur export et leur partage,
- - - tu peux être attendu a minima sur :
- - - - une mise en garde claire (“ne mettez pas X/Y/Z dans vos prompts”),
- - - - une explication de ce qui est stocké localement et comment le supprimer.
- Export / partage de prompts
- - Les fichiers JSON exportés peuvent contenir :
- - - des données personnelles de tiers,
- - - des infos business confidentielles.
- - Aucun mécanisme d’anonymisation ou de “clean” → risque que des gens partagent ces fichiers sans mesurer ce qu’ils contiennent.
- Intégration future d’API d’IA
- - Si tu envoies un jour des prompts vers une API :
- - - obligation d’informer clairement l’utilisateur de ce qui part, vers qui, et sous quelles conditions,
- - - question du stockage côté fournisseur (logs d’API, entraînement éventuel sur les données),
- - - gestion de l’API key (pas l’exposer, pas l’enregistrer en clair).
- Synthèse des contraintes vraiment structurantes
- - Techniquement : front‑only + localStorage =
- - - très bon pour la simplicité,
- - - mais limite forte sur la persistance (sauvegarde, migration, multi‑device, volume de données).
- - Organisationnellement : projet solo + roadmap riche =
- - - nécessité de garder l’appli simple et de limiter la dette,
- - - choisir quelques features “cœur” et assumer de ne pas tout faire.
- - Légal / éthique :
- - - besoin d’un discours clair dans l’UI sur la nature locale de l’outil et les bonnes pratiques (pas de données ultra‑sensibles, bien gérer les exports),
- - - vigilance accrue dès que tu ajouteras une API d’IA.
