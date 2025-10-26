# 🔄 Guide de Migration - Galerie vers JSON

## Vue d'ensemble

Ce guide explique comment migrer les données de la galerie depuis `gallery.js` (format JavaScript) vers `gallery-data.json` (format JSON).

## ✅ Modifications effectuées

### 1. Scripts PHP mis à jour
- ✅ `script/get-albums.php` - Lit maintenant depuis JSON
- ✅ `script/upload-album.php` - Écrit maintenant dans JSON
- ✅ `script/delete-album.php` - Supprime maintenant du JSON

### 2. Nouveaux fichiers créés
- ✅ `script/gallery-new.js` - Nouvelle version qui charge depuis JSON
- ✅ `script/get-albums-public.php` - API publique pour la galerie
- ✅ `script/migrate-gallery-to-json.php` - Script de migration
- ✅ `script/migrate.html` - Interface de migration

### 3. Fichiers modifiés
- ✅ `pages/gallery.html` - Utilise maintenant `gallery-new.js`

## 📋 Instructions de migration

### Étape 1 : Exécuter la migration

1. Ouvrir dans un navigateur : `http://votre-site.com/script/migrate.html`
2. Cliquer sur le bouton **"Lancer la migration"**
3. Vérifier que tous les albums ont été migrés (devrait afficher 20 albums)

### Étape 2 : Vérifier le fichier JSON créé

Le fichier `assets/gallery/gallery-data.json` doit contenir :

```json
{
  "albums": [
    {
      "id": "recherche-chataignes",
      "title": "À la recherche des châtaignes",
      "date": "Octobre 2024",
      "icon": "🌰",
      "folderName": "photos-a-la-recherche-des-chataignes",
      "photoCount": 6,
      "timestamp": 1234567890
    },
    ...
  ],
  "migrated_at": "2025-01-XX XX:XX:XX",
  "total": 20
}
```

### Étape 3 : Tester la galerie

1. Ouvrir `pages/gallery.html` dans le navigateur
2. Vérifier que tous les albums s'affichent correctement
3. Cliquer sur un album et vérifier que les photos s'affichent
4. Tester la navigation avec les flèches

### Étape 4 : Tester l'administration

1. Ouvrir `pages/admin-gallery.html`
2. Se connecter avec le mot de passe
3. Vérifier que tous les albums existants sont listés
4. Tester l'ajout d'un nouvel album
5. Tester la suppression d'un album (utiliser un album de test)

## 📊 Albums à migrer

Le script va migrer ces 20 albums :

1. 🌰 À la recherche des châtaignes (6 photos)
2. 🎂 Anniversaires (5 photos)
3. 🧸 Atelier Snoezelen (5 photos)
4. 👨‍🍳 Atelier Cuisine (6 photos)
5. 🦋 Espace de Biodiversité (3 photos)
6. 🌿 Jardin Sensoriel (7 photos)
7. 🎭 Carnaval (4 photos)
8. 🥚 Chasse aux Œufs (18 photos)
9. 🛝 Balades au Parc (15 photos)
10. 🎵 Éveil Musical (18 photos)
11. 🚜 Ferme de Viltain (5 photos)
12. 🎃 Halloween (4 photos)
13. 🏐 Jeux (18 photos)
14. 🤸 Motricité (16 photos)
15. 🎄 Noël (9 photos)
16. 🧺 Pique-niques (4 photos)
17. 📖 Raconte Tapis (3 photos)
18. 🤩 Spectacles (8 photos)
19. 👨🏻‍🎤 Spectacle de Rémi (8 photos)
20. 🧘 Yoga (13 photos)

**Total : 20 albums, 150 photos**

## 🔧 Résolution de problèmes

### La galerie n'affiche rien
- Vérifier que `gallery-data.json` existe dans `assets/gallery/`
- Ouvrir la console du navigateur (F12) pour voir les erreurs
- Vérifier que `get-albums-public.php` retourne bien des données

### Les albums n'apparaissent pas dans l'admin
- Vérifier que le fichier JSON existe
- Vérifier les permissions du fichier JSON (doit être lisible)

### Erreur lors de la migration
- Vérifier que `gallery.js` existe et est bien formaté
- Vérifier les permissions d'écriture sur `assets/gallery/`

## 🧹 Nettoyage après migration

Une fois que tout fonctionne correctement :

1. **Garder en backup** (recommandé) :
   - `script/gallery.js` - Original en backup
   - `script/migrate-gallery-to-json.php` - Au cas où

2. **Supprimer** (optionnel) :
   - `script/migrate.html` - Plus besoin de cette interface

3. **Ne PAS supprimer** :
   - `script/gallery-new.js` - Version active
   - `assets/gallery/gallery-data.json` - Données actives
   - Tous les dossiers de photos dans `assets/gallery/`

## 📁 Structure finale

```
Site-Bouille/
├── assets/
│   ├── gallery/
│   │   ├── gallery-data.json ⭐ NOUVEAU
│   │   ├── photos-recherche-chataignes/
│   │   ├── photos-anniversaires/
│   │   └── ... (20 albums)
│   └── news/
│       ├── news-data.json
│       └── ... (actualités)
├── script/
│   ├── gallery.js (backup)
│   ├── gallery-new.js ⭐ ACTIF
│   ├── get-albums.php ⭐ MODIFIÉ (JSON)
│   ├── get-albums-public.php ⭐ NOUVEAU
│   ├── upload-album.php ⭐ MODIFIÉ (JSON)
│   ├── delete-album.php ⭐ MODIFIÉ (JSON)
│   └── migrate-gallery-to-json.php
└── pages/
    ├── gallery.html ⭐ MODIFIÉ
    └── admin-gallery.html (inchangé)
```

## ✨ Avantages de la migration

- ✅ Cohérence avec le système d'actualités
- ✅ Plus facile à maintenir
- ✅ Format standard (JSON)
- ✅ Meilleure séparation des données et du code
- ✅ Plus simple à sauvegarder/restaurer
- ✅ Compatible avec des outils externes

## 🎯 Prochaines étapes

Après la migration réussie :

1. ✅ Tester l'ajout d'un nouvel album via l'admin
2. ✅ Vérifier qu'il apparaît bien dans la galerie
3. ✅ Tester la suppression
4. ✅ Faire un backup de `gallery-data.json`
5. ✅ Supprimer `migrate.html`

---

**Date de création :** 2025-01-XX
**Version :** 1.0
**Statut :** ✅ Prêt pour la migration
