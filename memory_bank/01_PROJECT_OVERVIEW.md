# 01 - Vue d'ensemble du Projet : suPrompts

---

## 1. Vision du Produit

suPrompts est un atelier de conception de prompts pour IA (ChatGPT, Claude, etc.) qui permet de structurer les consignes en sections claires (persona, objectif, contexte, contraintes, format, exemples).

L’objectif est de produire des prompts robustes, réutilisables et faciles à itérer, afin de réduire le temps passé à bricoler des prompts ad hoc et d’améliorer la qualité et la cohérence des réponses.

---

## 2. Public Cible

- Utilisateurs avancés d’IA (power users, consultants, PM, rédacteurs, développeurs) qui travaillent fréquemment avec des LLMs.
- Personnes qui créent régulièrement des prompts complexes et souhaitent les documenter, les versionner et les comparer facilement.
- Toute personne qui veut systématiser sa manière de formuler des consignes pour l’IA, plutôt que repartir de zéro à chaque fois.

---

## 3. Fonctionnalités Clés

- Éditeur de prompts par cartes (Persona, Goal, Context, Audience, Constraints, Format, Tone, Examples, etc.).
- Génération automatique du prompt final dans plusieurs formats : Markdown, XML, JSON, YAML.
- Sauvegarde locale des prompts et de leurs versions dans le navigateur (localStorage).
- Gestion de prompts nommés : création, mise à jour, suppression, favoris.
- Versionnage léger : sauvegarde de snapshots et restauration de versions précédentes.
- Import / export de prompts au format JSON.
- Comparaison A/B de prompts (overlay dédié, copie de sections de droite à gauche).
- Indicateur de complétude et score de qualité avec recommandations locales.
- Interface francisée, pensée pour un usage intensif mais local et léger (aucun backend nécessaire).

---

## 4. Indicateurs de Succès (KPIs)

- Nombre de prompts enregistrés et réutilisés sur la durée.
- Réduction du temps nécessaire pour arriver à un prompt « satisfaisant » pour un cas d’usage donné.
- Taux de réutilisation des templates et des prompts versionnés (vs prompts recréés from scratch).
- Satisfaction subjective de l’utilisateur (confort d’édition, lisibilité, sentiment de contrôle sur le prompt).

---

## 5. Roadmap Stratégique

_Le plan de développement stratégique, décomposé en phases logiques (ex: V1.0 MVP, V2.0, etc.)._

- **Phase 1 – Quick wins UX/UI** : bouton de copie du prompt complet, lisibilité générale, confort d’édition des cartes.
- **Phase 2 – Persistance et gestion de prompts** : sauvegarde automatique (localStorage), liste de prompts récents / favoris, export / import JSON.
- **Phase 3 – Formats, templates et qualité du prompt** : support JSON/YAML, templates prédéfinis, indicateur de complétude et checklist de qualité.
- **Phase 4 – Historique, versions et fonctionnalités avancées** : versionnage, comparaison A/B, analyse automatique locale, durcissement du code et francisation de l’interface.
- **Phase 5 – Responsive et expérience multi-device** : adaptation aux petits écrans, finitions UI.

---

## 6. Périmètre et Non-Objectifs

### Dans le périmètre

- Outil de conception de prompts local, fonctionnant entièrement dans le navigateur.
- Structuration des prompts en sections réutilisables et ordonnées.
- Persistance locale (prompts nommés, versions, dernière session) via `localStorage`.
- Import / export de prompts au format JSON.
- Outils d’analyse et de qualité basés sur des heuristiques locales (pas d’appel à une API d’IA).

### Hors du périmètre

- Pas de backend applicatif, pas de base de données serveur ni de comptes utilisateurs.
- Pas de synchronisation cloud ni de collaboration temps réel entre plusieurs personnes.
- Pas d’exécution de prompts ni d’appels directs à des APIs d’IA (OpenAI, Anthropic, etc.) depuis l’interface.
- Pas d’édition multi-document complexe : l’outil se concentre sur un prompt « actif » à la fois.

## 7. Vision long terme : intégration d’une IA d’analyse

À moyen terme, suPrompts pourra s’appuyer sur une IA externe (API de LLM) pour aller plus loin que l’analyse locale actuelle :

- Proposer un **score de qualité enrichi** du prompt en tenant compte du contexte métier.
- Suggérer des **améliorations ciblées** (sections à compléter, reformulations, exemples à ajouter).
- Détecter des **ambiguïtés, contradictions ou contraintes manquantes** dans le prompt.

Cette intégration restera **optionnelle** et respectera des principes forts :

- Aucun prompt n’est envoyé à une API externe **sans action explicite de l’utilisateur**.
- L’**API key** est fournie et gérée par l’utilisateur (jamais commitée dans le dépôt, pas stockée en clair côté client si possible).
- L’architecture restera modulaire : l’analyse IA sera un **module d’extension** au-dessus du moteur local existant, de façon à garder l’outil utilisable sans connexion réseau ni compte externe.

- Intégrations naturelles à envisager (évolution future) : IDE, outils de note (Obsidian, Notion), gestionnaires de connaissances, interfaces d’IA existantes.
