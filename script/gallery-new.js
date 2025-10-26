// Galerie photo - Chargement depuis JSON
// Les P'tites Bouilles Villebonnaises

// Données des albums (chargées depuis JSON)
let albumsData = {};

// Variables globales
let currentAlbum = null;
let currentPhotoIndex = 0;
let modal = null;
let modalImage = null;
let prevBtn = null;
let nextBtn = null;

// Fonction pour générer automatiquement les photos d'un album
function generatePhotos(folderName, count, altBase) {
    const photos = [];
    for (let i = 1; i <= count; i++) {
        photos.push({
            url: `../assets/gallery/${folderName}/photo-${i}.jpg`,
            alt: `${altBase} - Photo ${i}`
        });
    }
    return photos;
}

// Charger les albums depuis le JSON
async function loadAlbumsData() {
    try {
        const response = await fetch('../script/get-albums-public.php');
        const result = await response.json();

        if (result.success && result.albums) {
            // Convertir le format JSON en format albumsData
            result.albums.forEach(album => {
                albumsData[album.id] = {
                    title: album.title,
                    date: album.date,
                    icon: album.icon,
                    photos: generatePhotos(album.folderName, album.photoCount, album.title)
                };
            });

            // Initialiser la galerie une fois les données chargées
            initializeGallery();
        } else {
            console.error('Erreur lors du chargement des albums');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadAlbumsData();
});

function initializeGallery() {
    // Récupération des éléments DOM
    modal = document.getElementById('photoModal');
    modalImage = document.getElementById('modalImage');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');

    // Gestionnaires d'événements pour les albums
    const albumCards = document.querySelectorAll('.album-card');
    albumCards.forEach(card => {
        card.addEventListener('click', function() {
            const albumId = this.dataset.album;
            openModal(albumId);
        });
    });

    // Gestionnaires d'événements pour la modale
    setupModalEvents();

    // Gestionnaire pour le tri
    const sortSelect = document.getElementById('albumSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortAlbums(this.value);
        });
    }
}

function setupModalEvents() {
    // Fermer la modale
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Fermer en cliquant en dehors de l'image
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Navigation avec les boutons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigatePhoto(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigatePhoto(1));
    }

    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (modal && modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    navigatePhoto(-1);
                    break;
                case 'ArrowRight':
                    navigatePhoto(1);
                    break;
            }
        }
    });
}

function openModal(albumId) {
    if (!albumsData[albumId]) {
        console.error('Album non trouvé:', albumId);
        return;
    }

    currentAlbum = albumId;
    currentPhotoIndex = 0;

    // Ouvrir la modale
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Mettre à jour le titre
    const modalTitle = document.querySelector('.modal-header h3');
    if (modalTitle) {
        modalTitle.textContent = `${albumsData[albumId].icon} ${albumsData[albumId].title}`;
    }

    // Afficher la première photo
    displayPhoto(0);

    // Créer les dots de navigation
    createDots();
}

function displayPhoto(index) {
    if (!currentAlbum || !albumsData[currentAlbum]) return;

    const album = albumsData[currentAlbum];
    const photos = album.photos;

    if (index < 0 || index >= photos.length) return;

    currentPhotoIndex = index;

    // Afficher l'image
    if (modalImage) {
        modalImage.src = photos[index].url;
        modalImage.alt = photos[index].alt;
    }

    // Mettre à jour le compteur
    updatePhotoCounter();

    // Mettre à jour les dots
    updateDots();

    // Gérer la visibilité des boutons
    if (prevBtn) {
        prevBtn.style.display = (index === 0) ? 'none' : 'flex';
    }
    if (nextBtn) {
        nextBtn.style.display = (index === photos.length - 1) ? 'none' : 'flex';
    }
}

function navigatePhoto(direction) {
    const newIndex = currentPhotoIndex + direction;
    const album = albumsData[currentAlbum];

    if (newIndex >= 0 && newIndex < album.photos.length) {
        displayPhoto(newIndex);
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentAlbum = null;
        currentPhotoIndex = 0;
    }
}

function updatePhotoCounter() {
    const counter = document.getElementById('photoCounter');
    if (counter && currentAlbum) {
        const album = albumsData[currentAlbum];
        counter.textContent = `${currentPhotoIndex + 1} / ${album.photos.length}`;
    }
}

function createDots() {
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!dotsContainer || !currentAlbum) return;

    const album = albumsData[currentAlbum];
    dotsContainer.innerHTML = '';

    album.photos.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => displayPhoto(index));
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dots .dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPhotoIndex);
    });
}

function sortAlbums(sortType) {
    const albumsGrid = document.querySelector('.albums-grid');
    if (!albumsGrid) return;

    const albumCards = Array.from(albumsGrid.querySelectorAll('.album-card'));

    albumCards.sort((a, b) => {
        const albumIdA = a.dataset.album;
        const albumIdB = b.dataset.album;
        const albumA = albumsData[albumIdA];
        const albumB = albumsData[albumIdB];

        switch(sortType) {
            case 'recent':
                // Trier par date (plus récent en premier) - simplification basée sur l'ordre
                return 0; // Garde l'ordre par défaut
            case 'alpha':
                return albumA.title.localeCompare(albumB.title);
            case 'photos':
                return albumB.photos.length - albumA.photos.length;
            default:
                return 0;
        }
    });

    // Réorganiser les cartes
    albumsGrid.innerHTML = '';
    albumCards.forEach(card => albumsGrid.appendChild(card));
}

// Touch/Swipe support pour mobile
let touchStartX = 0;
let touchEndX = 0;

if (modal) {
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            navigatePhoto(1); // Swipe gauche = suivant
        } else {
            navigatePhoto(-1); // Swipe droite = précédent
        }
    }
}
