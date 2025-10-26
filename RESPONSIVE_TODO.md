# TODO - Responsive Mobile

## ✅ Complété

1. **Navbar mobile avec menu hamburger** - styles.css
2. **JavaScript menu mobile** - script/menu.js créé
3. **Responsive global** - responsive.css rempli
4. **Index.html** - Bouton hamburger et overlay ajoutés

## 🔄 À finaliser

### 1. Ajouter le menu hamburger dans toutes les pages HTML

Ajouter dans chaque page (activites.html, gallery.html, etc.) :

```html
<header>
    <div class="logo">
        <h1>Les p'tites bouilles</h1>
        <h1>villebonnaises</h1>
    </div>
    <div class="menu-toggle" id="menuToggle">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <nav id="mainNav">
        <!-- liens navigation -->
    </nav>
</header>
<div class="menu-overlay" id="menuOverlay"></div>
```

### 2. Ajouter le script menu.js dans toutes les pages

Ajouter avant la balise `</body>` dans chaque page HTML :

```html
<script src="../script/menu.js"></script>
```

Pour index.html :
```html
<script src="./script/menu.js"></script>
```

### 3. Responsive CSS à ajouter dans chaque fichier

#### activites.css - Ajouter à la fin :

```css
@media (max-width: 1024px) {
    .activites-featured .featured-grid {
        grid-template-columns: 1fr;
    }

    .tarifs-table table {
        font-size: 0.9rem;
    }
}

@media (max-width: 768px) {
    .hero-activites {
        padding: 4rem 1.5rem;
    }

    .tarifs-table {
        overflow-x: auto;
    }

    .tarifs-table table {
        font-size: 0.8rem;
    }

    .contact-form-container {
        padding: 2rem 1.5rem;
    }
}

@media (max-width: 480px) {
    .featured-poster img {
        max-height: 400px;
    }

    .tarifs-table table {
        font-size: 0.7rem;
    }

    th, td {
        padding: 0.5rem !important;
    }
}
```

#### contact.css - Modifier le média query existant :

```css
@media (max-width: 768px) {
    .contact-container {
        flex-direction: column;
    }

    .contact-info {
        width: 100%;
    }

    .contact-card {
        padding: 1.5rem;
    }

    .date-range-filter {
        flex-direction: column;
        align-items: flex-start;
    }
}
```

#### gallery.css - Ajouter :

```css
@media (max-width: 768px) {
    .albums-grid {
        grid-template-columns: 1fr;
    }

    .album-card {
        padding: 1.5rem;
    }
}
```

#### agenda.css - Ajouter :

```css
@media (max-width: 768px) {
    .agenda-filters {
        gap: 0.8rem;
    }

    .date-range-filter {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .date-range-filter input[type="date"] {
        width: 100%;
    }

    .agenda-filters select {
        width: 100%;
    }
}
```

#### disponibilite.css - Ajouter :

```css
@media (max-width: 768px) {
    .assmat-cards {
        grid-template-columns: 1fr;
    }

    .assmat-card {
        padding: 1.5rem;
    }
}
```

### 4. Pages HTML à mettre à jour

- [ ] pages/activites.html
- [ ] pages/gallery.html
- [ ] pages/disponibilite.html
- [ ] pages/agenda.html
- [ ] pages/contact.html
- [ ] pages/mention-legale.html

## 📝 Notes importantes

- Le menu mobile fonctionne avec un slide depuis la gauche
- L'overlay semi-transparent permet de fermer le menu en cliquant en dehors
- Le bouton hamburger s'anime en X quand le menu est ouvert
- Le scroll du body est bloqué quand le menu est ouvert
- Tous les liens du menu ferment automatiquement le menu au clic
