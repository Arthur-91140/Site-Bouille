// Script pour la page Activités et Adhésion
document.addEventListener('DOMContentLoaded', function() {
    
    // Validation et soumission du formulaire d'adhésion
    const adhesionForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (adhesionForm) {
        adhesionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Désactiver le bouton pendant l'envoi
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.style.opacity = '0.7';
            
            // Récupérer les données du formulaire
            const formData = new FormData(this);
            
            // Validation côté client
            const nom = formData.get('nom').trim();
            const prenom = formData.get('prenom').trim();
            const email = formData.get('email').trim();
            const sujet = formData.get('sujet').trim();
            const message = formData.get('message').trim();
            const consentement = formData.get('consentement');
            const offre = formData.get('offre');
            const situations = formData.getAll('situation[]');
            
            // Vérifications
            if (!nom || !prenom || !email || !sujet || !message || !consentement || !offre) {
                afficherMessage('Tous les champs obligatoires doivent être remplis et vous devez accepter le traitement de vos données.', 'error');
                resetSubmitButton();
                return;
            }
            
            if (situations.length === 0) {
                afficherMessage('Veuillez sélectionner au moins une situation vous correspondant.', 'error');
                resetSubmitButton();
                return;
            }
            
            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                afficherMessage('Veuillez saisir une adresse email valide.', 'error');
                resetSubmitButton();
                return;
            }
            
            // Envoyer les données au serveur
            fetch('../script/process_adhesion.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    afficherMessage(data.message, 'success');
                    adhesionForm.reset();
                } else {
                    afficherMessage(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                afficherMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement.', 'error');
            })
            .finally(() => {
                resetSubmitButton();
            });
            
            function resetSubmitButton() {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
            }
        });
    }
    
    // Fonction pour afficher les messages
    function afficherMessage(message, type) {
        // Supprimer les anciens messages
        const oldMessages = document.querySelectorAll('.form-message');
        oldMessages.forEach(msg => msg.remove());
        
        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Insérer le message avant le formulaire
        const formContainer = document.querySelector('.contact-form-container');
        const form = document.querySelector('.contact-form');
        formContainer.insertBefore(messageDiv, form);
        
        // Faire défiler vers le message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Supprimer le message après 5 secondes si c'est un succès
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 8000);
        }
    }
    
    // Animation des cartes d'activités au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer toutes les cartes d'activités
    const activiteCards = document.querySelectorAll('.activite-card');
    activiteCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Amélioration UX pour les checkboxes
    const checkboxItems = document.querySelectorAll('.checkbox-item');
    checkboxItems.forEach(item => {
        const input = item.querySelector('input');
        const label = item.querySelector('label');
        
        label.addEventListener('click', function() {
            if (input.type === 'checkbox') {
                input.checked = !input.checked;
            } else if (input.type === 'radio') {
                input.checked = true;
            }
        });
    });
    
    // Validation en temps réel des champs requis
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#22c55e';
            }
        });
        
        field.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#22c55e';
            }
        });
    });
    
    // Validation email en temps réel
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#ef4444';
            } else if (this.value) {
                this.style.borderColor = '#22c55e';
            }
        });
    }
    
    // Compteur de caractères pour le textarea
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = messageField.getAttribute('maxlength');
        
        // Créer un compteur
        const counter = document.createElement('div');
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.9rem';
        counter.style.color = '#666';
        counter.style.marginTop = '0.5rem';
        
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const currentLength = messageField.value.length;
            counter.textContent = `${currentLength}/${maxLength} caractères`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else {
                counter.style.color = '#666';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial call
    }
});