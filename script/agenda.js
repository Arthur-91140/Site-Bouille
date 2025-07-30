// Agenda JavaScript pour Les P'tites Bauilles
document.addEventListener('DOMContentLoaded', function() {
    const periodFilter = document.getElementById('period-filter');
    const activityFilter = document.getElementById('activity-filter');
    const eventsList = document.querySelector('.events-list');

    // Données complètes du planning selon votre tableau
    const planningData = [
        // 1ère Période
        { date: '2025-09-09', day: 'mardi', activity: 'RENTRÉE', type: 'special', period: 1 },
        { date: '2025-09-11', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 1 },
        { date: '2025-09-16', day: 'mardi', activity: 'MÉDITATION ANIMALE', type: 'meditation', period: 1 },
        { date: '2025-09-18', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 1 },
        { date: '2025-09-23', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 1 },
        { date: '2025-09-25', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 1 },
        { date: '2025-09-30', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 1 },
        { date: '2025-10-02', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 1 },
        { date: '2025-10-07', day: 'mardi', activity: 'PSYCHOMOTRICITÉ', type: 'psychomotricite', period: 1 },
        { date: '2025-10-09', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 1 },
        { date: '2025-10-14', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 1 },
        { date: '2025-10-16', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 1 },
        { date: '2025-10-18', day: 'samedi', activity: 'VACANCES', type: 'vacances', period: 1, endDate: '2025-11-02' },

        // 2ème Période
        { date: '2025-11-04', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 2 },
        { date: '2025-11-06', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 2 },
        { date: '2025-11-11', day: 'mardi', activity: 'FÉRIÉ', type: 'ferie', period: 2 },
        { date: '2025-11-13', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 2 },
        { date: '2025-11-18', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 2 },
        { date: '2025-11-20', day: 'jeudi', activity: 'MÉDITATION ANIMALE', type: 'meditation', period: 2 },
        { date: '2025-11-25', day: 'mardi', activity: 'MUSIQUE', type: 'musique', period: 2 },
        { date: '2025-11-27', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 2 },
        { date: '2025-12-02', day: 'mardi', activity: 'PSYCHOMOTRICITÉ', type: 'psychomotricite', period: 2 },
        { date: '2025-12-04', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 2 },
        { date: '2025-12-09', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 2 },
        { date: '2025-12-11', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 2 },
        { date: '2025-12-16', day: 'mardi', activity: 'SPECTACLE à BREL', type: 'spectacle', period: 2 },
        { date: '2025-12-18', day: 'jeudi', activity: 'JEUX', type: 'jeux', period: 2 },
        { date: '2025-12-20', day: 'samedi', activity: 'VACANCES', type: 'vacances', period: 2, endDate: '2026-01-04' },

        // 3ème Période
        { date: '2026-01-06', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 3 },
        { date: '2026-01-08', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 3 },
        { date: '2026-01-13', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 3 },
        { date: '2026-01-15', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 3 },
        { date: '2026-01-20', day: 'mardi', activity: 'MÉDITATION ANIMALE', type: 'meditation', period: 3 },
        { date: '2026-01-22', day: 'jeudi', activity: 'DANSE', type: 'danse', period: 3 },
        { date: '2026-01-27', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 3 },
        { date: '2026-01-29', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 3 },
        { date: '2026-02-03', day: 'mardi', activity: 'PSYCHOMOTRICITÉ', type: 'psychomotricite', period: 3 },
        { date: '2026-02-05', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 3 },
        { date: '2026-02-10', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 3 },
        { date: '2026-02-12', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 3 },
        { date: '2026-02-17', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 3 },
        { date: '2026-02-19', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 3 },
        { date: '2026-02-21', day: 'samedi', activity: 'VACANCES', type: 'vacances', period: 3, endDate: '2026-03-08' },

        // 4ème Période
        { date: '2026-03-10', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 4 },
        { date: '2026-03-12', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 4 },
        { date: '2026-03-17', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 4 },
        { date: '2026-03-19', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 4 },
        { date: '2026-03-24', day: 'mardi', activity: 'MÉDITATION ANIMALE', type: 'meditation', period: 4 },
        { date: '2026-03-26', day: 'jeudi', activity: 'DANSE AFRICAINE', type: 'danse', period: 4 },
        { date: '2026-03-31', day: 'mardi', activity: 'DANSE', type: 'danse', period: 4 },
        { date: '2026-04-02', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 4 },
        { date: '2026-04-07', day: 'mardi', activity: 'PSYCHOMOTRICITÉ', type: 'psychomotricite', period: 4 },
        { date: '2026-04-09', day: 'jeudi', activity: 'JEUX', type: 'jeux', period: 4 },
        { date: '2026-04-14', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 4 },
        { date: '2026-04-16', day: 'jeudi', activity: 'REMI spec à confirm.', type: 'spectacle', period: 4 },
        { date: '2026-04-18', day: 'samedi', activity: 'VACANCES', type: 'vacances', period: 4, endDate: '2026-05-03' },

        // 5ème Période
        { date: '2026-05-05', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 5 },
        { date: '2026-05-07', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 5 },
        { date: '2026-05-12', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 5 },
        { date: '2026-05-14', day: 'jeudi', activity: 'FÉRIÉ', type: 'ferie', period: 5 },
        { date: '2026-05-19', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 5 },
        { date: '2026-05-21', day: 'jeudi', activity: 'MÉDITATION ANIMALE', type: 'meditation', period: 5 },
        { date: '2026-05-26', day: 'mardi', activity: 'MÉDITATION ANIMALE', type: 'meditation', period: 5 },
        { date: '2026-05-28', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 5 },
        { date: '2026-06-02', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 5 },
        { date: '2026-06-04', day: 'jeudi', activity: 'YOGA', type: 'yoga', period: 5 },
        { date: '2026-06-09', day: 'mardi', activity: 'YOGA', type: 'yoga', period: 5 },
        { date: '2026-06-11', day: 'jeudi', activity: 'MOTRICITÉ', type: 'motricite', period: 5 },
        { date: '2026-06-16', day: 'mardi', activity: 'SPECTACLE à BREL', type: 'spectacle', period: 5 },
        { date: '2026-06-18', day: 'jeudi', activity: 'A confirmer', type: 'special', period: 5 },
        { date: '2026-06-23', day: 'mardi', activity: 'DANSE AFRICAINE', type: 'danse', period: 5 },
        { date: '2026-06-25', day: 'jeudi', activity: 'MUSIQUE', type: 'musique', period: 5 },
        { date: '2026-06-30', day: 'mardi', activity: 'PSYCHOMOTRICITÉ', type: 'psychomotricite', period: 5 },
        { date: '2026-07-02', day: 'jeudi', activity: 'DANSE AFRICAINE', type: 'danse', period: 5 }
    ];

    // Fonction pour obtenir la classe CSS selon le type d'activité
    function getActivityClass(type) {
        const classes = {
            'danse': 'danse-event',
            'musique': 'musique-event',
            'meditation': 'meditation-event',
            'psychomotricite': 'psychomotricite-event',
            'motricite': 'motricite-event',
            'yoga': 'yoga-event',
            'spectacle': 'spectacle-event',
            'jardin': 'jardin-event',
            'jeux': 'jeux-event',
            'ferie': 'ferie-event',
            'vacances': 'vacances-event',
            'special': 'special-event'
        };
        return classes[type] || 'special-event';
    }

    // Fonction pour obtenir la classe CSS selon le jour
    function getDayClass(day) {
        const dayClasses = {
            'lundi': 'lundi-day',
            'mardi': 'mardi-day',
            'mercredi': 'mercredi-day',
            'jeudi': 'jeudi-day',
            'vendredi': 'vendredi-day',
            'samedi': 'samedi-day',
            'dimanche': 'dimanche-day'
        };
        return dayClasses[day] || 'default-day';
    }

    // Fonction pour formater la date
    function formatDate(dateStr, day) {
        const date = new Date(dateStr);
        const dayNum = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day} ${dayNum}.${month}.${year}`;
    }

    // Fonction pour filtrer les activités
    function filterActivities() {
        const periodValue = parseInt(periodFilter.value);
        const activityValue = activityFilter.value;
        
        return planningData.filter(activity => {
            const matchesPeriod = isNaN(periodValue) || activity.period === periodValue;
            const matchesActivity = activityValue === 'all' || activity.type === activityValue;
            
            return matchesPeriod && matchesActivity;
        });
    }

    // Fonction pour afficher les activités
    function displayActivities() {
        const filteredActivities = filterActivities();
        eventsList.innerHTML = '';
        
        if (filteredActivities.length === 0) {
            eventsList.innerHTML = '<p class="no-events">Aucune activité ne correspond à vos critères.</p>';
            return;
        }

        // Grouper par période
        const activitiesByPeriod = {};
        filteredActivities.forEach(activity => {
            if (!activitiesByPeriod[activity.period]) {
                activitiesByPeriod[activity.period] = [];
            }
            activitiesByPeriod[activity.period].push(activity);
        });

        // Afficher chaque période
        Object.keys(activitiesByPeriod).sort().forEach(period => {
            const periodNames = {
                1: '1ère Période - Septembre/Octobre 2025',
                2: '2ème Période - Novembre/Décembre 2025',
                3: '3ème Période - Janvier/Février 2026',
                4: '4ème Période - Mars/Avril 2026',
                5: '5ème Période - Mai/Juin 2026'
            };

            // En-tête de période
            const periodHeader = document.createElement('div');
            periodHeader.className = 'event-date';
            periodHeader.innerHTML = `
                <h4>${periodNames[period]}</h4>
                <div class="date-line"></div>
            `;
            eventsList.appendChild(periodHeader);

            // Afficher les activités de cette période
            activitiesByPeriod[period].forEach(activity => {
                const eventCard = document.createElement('div');
                eventCard.className = `event-card ${getDayClass(activity.day)} ${getActivityClass(activity.type)}`;
                
                const isVacances = activity.type === 'vacances';
                const dateDisplay = isVacances && activity.endDate 
                    ? `${formatDate(activity.date, activity.day)} - ${formatDate(activity.endDate, activity.day)}`
                    : formatDate(activity.date, activity.day);

                eventCard.innerHTML = `
                    <div class="event-time">${activity.date.split('-').reverse().join('.')}</div>
                    <div class="event-indicator ${getActivityClass(activity.type)}"></div>
                    <div class="event-content">
                        <h5>${activity.activity}</h5>
                        <p class="event-hours">${dateDisplay}</p>
                        <p class="event-description">${activity.day.charAt(0).toUpperCase() + activity.day.slice(1)}</p>
                    </div>
                `;
                eventsList.appendChild(eventCard);
            });
        });
    }

    // Écouteurs d'événements
    periodFilter.addEventListener('change', displayActivities);
    activityFilter.addEventListener('change', displayActivities);

    // Affichage initial
    displayActivities();
});