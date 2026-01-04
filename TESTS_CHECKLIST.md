# Suprompts - Checklist de Tests

## 1. Tests fonctionnels

### Mode Simple/Avancé

- [ ] Toggle Mode fonctionne
- [ ] Mode Simple cache : technique, type, boutons info
- [ ] Mode Avancé affiche tous les contrôles
- [ ] Préférence sauvegardée après rechargement

### Sélecteurs

- [ ] Changement de modèle met à jour le format recommandé
- [ ] Changement de technique met à jour les sections
- [ ] Changement de type met à jour les sections recommandées
- [ ] Icônes visibles (⚙️ 🤖 📝 🎯)

### Tooltips

- [ ] Tooltip Mode visible au survol
- [ ] Tooltip Type visible au survol
- [ ] Boutons info (i) ouvrent les modales

### Cartes de sections

- [ ] Clic ajoute la carte au panneau central
- [ ] Édition du contenu fonctionne
- [ ] Suppression de carte fonctionne
- [ ] Sections recommandées marquées

### Prompt final

- [ ] Génération en temps réel
- [ ] Score de qualité calculé
- [ ] Copie dans le presse-papiers
- [ ] Changement de format (MD/XML/JSON/YAML)

### Sauvegarde

- [ ] Sauvegarder un prompt nommé
- [ ] Charger un prompt sauvegardé
- [ ] Supprimer un prompt
- [ ] Créer une version (v+)
- [ ] Favori (☆)

### Import/Export

- [ ] Export JSON fonctionne
- [ ] Import JSON fonctionne
- [ ] Structure des données correcte

### Comparaison A/B

- [ ] Ouverture du panneau A/B
- [ ] Sélection d'un prompt à comparer
- [ ] Affichage côte à côte
- [ ] Application du prompt de droite à gauche

## 2. Tests de compatibilité

### Navigateurs

- [ ] Chrome (dernière version)
- [ ] Firefox (dernière version)
- [ ] Edge (dernière version)
- [ ] Safari (si applicable)

### Responsive

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablette (768px)
- [ ] Mobile (375px)

### localStorage

- [ ] Données persistantes après rechargement
- [ ] Données persistantes après fermeture navigateur
- [ ] Pas d'erreur si localStorage plein

## 3. Tests de régression

### Modèles + Techniques

| Modèle  | Standard | CoT | Few-Shot | ToT | ReAct |
| ------- | -------- | --- | -------- | --- | ----- |
| Claude  | [ ]      | [ ] | [ ]      | [ ] | [ ]   |
| GPT-4   | [ ]      | [ ] | [ ]      | [ ] | [ ]   |
| Gemini  | [ ]      | [ ] | [ ]      | [ ] | [ ]   |
| Mistral | [ ]      | [ ] | [ ]      | [ ] | [ ]   |
| LLaMA   | [ ]      | [ ] | [ ]      | [ ] | [ ]   |

## 4. Tests d'accessibilité

- [ ] Navigation clavier fonctionne
- [ ] Labels aria présents
- [ ] Contraste suffisant
- [ ] Focus visible

## 5. Tests de performance

- [ ] Chargement < 2s
- [ ] Pas de lag à l'édition
- [ ] Pas de fuite mémoire (après 10 min d'utilisation)

---

## Résultats

**Date de test** : \_**\_/\_\_**/\_\_\_\_

**Testeur** : ******\_\_\_\_******

**Navigateur** : ******\_\_\_\_******

**Bugs trouvés** :

1.
2.
3.

**Notes** :
