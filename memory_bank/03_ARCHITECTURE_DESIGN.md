# 03 - Architecture Design

---

## 1. Architectural Pattern

L’application suPrompts est une **Single Page Application front-end légère**, servie en statique, sans backend applicatif.

- Tout le code d’exécution réside dans le navigateur (HTML/CSS/JavaScript).
- La persistance se fait via `localStorage` (prompts nommés, versions, dernière session).
- L’interface est structurée en trois panneaux principaux (sections, éditeur, prompt final) mais reste une seule page HTML.

## 2. High-Level Diagram

Vue simplifiée des interactions de l’application :

```mermaid
graph TD
    A[Navigateur (suPrompts)] --> B[UI 3 colonnes\nSections / Éditeur / Prompt final]
    A --> C[localStorage\n(prompts, versions, dernière session)]
    A --> D[Fichiers JSON importés / exportés]
```

## 3. Core Components

Description des principaux fichiers et répertoires du projet :

- **`index.html` :** Structure principale de la page, définition des panneaux, des boutons et des sélecteurs (sections, format, templates, outils avancés, etc.).
- **`assets/css/style.css` :** Styles de l’interface (layout 3 colonnes, responsive, boutons, animations, overlay de comparaison A/B, panneau d’analyse, etc.).
- **`assets/js/main_v2.js` :** Logique applicative front-end :
  - gestion des cartes (ajout, suppression, contenu, ordre),
  - génération du prompt final selon le format choisi,
  - persistance dans `localStorage` (prompts nommés, versions, dernière session),
  - gestion des prompts nommés et de leurs versions,
  - système de templates,
  - indicateur de complétude et analyse de qualité,
  - overlay de comparaison A/B et comportement responsive.
- **`memory_bank/` :** Documentation projet (vue d’ensemble, roadmap, stack technique, architecture, processus, etc.).
