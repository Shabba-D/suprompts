# 05 - Project Processes

---

## 1. Version Control Workflow (Git)

Le projet peut suivre un workflow Git simple de type **feature branch** :

1. Créer une branche à partir de `main` pour chaque fonctionnalité ou correction (ex. `feature/prompt-versions`, `fix/button-animation`).
2. Commiter régulièrement des changements atomiques et bien décrits (messages de commit explicites).
3. Tester localement dans le navigateur que les fonctionnalités clés restent opérationnelles (création de cartes, génération du prompt, sauvegarde/chargement, comparaison A/B, etc.).
4. Fusionner la branche dans `main` (via Pull Request ou merge direct) une fois la fonctionnalité validée.
5. Supprimer la branche une fois mergée pour garder l’historique propre.

## 2. Deployment Process

Le déploiement de suPrompts est **statique** (HTML/CSS/JS uniquement) et donc très léger :

1. S’assurer que la branche `main` est stable et que les tests manuels de base sont OK (chargement de la page, édition de cartes, sauvegarde/chargement de prompts, export/import JSON, comparaison A/B, panneau d’analyse).
2. Copier le dossier du projet `suprompts/` vers le serveur web cible :
   - en local : dossier `d:/wamp64/www/suprompts` pour WampServer (accessible via `http://localhost/suprompts`),
   - ou sur un hébergement statique (Netlify, GitHub Pages, etc.) en servant directement les fichiers.
3. Vider le cache du navigateur ou effectuer un « hard reload » (Ctrl + F5) après mise à jour.
4. Vérifier rapidement les parcours critiques en production (ou sur l’environnement cible) :
   - création / édition de cartes,
   - sauvegarde / chargement de prompts nommés et de versions,
   - import / export JSON,
   - comparaison A/B,
   - affichage de l’indicateur de complétude et du score d’analyse.
