// Configuration
const ADMIN_PASSWORD = 'bouilles2025'; // À changer en production
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Éléments du DOM
const authSection = document.getElementById('authSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const authError = document.getElementById('authError');
const logoutBtn = document.getElementById('logoutBtn');
const addNewsForm = document.getElementById('addNewsForm');
const newsFileInput = document.getElementById('newsFile');
const newsPreview = document.getElementById('newsPreview');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const newsList = document.getElementById('newsList');

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', () => {
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
        showAdminSection();
    }
});

// Gestion de la connexion
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        showAdminSection();
    } else {
        showError('Mot de passe incorrect');
    }
});

// Gestion de la déconnexion
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('adminAuth');
    authSection.style.display = 'block';
    adminSection.style.display = 'none';
    loginForm.reset();
    authError.style.display = 'none';
});

// Afficher la section admin
function showAdminSection() {
    authSection.style.display = 'none';
    adminSection.style.display = 'block';
    loadNews();
}

// Afficher une erreur d'authentification
function showError(message) {
    authError.textContent = message;
    authError.style.display = 'block';
    setTimeout(() => {
        authError.style.display = 'none';
    }, 3000);
}

// Prévisualisation du fichier
newsFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    newsPreview.innerHTML = '';

    if (!file) return;

    // Vérifications
    if (!ALLOWED_TYPES.includes(file.type)) {
        showMessage('Format de fichier non accepté', 'error');
        newsFileInput.value = '';
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        showMessage('Fichier trop volumineux (max 5 Mo)', 'error');
        newsFileInput.value = '';
        return;
    }

    // Créer la prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'photo-preview-item';
        previewItem.style.aspectRatio = '16 / 9';
        previewItem.innerHTML = `
            <img src="${e.target.result}" alt="Prévisualisation" style="object-fit: cover;">
        `;
        newsPreview.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
});

// Gestion de l'ajout d'actualité
addNewsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = newsFileInput.files[0];
    if (!file) {
        showMessage('Veuillez sélectionner un fichier', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('title', document.getElementById('newsTitle').value.trim() || 'Actualité ' + new Date().toLocaleDateString());
    formData.append('newsFile', file);

    // Afficher la progression
    uploadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Upload en cours...';

    // Désactiver le bouton
    const submitBtn = addNewsForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
        const response = await fetch('../script/upload-news.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Upload terminé !';
            showMessage('Actualité ajoutée avec succès !', 'success');

            // Réinitialiser
            addNewsForm.reset();
            newsPreview.innerHTML = '';

            // Recharger la liste
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                loadNews();
            }, 2000);
        } else {
            throw new Error(result.message || 'Erreur lors de l\'ajout');
        }
    } catch (error) {
        showMessage(error.message, 'error');
        progressText.textContent = 'Erreur lors de l\'upload';
    } finally {
        submitBtn.disabled = false;
    }
});

// Charger les actualités existantes
async function loadNews() {
    newsList.innerHTML = '<p class="loading">Chargement des actualités...</p>';

    try {
        const response = await fetch('../script/get-news.php');
        const result = await response.json();

        if (result.success) {
            displayNewsList(result.news);
        } else {
            newsList.innerHTML = '<p class="loading">Erreur lors du chargement</p>';
        }
    } catch (error) {
        console.error('Erreur:', error);
        newsList.innerHTML = '<p class="loading">Erreur lors du chargement</p>';
    }
}

// Afficher la liste des actualités
function displayNewsList(news) {
    if (news.length === 0) {
        newsList.innerHTML = '<p class="loading">Aucune actualité pour le moment</p>';
        return;
    }

    newsList.innerHTML = '';
    news.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'album-item';
        newsItem.innerHTML = `
            <div class="album-info">
                <div class="album-icon-display" style="border-radius: 10px; width: 120px; height: 68px; overflow: hidden;">
                    <img src="../assets/news/${item.filename}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="album-details">
                    <h4>${item.title}</h4>
                    <div class="album-meta">
                        <span>📅 ${new Date(item.timestamp * 1000).toLocaleDateString('fr-FR')}</span>
                        <span>📊 Position ${index + 1}</span>
                    </div>
                </div>
            </div>
            <div class="album-actions">
                <button class="delete-album-btn" onclick="deleteNews('${item.id}', '${item.title}')">
                    🗑️ Supprimer
                </button>
            </div>
        `;
        newsList.appendChild(newsItem);
    });
}

// Supprimer une actualité
async function deleteNews(newsId, newsTitle) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cette actualité ?\n"${newsTitle}"\n\nCette action est irréversible.`)) {
        return;
    }

    try {
        const response = await fetch('../script/delete-news.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newsId })
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Actualité supprimée avec succès', 'success');
            loadNews();
        } else {
            throw new Error(result.message || 'Erreur lors de la suppression');
        }
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

// Afficher un message
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const adminCard = document.querySelector('.admin-card');
    adminCard.insertBefore(messageDiv, adminCard.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Rendre la fonction deleteNews globale
window.deleteNews = deleteNews;
