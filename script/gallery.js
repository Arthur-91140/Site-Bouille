// Données des albums avec leurs photos
const albumsData = {
    vacances: {
        title: "Vacances d'été",
        date: "Août 2024",
        photos: [
            {
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
                alt: "Paysage montagneux"
            },
            {
                url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop",
                alt: "Coucher de soleil sur la mer"
            },
            {
                url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop",
                alt: "Plage tropicale"
            },
            {
                url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
                alt: "Forêt verdoyante"
            },
            {
                url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
                alt: "Sentier en forêt"
            },
            {
                url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=800&fit=crop",
                alt: "Lac de montagne"
            }
        ]
    },
    evenement: {
        title: "Événement Spécial",
        date: "Juillet 2024",
        photos: [
            {
                url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&h=800&fit=crop",
                alt: "Fête en soirée"
            },
            {
                url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&h=800&fit=crop",
                alt: "Décoration festive"
            },
            {
                url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=800&fit=crop",
                alt: "Moments de joie"
            },
            {
                url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&h=800&fit=crop",
                alt: "Célébration"
            },
            {
                url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop",
                alt: "Ambiance festive"
            }
        ]
    },
    nature: {
        title: "Nature & Paysages",
        date: "Juin 2024",
        photos: [
            {
                url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
                alt: "Sentier forestier"
            },
            {
                url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=800&fit=crop",
                alt: "Lac paisible"
            },
            {
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
                alt: "Montagne majestueuse"
            },
            {
                url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop",
                alt: "Prairie fleurie"
            },
            {
                url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop",
                alt: "Cascade naturelle"
            },
            {
                url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop",
                alt: "Côte sauvage"
            },
            {
                url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop",
                alt: "Aurore boréale"
            }
        ]
    },
    portraits: {
        title: "Portraits",
        date: "Mai 2024",
        photos: [
            {
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop",
                alt: "Portrait masculin"
            },
            {
                url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&h=800&fit=crop",
                alt: "Portrait féminin"
            },
            {
                url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&h=800&fit=crop",
                alt: "Sourire radieux"
            },
            {
                url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=800&fit=crop",
                alt: "Expression naturelle"
            },
            {
                url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=800&fit=crop",
                alt: "Portrait artistique"
            }
        ]
    },
    architecture: {
        title: "Architecture",
        date: "Avril 2024",
        photos: [
            {
                url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop",
                alt: "Architecture moderne"
            },
            {
                url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=800&fit=crop",
                alt: "Détail architectural"
            },
            {
                url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
                alt: "Bâtiment historique"
            },
            {
                url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=1200&h=800&fit=crop",
                alt: "Design contemporain"
            },
            {
                url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=800&fit=crop",
                alt: "Structure géométrique"
            },
            {
                url: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&h=800&fit=crop",
                alt: "Façade impressionnante"
            }
        ]
    },
    street: {
        title: "Street Photography",
        date: "Mars 2024",
        photos: [
            {
                url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=800&fit=crop",
                alt: "Scène de rue"
            },
            {
                url: "https://images.unsplash.com/photo-1497436072909-f5e4be1dffda?w=1200&h=800&fit=crop",
                alt: "Vie urbaine"
            },
            {
                url: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&h=800&fit=crop",
                alt: "Instant capturé"
            },
            {
                url: "https://images.unsplash.com/photo-1519810755548-39cd217da494?w=1200&h=800&fit=crop",
                alt: "Mouvement urbain"
            },
            {
                url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&h=800&fit=crop",
                alt: "Lumière de ville"
            }
        ]
    }
};

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

function openModal(albumId) {
    if (!albumsData[albumId]) return;
    
    currentAlbum = albumsData[albumId];
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
        }, index * 100);
    });
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    if (modal.style.display === 'block') {
        // Recalcul de la taille de l'image dans la modale
        updateCarouselDisplay();
    }
});

// Préchargement des images pour une meilleure performance
function preloadImages(albumId) {
    if (!albumsData[albumId]) return;
    
    albumsData[albumId].photos.forEach(photo => {
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