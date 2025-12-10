# Roadmap suPrompts – implémentation des idées

## Objectifs généraux

- Clarifier et structurer les fonctionnalités à implémenter.
- Prioriser les "quick wins" pour améliorer rapidement l’expérience.
- Prévoir une montée en complexité progressive (persistance, formats, analyse avancée).

---

## Phase 1 – Quick wins UX/UI (améliorations visibles rapides)

### 1.1. Bouton "Copy full prompt"

- [x] Ajouter un bouton bien visible dans la colonne de droite.
- [x] Action : copier l’intégralité du contenu du prompt dans le presse-papiers.
- [x] Afficher un petit message de confirmation (ex. "Prompt copié").

### 1.2. Lisibilité et hiérarchie visuelle

- [x] Renforcer la séparation visuelle entre les trois colonnes (légères bordures / espacements / fonds).
- [x] Mettre davantage en avant les titres de colonnes (taille, couleur, alignement).
- [x] Vérifier le comportement responsive minimum (taille fenêtre réduite sur desktop).

### 1.3. Confort d’édition des cartes

- [x] Ajuster la hauteur des `textarea` (valeur par défaut + possibilité de resize).
- [x] Ajouter un bouton "Clear" par carte pour vider rapidement le contenu.
- [x] Afficher le nombre de caractères par carte (indication légère).

**Critère de fin de phase 1 :**

- Copier-coller du prompt possible en un clic.
- L’interface est plus lisible et agréable sans refonte majeure.

---

## Phase 2 – Persistance et gestion de prompts

### 2.1. Sauvegarde automatique (localStorage)

- [x] Définir un schéma de données pour un "prompt" (sections + contenu + métadonnées de base).
- [x] À chaque modification de carte, sauvegarder l’état courant dans `localStorage`.
- [x] Au chargement de la page, restaurer automatiquement le dernier prompt.

### 2.2. Liste de prompts récents / favoris

- [x] Ajouter une petite zone (ou modal) pour lister les prompts disponibles (titre + date).
- [x] Permettre :
  - [x] Charger un prompt existant.
  - [x] Supprimer un prompt.
  - [x] Marquer un prompt comme "favori".

### 2.3. Export / import JSON

- [x] Implémenter un bouton "Exporter" qui génère un fichier `.json` du prompt courant.
- [x] Implémenter un bouton "Importer" qui permet de charger un `.json` et remplir les cartes.
- [x] Valider la structure du JSON avant import (messages d’erreur clairs).

**Critère de fin de phase 2 :**

- L’utilisateur ne perd plus son travail en fermant l’onglet.
- Il peut sauvegarder, recharger, exporter et importer ses prompts.

---

## Phase 3 – Formats, templates et qualité du prompt

### 3.1. Support d’autres formats de sortie

- [x] Ajouter au sélecteur de format : JSON et YAML.
- [x] Définir un mapping clair des sections vers les clés du JSON/YAML.
- [x] Générer une sortie bien formattée (indentation, guillemets, échappement basique).

### 3.2. Templates / modes prédéfinis

- [x] Définir quelques templates de base :
  - [x] Question simple.
  - [x] Analyse de texte.
  - [x] Génération de code.
  - [x] Agent / outil (persona + instructions + format strict).
- [x] Au choix d’un template :
  - [x] Préconfigurer les sections actives / leur ordre.
  - [x] Pré-remplir éventuellement certains textes d’exemple.

### 3.3. Sections obligatoires vs optionnelles + checklist de qualité

- [x] Marquer dans l’UI les sections recommandées (ex. Goal, Context) vs optionnelles.
- [x] Afficher un indicateur de complétude (X sections remplies sur Y recommandées).
- [x] Messages d’avertissement légers :
  - [x] "Pas de contexte fourni".
  - [x] "Aucun exemple donné".

**Critère de fin de phase 3 :**

- L’utilisateur peut choisir un mode d’usage adapté à son cas.
- La sortie est disponible dans plusieurs formats.
- L’outil l’aide à construire des prompts plus complets.

---

## Phase 4 – Historique, versions et fonctionnalités avancées

### 4.1. Historique, variantes et ergonomie des sauvegardes

- [x] État actuel du système de sauvegarde :

  - [x] Prompts nommés stockés dans `localStorage` avec métadonnées de base (nom, cartes, date de mise à jour, favori).
  - [x] Gestion de variantes par nom (`Nom`, `Nom 2`, `Nom 3`, …) via le bouton « Version ».
  - [x] Liste déroulante des prompts avec favoris, chargement et suppression.
  - [x] Zone « Outils avancés » repliable regroupant export/import JSON et gestion détaillée des prompts.
  - [x] Anciennes versions horodatées encore lisibles (pour l’overlay A/B), mais plus de création de nouvelles versions horodatées.

- [ ] Évolutions à concevoir pour un système d’historique plus clair et une meilleure ergonomie :

  - [ ] Repenser l’organisation visuelle de la zone de sauvegarde / chargement / suppression / import / export / modèles pour que l’ensemble soit plus lisible et intuitif.
  - [ ] Clarifier, dans l’interface, la différence perçue entre :
        « Sauvegarder », « Version », « Charger », « Importer », « Exporter ».
  - [ ] Décider si l’on garde un véritable système d’historique (snapshots) ou si l’on s’appuie uniquement sur les prompts nommés + variantes, puis adapter l’UI en conséquence.
  - [ ] Faciliter l’accès aux travaux récents (ex. liste chronologique, tags, regroupement par « projet » ou contexte).
  - [ ] Simplifier la navigation entre prompts enregistrés, variantes et modèles pour réduire la charge cognitive.

### 4.2. Comparaison A/B de prompts

- [x] Permettre de dupliquer un prompt pour créer une variante.
- [x] Vue de comparaison côte à côte :
  - [x] Sections alignées.
  - [ ] Possibilité de copier une section de A vers B.

### 4.3. Analyse automatique (future intégration API)

- [x] Concevoir l’interface pour :
  - [x] Afficher un "score de qualité" du prompt.
  - [x] Afficher des recommandations (ex. manque d’exemples, contraintes floues).
- [x] Prévoir un point d’extension pour brancher ultérieurement une API d’analyse.

### 4.4. Revoir la disposition des outils

- [x] Simplifier la zone de sauvegarde :

  - [x] Mettre en place un nouveau modèle de sauvegarde basé sur des variantes de prompts :
    - [x] Rendre le champ « Nom du prompt » **obligatoire** pour toute sauvegarde.
    - [x] Bouton « Sauvegarder » :
      - [x] Si le champ est vide : demander un nom (message / dialogue) et ne pas sauvegarder tant qu’il est vide.
      - [x] Si un prompt portant ce nom existe déjà : mettre à jour ce prompt avec l’état courant (sans créer de version horodatée).
      - [x] Si aucun prompt ne porte encore ce nom : créer un nouveau prompt nommé avec l’état courant.
    - [x] Bouton « Version » :
      - [x] Si le champ est vide : demander un nom comme pour « Sauvegarder ».
      - [x] Si le nom n’existe pas encore : sauvegarder d’abord ce nom comme prompt de base.
      - [x] Calculer un nom de variante en suffixant le nom de base (`Nom`, `Nom_1`, `Nom_2`, …) en prenant le prochain indice disponible.
      - [x] Créer un nouveau prompt avec ce nom de variante en dupliquant l’état courant, puis basculer le champ de nom et la sélection sur cette variante.
    - [x] Cesser de créer de nouvelles versions horodatées dans le système de versions interne, tout en continuant à lire/afficher les anciennes versions existantes pour ne pas perdre les données locales.

- [x] Regrouper les outils avancés derrière une icône / zone escamotable :

  - [x] Masquer par défaut :
    - [x] Export JSON.
    - [x] Import JSON.
    - [x] Liste détaillée des prompts (sélecteur, suppression, favori, etc.).
  - [x] Afficher ces outils au survol / clic sur une icône (ex. engrenage ou « Outils avancés »).

- [x] Réorganiser les contrôles autour du prompt final :

  - [x] Mettre sur la même ligne :
    - [x] Sélecteur de format (Markdown / XML / JSON / YAML).
    - [x] Sélecteur de modèle (template).
  - [x] Placer ces contrôles à proximité du prompt final pour renforcer le lien visuel.

- [x] Unifier les actions principales sur le prompt :

  - [x] Aligner sur une même ligne :
    - [x] Bouton « Compare » (A/B).
    - [x] Bouton « Copy full prompt ».

- [x] Fusionner les recommandations dans un seul panneau de qualité :
  - [x] Regrouper l’indicateur de complétude et l’analyse automatique.
  - [x] Afficher :
    - [x] Un indicateur de complétude (sections recommandées remplies).
    - [x] Un score sur 100.
    - [x] Une seule liste de recommandations (problèmes détectés + pistes d’amélioration).

### 4.5. Étoffer les modèles proposés

- [x] Améliorer les templates existants :

  - [x] Clarifier les textes par défaut (objectif, contexte, contraintes).
  - [x] Ajouter des exemples concrets là où c’est pertinent.
  - [x] Mieux expliciter le ton et le format attendu.

- [x] Créer des profils de modèles « atypiques » :

  - [x] Profils de critique :
    - [x] Critique sévère (très exigeant, axé sur les faiblesses).
    - [x] Critique bienveillant (constructif, met en avant les forces).
    - [x] « Avocat du diable » (cherche les failles et contre-arguments).
  - [x] Profils pédagogiques :
    - [x] Tuteur socratique (pose surtout des questions).
    - [x] Coach pour débutant (explications très guidées).
  - [x] Profils de validation :
    - [x] Vérificateur de contraintes (checklist stricte des règles à respecter).
    - [x] Relecteur de clarté (se focalise sur la compréhension par un lecteur humain).

- [x] Structurer les templates dans le code pour faciliter les ajouts futurs :
  - [x] Centraliser tous les modèles dans une structure unique (objet de configuration).
  - [x] Prévoir des champs pour :
    - [x] Persona.
    - [x] Goal / objectif.
    - [x] Contexte.
    - [x] Contraintes.
    - [x] Format de sortie.
    - [x] Exemples.

### 4.6. Durcissement & francisation

#### 4.6.1. Nettoyage et factorisation du code

- [x] Supprimer les éléments obsolètes ou non utilisés (anciens panneaux, sélecteurs redondants, variables DOM inutilisées, fonctions mortes).
- [x] Factoriser les morceaux de logique dupliqués lorsque c’est pertinent (ex. formatage de dates, tri des listes, utilitaires partagés entre prompts nommés / versions / overlay A/B).
- [x] Clarifier la structure de `main_v2.js` en regroupant les sections par grande fonctionnalité (cartes, persistance, prompts nommés, versions, templates, analyse, A/B, responsive) et en ajoutant des séparateurs lisibles.

#### 4.6.2. Francisation et cohérence de l’interface

- [ ] Passer en revue tous les textes visibles dans l’interface (titres, boutons, tooltips, messages) et les traduire / harmoniser en français.
- [ ] Vérifier la cohérence du vocabulaire employé (ex. : « prompt » vs « consigne », « modèle » vs « template ») et choisir une terminologie stable.
- [ ] Laisser le code, les commentaires et les docstrings en anglais (convention technique), tout en gardant l’interface utilisateur en français.

#### 4.6.3. Mini audit de sécurité (front local)

- [ ] Vérifier l’absence d’insertions HTML non contrôlées à partir de contenu utilisateur (préférer `textContent` à `innerHTML` dès que possible).
- [ ] Vérifier le flux d’import JSON (validation minimale des champs avant utilisation, gestion des erreurs de parsing, absence d’exécution de contenu arbitraire).
- [ ] Vérifier l’usage de `localStorage` (clés dédiées à l’application, pas d’enregistrement de données sensibles, gestion propre des structures stockées).
- [ ] Documenter une courte checklist de points de vigilance sécurité à relire avant chaque évolution majeure.

**Critère de fin de phase 4 :**

- L’utilisateur peut travailler sur plusieurs variantes.
- L’outil l’aide à améliorer ses prompts de manière plus intelligente.

---

## Phase 5 – Responsive et expérience multi-device

### 5.1. Comportement sur petits écrans

- [x] Définir le comportement cible sur mobile / petites fenêtres :
  - [x] Passage éventuel à une vue en onglets (Sections / Édition / Prompt final).
  - [x] Ajustement des marges, tailles de police et hauteurs de blocs.
- [ ] Tester sur plusieurs largeurs (mobile, tablette, desktop).

### 5.2. Finitions UI

- [ ] Ajuster les espacements, contrastes et alignements.
- [ ] Ajouter éventuellement des icônes aux cartes de section (persona, contraintes, etc.).
- [ ] Ajouter des tooltips avec exemples concrets au survol des sections.

**Critère de fin de phase 5 :**

- L’application reste utilisable et confortable sur des résolutions variées.

---

## Notes de mise en œuvre

- Commencer chaque phase par de petites tâches isolées (PRs courtes, faciles à tester).
- Ajouter progressivement des tests manuels (et éventuellement automatisés) au fur et à mesure.
- Toujours vérifier que le comportement de base (création de cartes, génération de prompt) reste intact après chaque changement.

.

**Vue d'ensemble EcoloIT / forêt de suPrompts**

- **Tronc : la forme générale du produit**

  - Le tronc de la "forêt suPrompts" est clair : un atelier de conception de prompts qui transforme un matériau brut (idées, user stories, prompts épars) en structures lisibles et réutilisables.
  - La sève qui circule dans ce tronc, ce sont les conversations récurrentes avec l'IA : suPrompts vise à canaliser ce flux pour qu'il nourrisse une mémoire vivante plutôt qu'une succession de chats jetables.

- **Branches maîtresses : les grandes familles d'usages**

  - Trois grosses branches sortent du tronc :
    - les ateliers clients,
    - la spécification de features IA,
    - l'industrialisation de prompts récurrents.
  - Elles partagent le même bois (les mêmes cartes Persona/Goal/Context/Constraints/Format/Examples), mais se déploient vers des canopées différentes : pédagogie, spec produit, productivité individuelle.

- **Ramifications fines : fonctionnalités et UI**

  - Les cartes, le stockage local, le versionnage léger, l'export JSON/Markdown, la comparaison A/B, le score de complétude : ce sont les petites branches et rameaux qui détaillent la forme globale.
  - Si le tronc reste sain (vision, personas, périmètre) et que les branches principales sont bien positionnées, ces ramifications peuvent pousser progressivement, être taillées ou remplacées sans mettre en danger l'ensemble.

- **Racines : contraintes invisibles mais structurantes**

  - Sous le sol, on trouve les racines techniques (front‑only, localStorage, compatibilité navigateur), organisationnelles (projet solo, temps limité) et éthiques/légales (prompts sensibles, éventuelles futures APIs IA).
  - Elles limitent certains développements (pas de backend, pas de synchro multi‑device par défaut), mais elles apportent aussi une stabilité : simplicité d'architecture, sobriété, maîtrise locale des données.
  - Si ces racines sont négligées (absence de stratégie de backup, dette technique qui s'accumule, flou sur les usages sensibles), l'ensemble de la forêt devient vulnérable aux tempêtes.

- **Canopée et sous‑bois : écosystème et cohabitation**

  - Dans la canopée, suPrompts cohabite avec d'autres espèces d'outils : Notion, Obsidian, systèmes internes, interfaces de chat IA. Il doit accepter de ne pas tout faire, mais de proposer un bois bien dessiné là où il est légitime.
  - Dans le sous‑bois, les utilisateurs accumulent des prompts, des variantes, des presets : si rien n'est structuré, on obtient une friche illisible ; si des sentiers (tags, projets, conventions de nommage) sont tracés, la promenade reste fluide.

- **Recommandations fractales (de l'arbre à la forêt)**

  1. **Soigner le tronc avant d'ajouter des branches fines** : verrouiller un MVP simple et robuste (éditeur en cartes, stockage local, versionnage léger, exports JSON/Markdown) avant d'étendre le feuillage (A/B, scoring, intégrations).
  2. **Élaguer régulièrement** : prévoir des temps de refactor pour couper les branches mortes (features peu utilisées, bouts de code difficiles à maintenir) et simplifier les formes trop compliquées.
  3. **Surveiller les racines** : expliciter dans l'UI les limites de la persistance locale et les bonnes pratiques de confidentialité ; réfléchir tôt aux migrations de schéma localStorage et aux scénarios de backup.
  4. **Cultiver des clairières d'expérimentation** : isoler les fonctionnalités expérimentales (analyse IA, intégrations avancées) dans des zones identifiées pour éviter qu'elles n'envahissent le cœur du produit.
  5. **Observer la forêt dans le temps** : utiliser les trois scénarios d'usage comme repères pour prioriser ; vérifier périodiquement que chaque nouvelle "branche" améliore au moins l'un d'eux sans déséquilibrer l'ensemble.- **Cohérence vision ↔ fonctionnalités**

  - La vision (structurer, industrialiser, capitaliser des prompts) est directement reflétée dans les fonctionnalités cœur : éditeur en cartes, stockage local, versionnage, exports structurés.
  - Le choix du front‑only va dans le sens d'une **sobriété technique** et d'une meilleure confidentialité des données, au prix assumé de limitations (synchro, backup, volume).

- **Forces du projet**

  - Ciblage clair de personas avancés (consultants, PM/PO, power users) avec des scénarios d'usage concrets.
  - Positionnement d'"atelier de prompts" assez distinct des simples interfaces de chat ou des bibliothèques de prompts génériques.
  - Simplicité architecturale : pas de backend, pas de dépendances serveurs, déploiement facile.

- **Risques et points de vigilance**

  - Risque de **dette technique** si les nouvelles fonctionnalités (A/B, score, intégrations) sont superposées sans refactor des bases (persistance, UI, logique d'analyse).
  - Fragilité de la persistance localStorage (perte possible de données lors d'un nettoyage ou d'un changement de machine) : nécessite des garde‑fous UX et une communication claire.
  - Enjeux légaux/éthiques autour des données sensibles dans les prompts et, à terme, des appels API IA (si ajoutés).

- **Opportunités de standardisation**

  - Définir un **modèle de structuration** de prompts (sections, conventions de nommage) qui puisse être réutilisé dans d'autres outils (Notion, systèmes internes, etc.).
  - Stabiliser un **schéma JSON** simple et documenté pour l'export/import, réutilisable dans d'autres contextes (outils internes, scripts d'orchestration).

- **Opportunités de différenciation**

  - Promettre non pas "encore un chat IA" mais un **atelier méthodique de conception de prompts**, avec une forte lisibilité et une focalisation sur la qualité.
  - Affirmer un positionnement EcoloIT : outil local, sobre, sans tracking imposé, laissant la main à l'utilisateur sur ce qu'il enregistre et partage.

- **Recommandations clés**
  1. **Verrouiller un MVP simple mais solide** autour de l'éditeur en cartes, du stockage local des prompts nommés, du versionnage léger et des exports JSON/Markdown.
  2. **Prévoir dès maintenant des mécanismes de backup** (export guidé, rappels ponctuels) pour atténuer le risque de perte de données locales.
  3. **Limiter volontairement l'ambition fonctionnelle à court terme** pour éviter la dérive en "usine à gaz" et préserver la maintenabilité (surtout en projet solo).
  4. **Documenter clairement les bonnes pratiques de confidentialité** dans l'UI (données à éviter, gestion des exports), en anticipation d'usages sensibles.
  5. **Utiliser les trois scénarios clés comme boussole de priorisation** : chaque nouvelle feature doit améliorer clairement au moins un de ces scénarios (atelier, spec IA, industrialisation d'un prompt récurrent).
