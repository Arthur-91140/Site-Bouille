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
            url: `../assets/${folderName}/${folderName}${i}.png`,
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
                    folderName: album.folderName,
                    photoCount: album.photoCount,
                    photos: generatePhotos(album.folderName, album.photoCount, album.title)
                };
            });

            // Afficher les albums dynamiquement
            displayAlbums(result.albums);

            // Initialiser la galerie une fois les données chargées
            initializeGallery();
        } else {
            console.error('Erreur lors du chargement des albums');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Afficher les albums dans la grille
function displayAlbums(albums) {
    const albumsGrid = document.getElementById('albumsGrid');
    if (!albumsGrid) return;

    albumsGrid.innerHTML = '';

    albums.forEach(album => {
        const albumCard = createAlbumCard(album);
        albumsGrid.appendChild(albumCard);
    });
}

// Créer une carte d'album
function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.dataset.album = album.id;

    // Générer les URLs des photos miniatures
    const folderPath = `../assets/${album.folderName}`;
    const photo1 = `${folderPath}/${album.folderName}1.png`;
    const photo2 = album.photoCount >= 2 ? `${folderPath}/${album.folderName}2.png` : photo1;
    const photo3 = album.photoCount >= 3 ? `${folderPath}/${album.folderName}3.png` : photo1;
    const photo4 = album.photoCount >= 4 ? `${folderPath}/${album.folderName}4.png` : photo1;

    card.innerHTML = `
        <div class="album-thumbnail">
            <div class="thumbnail-grid">
                <img src="${photo1}" alt="${album.title} 1" class="main-thumb">
                <img src="${photo2}" alt="${album.title} 2" class="mini-thumb">
                <img src="${photo3}" alt="${album.title} 3" class="mini-thumb">
                <img src="${photo4}" alt="${album.title} 4" class="mini-thumb">
            </div>
            <div class="album-overlay">
                <div class="photo-count">${album.photoCount} photo${album.photoCount > 1 ? 's' : ''}</div>
                <div class="album-icon">${album.icon}</div>
            </div>
        </div>
        <div class="album-info">
            <h4>${album.title}</h4>
            <span class="album-date">${album.date}</span>
        </div>
    `;

    // Ajouter l'événement de clic
    card.addEventListener('click', function() {
        openModal(album.id);
    });

    return card;
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
        if (modal && modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                case ' ':
                    e.preventDefault();
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

    // Mettre à jour le titre
    const modalTitle = document.getElementById('modalAlbumTitle');
    if (modalTitle) {
        modalTitle.textContent = albumsData[albumId].title;
    }

    // Mettre à jour le total de photos
    const totalPhotos = document.getElementById('totalPhotos');
    if (totalPhotos) {
        totalPhotos.textContent = albumsData[albumId].photos.length;
    }

    // Créer les dots de navigation
    createDots();

    // Afficher la première photo
    displayPhoto(0);

    // Ouvrir la modale
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Animation d'entrée
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function displayPhoto(index) {
    if (!currentAlbum || !albumsData[currentAlbum]) return;

    const album = albumsData[currentAlbum];
    const photos = album.photos;

    if (index < 0 || index >= photos.length) return;

    currentPhotoIndex = index;

    // Afficher l'image avec animation
    if (modalImage) {
        modalImage.style.opacity = '0';
        modalImage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            modalImage.src = photos[index].url;
            modalImage.alt = photos[index].alt;
            modalImage.style.opacity = '1';
            modalImage.style.transform = 'scale(1)';
        }, 100);
    }

    // Mettre à jour le compteur
    const currentPhoto = document.getElementById('currentPhoto');
    if (currentPhoto) {
        currentPhoto.textContent = index + 1;
    }

    // Mettre à jour les dots
    updateDots();
}

function navigatePhoto(direction) {
    if (!currentAlbum) return;

    const album = albumsData[currentAlbum];
    const newIndex = currentPhotoIndex + direction;

    if (newIndex >= 0 && newIndex < album.photos.length) {
        displayPhoto(newIndex);
    }
}

function closeModal() {
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentAlbum = null;
            currentPhotoIndex = 0;
        }, 300);
    }
}

function createDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer || !currentAlbum) return;

    const album = albumsData[currentAlbum];
    dotsContainer.innerHTML = '';

    album.photos.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => displayPhoto(index));
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    const dots = document.querySelectorAll('#carouselDots .dot');
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
