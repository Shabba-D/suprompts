# Suprompts - Optimiseur de Prompts

Application web pour créer des prompts optimisés pour différents modèles d'IA.

## 🚀 Fonctionnalités

### Modes d'interface

- **Mode Simple** : Interface épurée pour débutants
- **Mode Avancé** : Tous les contrôles visibles (technique, type de prompt)

### Modèles IA supportés

- **Claude** (Anthropic) - Préfère XML, excellent en raisonnement
- **GPT-4** (OpenAI) - Préfère Markdown, polyvalent
- **Gemini** (Google) - Flexible, bon en créativité
- **Mistral** - Préfère Markdown, efficace
- **LLaMA** (Meta) - Open-source, préfère le texte structuré

### Techniques de prompting

| Technique                  | Description                  | Usage                       |
| -------------------------- | ---------------------------- | --------------------------- |
| **Standard**               | Prompt classique             | Tâches simples              |
| **Chain of Thought (CoT)** | Raisonnement étape par étape | Problèmes complexes         |
| **Few-Shot**               | Exemples inclus              | Apprentissage par l'exemple |
| **Tree of Thoughts**       | Exploration de branches      | Décisions multiples         |
| **ReAct**                  | Raisonnement + Action        | Tâches interactives         |

### Formats de sortie

- Markdown (MD)
- XML
- JSON
- YAML

## 📖 Guide d'utilisation

### 1. Choisir un modèle

Sélectionnez le modèle IA cible. Le format et les recommandations s'adapteront automatiquement.

### 2. Sélectionner une technique

En mode Avancé, choisissez une technique adaptée à votre tâche :

- **Tâche simple** → Standard
- **Raisonnement** → Chain of Thought
- **Apprentissage** → Few-Shot

### 3. Remplir les sections

Cliquez sur les cartes de section pour les ajouter à votre prompt :

- **Profil** : Définir le rôle de l'IA
- **But** : Objectif principal
- **Contexte** : Informations de fond
- **Contraintes** : Règles à respecter
- **Format** : Structure attendue

### 4. Copier et utiliser

Cliquez sur "Copier" pour copier le prompt optimisé dans votre presse-papiers.

## 💾 Sauvegarde

- Les prompts sont sauvegardés automatiquement dans le navigateur (localStorage)
- Exportez vos prompts en JSON pour les sauvegarder
- Importez des prompts depuis un fichier JSON

## ⌨️ Raccourcis

| Action            | Raccourci            |
| ----------------- | -------------------- |
| Copier le prompt  | Bouton "Copier"      |
| Sauvegarder       | Bouton "Sauvegarder" |
| Créer une version | Bouton "v+"          |

## 🎨 Interface

### Panneau gauche (Sections)

- Sélecteurs : Mode, Modèle, Type, Technique
- Cartes de sections disponibles

### Panneau central (Édition)

- Cartes actives avec leur contenu
- Édition en direct

### Panneau droit (Prompt final)

- Aperçu du prompt généré
- Score de qualité
- Actions (copier, sauvegarder, exporter)

## 🔧 Configuration technique

- **Stockage** : localStorage (`suprompts_storage_v1`)
- **Mode** : localStorage (`suprompts_mode`)
- **Pas de serveur requis** : Application 100% client-side

## 📝 Changelog

### v2.0 - Phase 4 complète

- ✅ Mode Simple/Avancé
- ✅ Icônes pour les sélecteurs
- ✅ Tooltips d'aide
- ✅ Hiérarchie visuelle améliorée

### v1.0 - Fonctionnalités de base

- Création de prompts
- Sauvegarde/chargement
- Export/Import JSON
- Comparaison A/B
