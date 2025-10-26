// Configuration
const ADMIN_PASSWORD = 'bouilles2025'; // À changer en production
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// État de l'application
let selectedFiles = [];
let isAuthenticated = false;

// Éléments du DOM
const authSection = document.getElementById('authSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const authError = document.getElementById('authError');
const logoutBtn = document.getElementById('logoutBtn');
const createAlbumForm = document.getElementById('createAlbumForm');
const albumPhotosInput = document.getElementById('albumPhotos');
const photoPreview = document.getElementById('photoPreview');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const albumsList = document.getElementById('albumsList');

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
    loadExistingAlbums();
}

// Afficher une erreur d'authentification
function showError(message) {
    authError.textContent = message;
    authError.style.display = 'block';
    setTimeout(() => {
        authError.style.display = 'none';
    }, 3000);
}

// Gestion de la sélection de fichiers
albumPhotosInput.addEventListener('change', handleFileSelect);

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    selectedFiles = [];
    photoPreview.innerHTML = '';

    files.forEach((file, index) => {
        // Vérifier le type de fichier
        if (!ALLOWED_TYPES.includes(file.type)) {
            showMessage(`Le fichier ${file.name} n'est pas un format d'image accepté`, 'error');
            return;
        }

        // Vérifier la taille
        if (file.size > MAX_FILE_SIZE) {
            showMessage(`Le fichier ${file.name} est trop volumineux (max 5 Mo)`, 'error');
            return;
        }

        selectedFiles.push(file);

        // Créer la prévisualisation
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'photo-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="photo-preview-remove" onclick="removePhoto(${index})">×</button>
            `;
            photoPreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

// Supprimer une photo de la sélection
function removePhoto(index) {
    selectedFiles.splice(index, 1);

    // Recréer l'affichage des prévisualisations
    photoPreview.innerHTML = '';
    selectedFiles.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'photo-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${idx + 1}">
                <button type="button" class="photo-preview-remove" onclick="removePhoto(${idx})">×</button>
            `;
            photoPreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });

    // Mettre à jour l'input file
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    albumPhotosInput.files = dataTransfer.files;
}

// Gestion de la création d'album
createAlbumForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
        showMessage('Veuillez sélectionner au moins une photo', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('albumId', document.getElementById('albumId').value.trim());
    formData.append('albumTitle', document.getElementById('albumTitle').value.trim());
    formData.append('albumDate', document.getElementById('albumDate').value.trim());
    formData.append('albumIcon', document.getElementById('albumIcon').value.trim());

    selectedFiles.forEach((file, index) => {
        formData.append('photos[]', file);
    });

    // Afficher la barre de progression
    uploadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Upload en cours...';

    // Désactiver le bouton
    const submitBtn = createAlbumForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
        const response = await fetch('../script/upload-album.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Upload terminé !';
            showMessage('Album créé avec succès !', 'success');

            // Réinitialiser le formulaire
            createAlbumForm.reset();
            selectedFiles = [];
            photoPreview.innerHTML = '';

            // Recharger la liste des albums
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                loadExistingAlbums();
            }, 2000);
        } else {
            throw new Error(result.message || 'Erreur lors de la création de l\'album');
        }
    } catch (error) {
        showMessage(error.message, 'error');
        progressText.textContent = 'Erreur lors de l\'upload';
    } finally {
        submitBtn.disabled = false;
    }
});

// Charger les albums existants
async function loadExistingAlbums() {
    albumsList.innerHTML = '<p class="loading">Chargement des albums...</p>';

    try {
        const response = await fetch('../script/get-albums.php');
        const result = await response.json();

        if (result.success) {
            displayAlbums(result.albums);
        } else {
            albumsList.innerHTML = '<p class="loading">Erreur lors du chargement des albums</p>';
        }
    } catch (error) {
        console.error('Erreur:', error);
        albumsList.innerHTML = '<p class="loading">Erreur lors du chargement des albums</p>';
    }
}

// Afficher les albums
function displayAlbums(albums) {
    if (albums.length === 0) {
        albumsList.innerHTML = '<p class="loading">Aucun album pour le moment</p>';
        return;
    }

    albumsList.innerHTML = '';
    albums.forEach(album => {
        const albumItem = document.createElement('div');
        albumItem.className = 'album-item';
        albumItem.innerHTML = `
            <div class="album-info">
                <div class="album-icon-display">${album.icon}</div>
                <div class="album-details">
                    <h4>${album.title}</h4>
                    <p>${album.date}</p>
                    <div class="album-meta">
                        <span>📁 ${album.id}</span>
                        <span>📸 ${album.photoCount} photo(s)</span>
                    </div>
                </div>
            </div>
            <div class="album-actions">
                <button class="delete-album-btn" onclick="deleteAlbum('${album.id}', '${album.title}')">
                    🗑️ Supprimer
                </button>
            </div>
        `;
        albumsList.appendChild(albumItem);
    });
}

// Supprimer un album
async function deleteAlbum(albumId, albumTitle) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'album "${albumTitle}" ?\nCette action est irréversible.`)) {
        return;
    }

    try {
        const response = await fetch('../script/delete-album.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ albumId })
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Album supprimé avec succès', 'success');
            loadExistingAlbums();
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

// Rendre la fonction removePhoto globale
window.removePhoto = removePhoto;
window.deleteAlbum = deleteAlbum;
