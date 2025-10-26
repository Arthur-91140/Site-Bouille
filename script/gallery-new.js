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
            folder: folderName,
            index: i,
            alt: `${altBase} - Photo ${i}`,
            url: null // L'URL sera déterminée dynamiquement
        });
    }
    return photos;
}

// Fonction pour trouver l'extension correcte d'une image
async function findImageExtension(folder, fileName) {
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];

    for (let ext of extensions) {
        const url = `../assets/${folder}/${fileName}.${ext}`;
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
                return url;
            }
        } catch (e) {
            continue;
        }
    }
    // Si aucune extension ne fonctionne, retourner png par défaut
    return `../assets/${folder}/${fileName}.png`;
}

// Fonction pour résoudre les URLs des photos
async function resolvePhotoUrls(photos) {
    const resolvedPhotos = [];

    for (let photo of photos) {
        if (photo.url) {
            // URL déjà définie
            resolvedPhotos.push(photo);
        } else {
            // Rechercher l'extension correcte
            const fileName = `${photo.folder}${photo.index}`;
            const url = await findImageExtension(photo.folder, fileName);
            resolvedPhotos.push({
                url: url,
                alt: photo.alt
            });
        }
    }

    return resolvedPhotos;
}

// Charger les albums depuis le JSON
async function loadAlbumsData() {
    console.log('Début du chargement des albums...');
    try {
        const response = await fetch('../script/get-albums-public.php');
        console.log('Réponse reçue:', response);
        const result = await response.json();
        console.log('Données JSON:', result);

        if (result.success && result.albums) {
            console.log('Nombre d\'albums:', result.albums.length);

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
            await displayAlbums(result.albums);
            console.log('Albums affichés!');

            // Initialiser la galerie une fois les données chargées
            initializeGallery();
        } else {
            console.error('Erreur lors du chargement des albums:', result);
            alert('Erreur: Impossible de charger les albums');
        }
    } catch (error) {
        console.error('Erreur fetch:', error);
        alert('Erreur de chargement: ' + error.message);
    }
}

// Afficher les albums dans la grille
async function displayAlbums(albums) {
    const albumsGrid = document.getElementById('albumsGrid');
    if (!albumsGrid) return;

    albumsGrid.innerHTML = '';

    // Créer toutes les cartes en parallèle pour de meilleures performances
    const albumCards = await Promise.all(
        albums.map(album => createAlbumCard(album))
    );

    // Ajouter les cartes à la grille
    albumCards.forEach(card => {
        albumsGrid.appendChild(card);
    });
}

// Créer une carte d'album
async function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.dataset.album = album.id;

    // Résoudre les URLs des photos miniatures avec détection automatique d'extension
    const photo1 = await findImageExtension(album.folderName, `${album.folderName}1`);
    const photo2 = album.photoCount >= 2 ? await findImageExtension(album.folderName, `${album.folderName}2`) : photo1;
    const photo3 = album.photoCount >= 3 ? await findImageExtension(album.folderName, `${album.folderName}3`) : photo1;
    const photo4 = album.photoCount >= 4 ? await findImageExtension(album.folderName, `${album.folderName}4`) : photo1;

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

async function openModal(albumId) {
    if (!albumsData[albumId]) {
        console.error('Album non trouvé:', albumId);
        return;
    }

    const albumData = albumsData[albumId];

    // Résoudre les URLs des photos si nécessaire
    if (!albumData.photos[0].url) {
        albumData.photos = await resolvePhotoUrls(albumData.photos);
    }

    currentAlbum = albumId;
    currentPhotoIndex = 0;

    // Mettre à jour le titre
    const modalTitle = document.getElementById('modalAlbumTitle');
    if (modalTitle) {
        modalTitle.textContent = albumData.title;
    }

    // Mettre à jour le total de photos
    const totalPhotos = document.getElementById('totalPhotos');
    if (totalPhotos) {
        totalPhotos.textContent = albumData.photos.length;
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
