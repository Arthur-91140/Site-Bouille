// Script pour la fonctionnalité de la FAQ
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les items de FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Ajouter un écouteur d'événement pour chaque question
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Vérifier si l'élément est déjà actif
            const isActive = item.classList.contains('active');
            
            // Fermer tous les éléments ouverts
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Si l'élément n'était pas actif, l'ouvrir
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Validation et soumission du formulaire
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
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
            
            // Vérifications
            if (!nom || !prenom || !email || !sujet || !message || !consentement) {
                afficherMessage('Tous les champs sont requis et vous devez accepter le traitement de vos données.', 'error');
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
            fetch('./script/process_contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    afficherMessage(data.message, 'success');
                    contactForm.reset();
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
        
        // Styles pour le message
        messageDiv.style.padding = '1rem';
        messageDiv.style.marginBottom = '1rem';
        messageDiv.style.borderRadius = '10px';
        messageDiv.style.fontSize = '1rem';
        messageDiv.style.fontWeight = '500';
        
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        }
        
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
            }, 5000);
        }
    }
});