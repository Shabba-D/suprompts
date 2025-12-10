## Pistes d’amélioration fonctionnelles

### Sauvegarde / chargement de prompts

- Sauvegarde automatique en localStorage.
- Liste de prompts récents / favoris.
- Possibilité d’export / import JSON.

### Bouton “Copy prompt” + exports

- Bouton unique “Copy full prompt” (clipboard).
- Option pour copier seulement certaines parties (ex. sans Examples).
- Export .md / .txt.

### Compteur de taille (tokens / caractères)

- Afficher nombre de caractères et estimation de tokens (ex. “≈ 250 tokens”).
- Avertissement si le prompt devient très long.

### Templates / modes prédéfinis

- Templates pour :
- - Question simple.
- - Analyse de texte.
- - Génération de code.
- - Agent / outil (system + instructions).
- L’utilisateur choisit un template et les sections proposées s’adaptent.

### Historique / versions

- Historique des modifications.
- “Revenir à une version précédente du prompt”.
- Dupliquer un prompt pour le modifier sans perdre l’original.

### Support d’autres formats

- Ajouter JSON/YAML comme format de sortie.
  Par exemple : {"persona": "...", "goal": "...", ...}.

### Checklist de qualité

- Indicateur “complétude” : X sections remplies sur Y.
- Avertissements : “Pas de contexte fourni”, “Pas d’exemple”.

## Améliorations UX / flow

### Sections obligatoires vs optionnelles

- Marquer clairement ce qui est recommandé (ex. Goal, Context) et ce qui est bonus.
- Afficher un petit badge “Recommandé” / “Optionnel”.

### Réorganisation des cartes

- Drag & drop pour changer l’ordre des cartes.
- Ou au moins des boutons “Monter / Descendre”.

### Cartes repliables

- Chaque carte pourrait être repliée (titre + résumé) pour réduire le scroll.
- Bouton “Expand all / Collapse all” pour passer de vue globale à vue détaillée.

### Guidage pas-à-pas (mode “wizard”)

- Mode alternatif où tu poses les sections une par une (question/réponse).
- À la fin, l’utilisateur revient sur la vue globale.

### Validation légère

- Si une carte est ajoutée mais vide, afficher un petit indicateur d’avertissement.
- Aide contextuelle : suggestions de questions à se poser pour chaque section.

## Améliorations UI / design

### Lisibilité et hiérarchie

- Mieux différencier les trois colonnes par titres, fonds légèrement différents, et séparateurs.
- Mettre plus en avant les actions principales (ex. boutons plus visibles).

### Amélioration des cards de gauche

- Ajouter des icônes pour chaque type de section (persona, cible, contraintes…).
- Tooltip avec un exemple concret quand on survole.

### Confort d’édition

- Meilleure hauteur / largeur des textarea.
- Indication du nombre de caractères par section.
- Bouton “Clear” par carte.

### Responsive

- Sur petites résolutions, passer à une vue en onglets ou en colonnes empilées :
- - Onglet “Sections”.
- - Onglet “Édition”.
- - Onglet “Prompt final”.

## Pistes plus avancées

### Analyse automatique du prompt

- Un mode où l’app (via une API plus tard) donne un “score” ou des conseils :
- - “Votre prompt manque d’exemples.”
- - “Les contraintes ne sont pas assez précises.”

### Comparaison A/B

- Pouvoir créer deux versions d’un prompt et les voir côte à côte.
- Pratique pour tester deux formulations
