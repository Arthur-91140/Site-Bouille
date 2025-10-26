// Données des albums avec leurs photos
const albumsData = {
    "recherche-chataignes": {
        title: "À la recherche des châtaignes",
        date: "Octobre 2024",
        icon: "🌰",
        photos: generatePhotos("photos-a-la-recherche-des-chataignes", 6, "Recherche des châtaignes")
    },
    "anniversaires": {
        title: "Anniversaires",
        date: "Toute l'année",
        icon: "🎂",
        photos: generatePhotos("photos-anniversaires", 5, "Fête d'anniversaire")
    },
    "atelier-snoezelen": {
        title: "Atelier Snoezelen",
        date: "Toute l'année",
        icon: "🧸",
        photos: generatePhotos("photos-atelier-Snoezelen", 5, "Atelier sensoriel")
    },
    "atelier-cuisine": {
        title: "Atelier Cuisine",
        date: "Toute l'année",
        icon: "👨‍🍳",
        photos: generatePhotos("photos-atelier-cuisine", 6, "Atelier culinaire")
    },
    "espace-biodiversite": {
        title: "Espace de Biodiversité",
        date: "Mars 2025",
        icon: "🦋",
        photos: generatePhotos("photos-atelier-jardin-a-lespace-de-biodiversite", 3, "Espace de biodiversité")
    },
    "jardin-sensoriel": {
        title: "Jardin Sensoriel",
        date: "Septembre 2025",
        icon: "🌿",
        photos: generatePhotos("photos-atelier-jardin-sensoriel", 7, "Jardin sensoriel")
    },
    "carnaval": {
        title: "Carnaval",
        date: "Février 2025",
        icon: "🎭",
        photos: generatePhotos("photos-carnaval", 4, "Fête de carnaval")
    },
    "chasse-oeufs": {
        title: "Chasse aux Œufs",
        date: "Avril 2025",
        icon: "🥚",
        photos: generatePhotos("photos-chasse-aux-oeufs", 18, "Chasse aux œufs de Pâques")
    },
    "balade-parc": {
        title: "Balades au Parc",
        date: "Toute l'année",
        icon: "🛝",
        photos: generatePhotos("photos-en-balade-au-parc", 15, "Promenade au parc")
    },
    "eveil-musical": {
        title: "Éveil Musical",
        date: "Toute l'année",
        icon: "🎵",
        photos: generatePhotos("photos-eveil-musical", 18, "Séance d'éveil musical")
    },
    "ferme-viltain": {
        title: "Ferme de Viltain",
        date: "Avril 2025",
        icon: "🚜",
        photos: generatePhotos("photos-ferme-de-viltain", 5, "Visite à la ferme")
    },
    "halloween": {
        title: "Halloween",
        date: "Octobre 2024",
        icon: "🎃",
        photos: generatePhotos("photos-haloween", 4, "Fête d'Halloween")
    },
    "jeux": {
        title: "Jeux",
        date: "Toute l'année",
        icon: "🏐",
        photos: generatePhotos("photos-jeux", 18, "Temps de jeux")
    },
    "motricite": {
        title: "Motricité",
        date: "Toute l'année",
        icon: "🤸",
        photos: generatePhotos("photos-motricite", 16, "Exercices de motricité")
    },
    "noel": {
        title: "Noël",
        date: "Décembre 2024",
        icon: "🎄",
        photos: generatePhotos("photos-noel", 9, "Fêtes de Noël")
    },
    "pique-niques": {
        title: "Pique-niques",
        date: "Été 2024",
        icon: "🧺",
        photos: generatePhotos("photos-pique-niques", 4, "Pique-nique")
    },
    "raconte-tapis": {
        title: "Raconte Tapis",
        date: "Mai 2025",
        icon: "📖",
        photos: generatePhotos("photos-raconte-tapis", 3, "Séance raconte tapis")
    },
    "spectacles": {
        title: "Spectacles",
        date: "Décembre 2024 et Juin 2025",
        icon: "🤩",
        photos: generatePhotos("photos-spectacle-de-noel-et-de-fin-dannee", 8, "Spectacle de fin d'année")
    },
    "spectacle-remi": {
        title: "Spectacle de Rémi",
        date: "Avril 2025",
        icon: "👨🏻‍🎤",
        photos: generatePhotos("photos-spectacle-de-remi", 8, "Spectacle de Rémi")
    },
    "yoga": {
        title: "Yoga",
        date: "Mai 2025",
        icon: "🧘",
        photos: generatePhotos("photos-yoga", 13, "Séance de yoga")
    }
};

// Fonction pour générer automatiquement les photos d'un album
function generatePhotos(folderName, count, altBase) {
    const photos = [];
    const extensions = ['jpg', 'jpeg', 'png', 'webp', 'JPG', 'JPEG', 'PNG', 'WEBP'];

    for (let i = 1; i <= count; i++) {
        photos.push({
            folder: folderName,
            index: i,
            alt: `${altBase} - Photo ${i}`,
            extensions: extensions,
            // L'URL sera déterminée dynamiquement lors du chargement
            url: null
        });
    }
    return photos;
}

// Fonction pour trouver l'extension correcte d'une image
async function findImageExtension(folder, fileName, extensions) {
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
            const url = await findImageExtension(photo.folder, fileName, photo.extensions);
            resolvedPhotos.push({
                url: url,
                alt: photo.alt
            });
        }
    }

    return resolvedPhotos;
}

// Variables globales
let currentAlbum = null;
let currentPhotoIndex = 0;
let modal = null;
let modalImage = null;
let prevBtn = null;
let nextBtn = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
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
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortAlbums);
    }
    
    // Animation d'entrée pour les cartes d'album
    animateAlbumCards();
}

async function openModal(albumId) {
    if (!albumsData[albumId]) return;

    const albumData = albumsData[albumId];

    // Résoudre les URLs des photos si nécessaire
    if (!albumData.photos[0].url) {
        albumData.photos = await resolvePhotoUrls(albumData.photos);
    }

    currentAlbum = albumData;
    currentPhotoIndex = 0;

    // Mise à jour du titre de l'album
    document.getElementById('modalAlbumTitle').textContent = currentAlbum.title;
    document.getElementById('totalPhotos').textContent = currentAlbum.photos.length;

    // Création des dots de navigation
    createCarouselDots();

    // Affichage de la première photo
    updateCarouselDisplay();

    // Ouverture de la modale
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Animation d'entrée
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentAlbum = null;
        currentPhotoIndex = 0;
    }, 300);
}

function setupModalEvents() {
    // Fermeture de la modale
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Fermeture en cliquant en dehors
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Navigation avec les boutons
    prevBtn.addEventListener('click', previousPhoto);
    nextBtn.addEventListener('click', nextPhoto);
    
    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case ' ':
                    e.preventDefault(); // Empêche le défilement de la page
                    closeModal();
                    break;
                case 'ArrowLeft':
                    previousPhoto();
                    break;
                case 'ArrowRight':
                    nextPhoto();
                    break;
            }
        }
    });
}

function createCarouselDots() {
    const dotsContainer = document.getElementById('carouselDots');
    dotsContainer.innerHTML = '';
    
    currentAlbum.photos.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            currentPhotoIndex = index;
            updateCarouselDisplay();
        });
        
        dotsContainer.appendChild(dot);
    });
}

function updateCarouselDisplay() {
    if (!currentAlbum || !currentAlbum.photos[currentPhotoIndex]) return;
    
    const currentPhoto = currentAlbum.photos[currentPhotoIndex];
    
    // Mise à jour de l'image
    modalImage.src = currentPhoto.url;
    modalImage.alt = currentPhoto.alt;
    
    // Mise à jour du compteur
    document.getElementById('currentPhoto').textContent = currentPhotoIndex + 1;
    
    // Mise à jour des dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentPhotoIndex);
    });
    
    // Animation de changement d'image
    modalImage.style.opacity = '0';
    modalImage.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        modalImage.style.opacity = '1';
        modalImage.style.transform = 'scale(1)';
    }, 100);
}

function previousPhoto() {
    if (!currentAlbum) return;
    
    currentPhotoIndex = currentPhotoIndex === 0 
        ? currentAlbum.photos.length - 1 
        : currentPhotoIndex - 1;
    
    updateCarouselDisplay();
}

function nextPhoto() {
    if (!currentAlbum) return;
    
    currentPhotoIndex = currentPhotoIndex === currentAlbum.photos.length - 1 
        ? 0 
        : currentPhotoIndex + 1;
    
    updateCarouselDisplay();
}

function sortAlbums() {
    const sortValue = document.getElementById('sortSelect').value;
    const albumsGrid = document.getElementById('albumsGrid');
    const albumCards = Array.from(albumsGrid.children);
    
    albumCards.sort((a, b) => {
        switch (sortValue) {
            case 'alphabetical':
                const titleA = a.querySelector('.album-info h4').textContent;
                const titleB = b.querySelector('.album-info h4').textContent;
                return titleA.localeCompare(titleB);
            
            case 'recent':
                const dateA = new Date(a.dataset.date);
                const dateB = new Date(b.dataset.date);
                return dateB - dateA;
            
            case 'popular':
                // Tri par popularité (ici basé sur le nombre de photos)
                const countA = parseInt(a.querySelector('.photo-count').textContent);
                const countB = parseInt(b.querySelector('.photo-count').textContent);
                return countB - countA;
            
            default:
                return 0;
        }
    });
    
    // Réorganisation des éléments avec animation
    albumsGrid.style.opacity = '0.5';
    setTimeout(() => {
        albumCards.forEach(card => albumsGrid.appendChild(card));
        albumsGrid.style.opacity = '1';
        animateAlbumCards();
    }, 300);
}

function animateAlbumCards() {
    const albumCards = document.querySelectorAll('.album-card');
    
    albumCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50); // Réduction du délai pour plus de fluidité
    });
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    if (modal && modal.style.display === 'block') {
        // Recalcul de la taille de l'image dans la modale
        updateCarouselDisplay();
    }
});

// Préchargement des images pour une meilleure performance
async function preloadImages(albumId) {
    if (!albumsData[albumId]) return;

    const albumData = albumsData[albumId];

    // Résoudre les URLs si nécessaire
    if (!albumData.photos[0].url) {
        albumData.photos = await resolvePhotoUrls(albumData.photos);
    }

    albumData.photos.forEach(photo => {
        const img = new Image();
        img.src = photo.url;
    });
}

// Préchargement des images des albums visibles
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        Object.keys(albumsData).forEach(preloadImages);
    }, 1000);
});

// Support pour les gestes tactiles (swipe) sur mobile
let touchStartX = 0;
let touchStartY = 0;

if (modal) {
    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    modal.addEventListener('touchend', function(e) {
        if (!currentAlbum) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Vérifier que c'est un swipe horizontal (et non vertical)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe vers la gauche - photo suivante
                nextPhoto();
            } else {
                // Swipe vers la droite - photo précédente
                previousPhoto();
            }
        }
    }, { passive: true });
}

// Gestion des erreurs d'images
function handleImageError(img) {
    img.style.display = 'none';
    console.warn(`Image non trouvée: ${img.src}`);
}

// Ajout d'un gestionnaire d'erreurs pour toutes les images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
});

// Fonction pour créer dynamiquement un album (utile pour les futures extensions)
async function createAlbumCard(albumId, albumData) {
    // Résoudre les URLs si nécessaire
    if (albumData.photos.length > 0 && !albumData.photos[0].url) {
        albumData.photos = await resolvePhotoUrls(albumData.photos);
    }

    const card = document.createElement('div');
    card.className = 'album-card';
    card.dataset.album = albumId;
    card.dataset.date = new Date().toISOString().split('T')[0]; // Date actuelle par défaut

    card.innerHTML = `
        <div class="album-thumbnail">
            <div class="thumbnail-grid">
                <img src="${albumData.photos[0]?.url || ''}" alt="${albumData.photos[0]?.alt || ''}" class="main-thumb">
                <img src="${albumData.photos[1]?.url || albumData.photos[0]?.url || ''}" alt="${albumData.photos[1]?.alt || ''}" class="mini-thumb">
                <img src="${albumData.photos[2]?.url || albumData.photos[0]?.url || ''}" alt="${albumData.photos[2]?.alt || ''}" class="mini-thumb">
                <img src="${albumData.photos[3]?.url || albumData.photos[0]?.url || ''}" alt="${albumData.photos[3]?.alt || ''}" class="mini-thumb">
            </div>
            <div class="album-overlay">
                <div class="photo-count">${albumData.photos.length} photos</div>
                <div class="album-icon">${albumData.icon || '📷'}</div>
            </div>
        </div>
        <div class="album-info">
            <h4>${albumData.title}</h4>
            <span class="album-date">${albumData.date}</span>
        </div>
    `;

    // Ajout du gestionnaire d'événement
    card.addEventListener('click', function() {
        openModal(albumId);
    });

    return card;
}