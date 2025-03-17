// Agenda JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Référence aux éléments DOM
    const monthFilter = document.getElementById('month-filter');
    const categoryFilter = document.getElementById('category-filter');
    const eventsList = document.querySelector('.events-list');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const exportCalendarBtn = document.querySelector('.export-calendar-btn');
    const addToCalendarBtns = document.querySelectorAll('.add-to-calendar');

    // État de l'application
    let currentPage = 1;
    const eventsPerPage = 5;
    let currentView = 'list'; // 'list' ou 'calendar'
    
    // Événements initiaux (ceux qui sont déjà dans le HTML)
    const initialEvents = Array.from(document.querySelectorAll('.event-card')).map(card => {
        const dateHeader = card.previousElementSibling;
        const isDateHeader = dateHeader && dateHeader.classList.contains('event-date');
        const date = isDateHeader ? dateHeader.querySelector('h4').textContent : '';
        
        return {
            date: date,
            time: card.querySelector('.event-time').textContent,
            title: card.querySelector('h5').textContent,
            hours: card.querySelector('.event-hours').textContent,
            description: card.querySelector('.event-description').textContent,
            category: getEventCategory(card.querySelector('.event-indicator'))
        };
    });

    // Événements supplémentaires (simulés pour la démo)
    const additionalEvents = [
        {
            date: 'mar. 8 avril',
            time: '10:00',
            title: 'Tournoi de basket',
            hours: '10:00 - 16:00',
            description: 'Tournoi amical inter-écoles.',
            category: 'sport'
        },
        {
            date: 'jeu. 10 avril',
            time: '18:30',
            title: 'Concert de printemps',
            hours: '18:30 - 20:00',
            description: 'Concert des élèves de l\'école de musique.',
            category: 'culture'
        },
        {
            date: 'sam. 12 avril',
            time: '09:00',
            title: 'Sortie nature',
            hours: '09:00 - 17:00',
            description: 'Découverte de la faune et flore locales.',
            category: 'culture'
        },
        {
            date: 'mar. 15 avril',
            time: '14:00',
            title: 'Compétition de natation',
            hours: '14:00 - 18:00',
            description: 'Compétition régionale à la piscine municipale.',
            category: 'sport'
        },
        {
            date: 'ven. 18 avril',
            time: '19:30',
            title: 'Soirée parents-enseignants',
            hours: '19:30 - 21:30',
            description: 'Rencontre informelle pour échanger sur l\'année scolaire.',
            category: 'events'
        }
    ];

    // Tous les événements
    const allEvents = [...initialEvents, ...additionalEvents];

    // Fonctions

    // Détermine la catégorie d'un événement à partir de son indicateur
    function getEventCategory(indicator) {
        if (indicator.classList.contains('sport-event')) return 'sport';
        if (indicator.classList.contains('culture-event')) return 'culture';
        if (indicator.classList.contains('meeting-event')) return 'events';
        if (indicator.classList.contains('special-event')) return 'events';
        if (indicator.classList.contains('anniversary-event')) return 'events';
        return 'all';
    }

    // Détermine la classe CSS pour une catégorie
    function getCategoryClass(category) {
        switch(category) {
            case 'sport': return 'sport-event';
            case 'culture': return 'culture-event';
            case 'events': 
                // Pour la démo, nous alternons entre différents types d'événements
                const eventTypes = ['meeting-event', 'special-event', 'anniversary-event'];
                return eventTypes[Math.floor(Math.random() * eventTypes.length)];
            default: return 'special-event';
        }
    }

    // Filtre les événements en fonction des filtres sélectionnés
    function filterEvents() {
        const monthValue = monthFilter.value;
        const categoryValue = categoryFilter.value;
        
        return allEvents.filter(event => {
            const matchesMonth = monthValue === 'all' || 
                                (monthValue === 'march' && event.date.includes('mars')) ||
                                (monthValue === 'april' && event.date.includes('avril')) ||
                                (monthValue === 'may' && event.date.includes('mai')) ||
                                (monthValue === 'june' && event.date.includes('juin')) ||
                                (monthValue === 'january' && event.date.includes('janvier')) ||
                                (monthValue === 'february' && event.date.includes('février'));
            
            const matchesCategory = categoryValue === 'all' || event.category === categoryValue;
            
            return matchesMonth && matchesCategory;
        });
    }

    // Affiche les événements filtrés
    function displayFilteredEvents() {
        const filteredEvents = filterEvents();
        eventsList.innerHTML = ''; // Effacer la liste actuelle
        
        // Afficher un message si aucun événement ne correspond
        if (filteredEvents.length === 0) {
            eventsList.innerHTML = '<p class="no-events">Aucun événement ne correspond à vos critères.</p>';
            loadMoreBtn.style.display = 'none';
            return;
        }
        
        // Regrouper les événements par date
        const eventsByDate = {};
        filteredEvents.forEach(event => {
            if (!eventsByDate[event.date]) {
                eventsByDate[event.date] = [];
            }
            eventsByDate[event.date].push(event);
        });
        
        // Afficher les événements pour chaque date
        let eventCount = 0;
        for (const date in eventsByDate) {
            if (eventCount >= currentPage * eventsPerPage) break;
            
            // Créer l'en-tête de date
            const dateHeader = document.createElement('div');
            dateHeader.className = 'event-date';
            dateHeader.innerHTML = `
                <h4>${date}</h4>
                <div class="date-line"></div>
            `;
            eventsList.appendChild(dateHeader);
            
            // Afficher les événements de cette date
            eventsByDate[date].forEach(event => {
                if (eventCount >= currentPage * eventsPerPage) return;
                
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card';
                eventCard.innerHTML = `
                    <div class="event-time">${event.time}</div>
                    <div class="event-indicator ${getCategoryClass(event.category)}"></div>
                    <div class="event-content">
                        <h5>${event.title}</h5>
                        <p class="event-hours">${event.hours}</p>
                        <p class="event-description">${event.description}</p>
                        <div class="event-actions">
                            <button class="add-to-calendar">+ Ajouter à mon calendrier</button>
                        </div>
                    </div>
                `;
                eventsList.appendChild(eventCard);
                eventCount++;
            });
        }
        
        // Mettre à jour l'affichage du bouton "Afficher plus"
        loadMoreBtn.style.display = eventCount < filteredEvents.length ? 'block' : 'none';
        
        // Réinitialiser les écouteurs d'événements pour les nouveaux boutons
        document.querySelectorAll('.add-to-calendar').forEach(btn => {
            btn.addEventListener('click', handleAddToCalendar);
        });
    }

    // Gestion du bouton "Afficher plus"
    function handleLoadMore() {
        currentPage++;
        displayFilteredEvents();
    }

    // Gestion du bouton "Ajouter à mon calendrier"
    function handleAddToCalendar(e) {
        const eventCard = e.target.closest('.event-card');
        const title = eventCard.querySelector('h5').textContent;
        const btn = e.target;
        
        // Animation de confirmation
        btn.textContent = '✓ Ajouté';
        btn.style.backgroundColor = '#4facfe';
        btn.style.color = '#fff';
        
        setTimeout(() => {
            btn.textContent = '+ Ajouter à mon calendrier';
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 2000);
        
        // Dans un vrai site, on ajouterait ici le code pour créer un fichier .ics
        console.log(`Événement ajouté au calendrier: ${title}`);
    }

    // Gestion du bouton "Exporter le calendrier"
    function handleExportCalendar() {
        alert('Fonctionnalité d\'exportation du calendrier en cours de développement.');
        // Dans un vrai site, on ajouterait ici le code pour exporter tous les événements
    }

    // Vue calendrier (fonctionnalité qui pourrait être développée)
    function createCalendarView() {
        const calendarView = document.createElement('div');
        calendarView.className = 'calendar-view';
        calendarView.innerHTML = `
            <div class="calendar-header">
                <div class="calendar-title">Mars 2025</div>
                <div class="calendar-navigation">
                    <button class="calendar-nav-btn">◀</button>
                    <button class="calendar-nav-btn">▶</button>
                </div>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Lun</div>
                <div class="calendar-day-header">Mar</div>
                <div class="calendar-day-header">Mer</div>
                <div class="calendar-day-header">Jeu</div>
                <div class="calendar-day-header">Ven</div>
                <div class="calendar-day-header">Sam</div>
                <div class="calendar-day-header">Dim</div>
                
                <!-- Les jours seraient générés dynamiquement -->
            </div>
        `;
        
        return calendarView;
    }

    // Changer la vue (liste ou calendrier)
    function toggleView() {
        if (currentView === 'list') {
            currentView = 'calendar';
            const calendarView = createCalendarView();
            eventsList.style.display = 'none';
            eventsList.parentNode.insertBefore(calendarView, eventsList.nextSibling);
        } else {
            currentView = 'list';
            const calendarView = document.querySelector('.calendar-view');
            if (calendarView) calendarView.remove();
            eventsList.style.display = 'flex';
        }
    }

    // Bouton plein écran
    function createFullscreenButton() {
        const fullscreenBtn = document.createElement('div');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = '⤢';
        fullscreenBtn.addEventListener('click', toggleView);
        document.body.appendChild(fullscreenBtn);
    }

    // Initialisation de la page
    function init() {
        // Ajouter les écouteurs d'événements
        monthFilter.addEventListener('change', () => {
            currentPage = 1;
            displayFilteredEvents();
        });
        
        categoryFilter.addEventListener('change', () => {
            currentPage = 1;
            displayFilteredEvents();
        });
        
        loadMoreBtn.addEventListener('click', handleLoadMore);
        exportCalendarBtn.addEventListener('click', handleExportCalendar);
        
        addToCalendarBtns.forEach(btn => {
            btn.addEventListener('click', handleAddToCalendar);
        });
        
        // Créer le bouton plein écran
        createFullscreenButton();
        
        // Afficher les événements initiaux
        displayFilteredEvents();
    }

    // Démarrer l'application
    init();
});