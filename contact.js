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
    
    // Validation du formulaire
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Ici vous pourriez ajouter une logique d'envoi à un serveur
            // Pour l'exemple, nous afficherons juste une confirmation
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            
            // Réinitialiser le formulaire
            contactForm.reset();
        });
    }
});