// JavaScript pour la page d'accueil - Les P'tites Bouilles Villebonnaises

// Variables globales pour le carrousel
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

// Initialisation de la page
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initCardAnimations();
    initSmoothScrolling();
});

// ========== FONCTIONS DU CARROUSEL ==========

function initCarousel() {
    if (slides.length === 0) return;
    
    // Démarrer le carrousel automatique
    startAutoSlide();
    
    // Arrêter l'auto-slide quand on survole le carrousel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Gestion du swipe sur mobile
    let startX = 0;
    let endX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                changeSlide(1); // Swipe vers la gauche = slide suivante
            } else {
                changeSlide(-1); // Swipe vers la droite = slide précédente
            }
        }
    }
}

function changeSlide(direction) {
    // Retirer la classe active de l'élément actuel
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Calculer le nouvel index
    currentSlideIndex += direction;
    
    // Gérer les limites (boucle infinie)
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Ajouter la classe active au nouvel élément
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Redémarrer l'auto-slide
    stopAutoSlide();
    startAutoSlide();
}

function currentSlide(n) {
    // Retirer la classe active de l'élément actuel
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Définir le nouvel index
    currentSlideIndex = n - 1;
    
    // Ajouter la classe active au nouvel élément
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Redémarrer l'auto-slide
    stopAutoSlide();
    startAutoSlide();
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change de slide toutes les 5 secondes
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// ========== ANIMATIONS DES CARTES ==========

function initCardAnimations() {
    const cards = document.querySelectorAll('.main-card');
    
    // Observer pour les animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        observer.observe(card);
        
        // Effet de click avec animation
        card.addEventListener('click', function(e) {
            // Créer un effet de ripple au click
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Supprimer le ripple après l'animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ========== DÉFILEMENT FLUIDE ==========

function initSmoothScrolling() {
    // Défilement fluide pour les liens d'ancrage
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== GESTION DU REDIMENSIONNEMENT ==========

window.addEventListener('resize', function() {
    // Réajuster les éléments si nécessaire lors du redimensionnement
    debounce(() => {
        // Logique de redimensionnement si nécessaire
    }, 250)();
});

// Fonction debounce pour optimiser les performances
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== ANIMATIONS CSS DYNAMIQUES ==========

// Ajouter les styles pour les animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        animation: ripple-animation 0.6s ease-out;
        z-index: 1;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .main-card {
        position: relative;
        overflow: hidden;
    }
`;

document.head.appendChild(style);

// ========== GESTION DES ERREURS D'IMAGES ==========

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Remplacer par une image par défaut ou masquer
            this.style.display = 'none';
            console.warn('Image non trouvée:', this.src);
        });
    });
});

// ========== PRÉCHARGEMENT DES IMAGES ==========

function preloadImages() {
    const imageSources = [
        './assets/carousel-1.jpg',
        './assets/carousel-2.jpg',
        './assets/carousel-3.jpg',
        './assets/activites-presentation.jpg'
    ];
    
    imageSources.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Démarrer le préchargement
preloadImages();

// ========== ACCESSIBILITÉ ==========

// Navigation au clavier pour le carrousel
document.addEventListener('keydown', function(e) {
    if (e.target.closest('.carousel-container')) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                changeSlide(1);
                break;
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (e.target.classList.contains('dot')) {
                    const index = Array.from(dots).indexOf(e.target);
                    currentSlide(index + 1);
                }
                break;
        }
    }
});

// ========== PERFORMANCE ==========

// Optimisation des animations avec Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observer tous les éléments animables
document.querySelectorAll('.main-card, .presentation-section').forEach(el => {
    animationObserver.observe(el);
});