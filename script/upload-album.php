<?php
header('Content-Type: application/json');

// Configuration
$maxFileSize = 5 * 1024 * 1024; // 5 Mo
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$uploadDir = '../assets/';
$galleryDataFile = '../assets/gallery/gallery-data.json';

// Vérifier que le dossier de destination existe
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Vérifier la méthode de requête
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données du formulaire
$albumId = isset($_POST['albumId']) ? trim($_POST['albumId']) : '';
$albumTitle = isset($_POST['albumTitle']) ? trim($_POST['albumTitle']) : '';
$albumDate = isset($_POST['albumDate']) ? trim($_POST['albumDate']) : '';
$albumIcon = isset($_POST['albumIcon']) ? trim($_POST['albumIcon']) : '';

// Validation des champs
if (empty($albumId) || empty($albumTitle) || empty($albumDate) || empty($albumIcon)) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont requis']);
    exit;
}

// Valider le format de l'ID (uniquement lettres minuscules, chiffres et tirets)
if (!preg_match('/^[a-z0-9-]+$/', $albumId)) {
    echo json_encode(['success' => false, 'message' => 'Format d\'ID invalide. Utilisez uniquement des lettres minuscules, chiffres et tirets']);
    exit;
}

// Vérifier si des fichiers ont été uploadés
if (!isset($_FILES['photos']) || empty($_FILES['photos']['name'][0])) {
    echo json_encode(['success' => false, 'message' => 'Aucune photo sélectionnée']);
    exit;
}

// Créer le dossier de l'album
$albumFolder = $uploadDir . 'photos-' . $albumId;
if (file_exists($albumFolder)) {
    echo json_encode(['success' => false, 'message' => 'Un album avec cet ID existe déjà']);
    exit;
}

if (!mkdir($albumFolder, 0755, true)) {
    echo json_encode(['success' => false, 'message' => 'Impossible de créer le dossier de l\'album']);
    exit;
}

// Traiter les fichiers
$uploadedFiles = [];
$photoCount = count($_FILES['photos']['name']);

for ($i = 0; $i < $photoCount; $i++) {
    $fileName = $_FILES['photos']['name'][$i];
    $fileTmpName = $_FILES['photos']['tmp_name'][$i];
    $fileSize = $_FILES['photos']['size'][$i];
    $fileError = $_FILES['photos']['error'][$i];
    $fileType = $_FILES['photos']['type'][$i];

    // Vérifier les erreurs
    if ($fileError !== UPLOAD_ERR_OK) {
        // Nettoyer les fichiers déjà uploadés
        cleanupFolder($albumFolder);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'upload du fichier: ' . $fileName]);
        exit;
    }

    // Vérifier le type
    if (!in_array($fileType, $allowedTypes)) {
        cleanupFolder($albumFolder);
        echo json_encode(['success' => false, 'message' => 'Type de fichier non autorisé: ' . $fileName]);
        exit;
    }

    // Vérifier la taille
    if ($fileSize > $maxFileSize) {
        cleanupFolder($albumFolder);
        echo json_encode(['success' => false, 'message' => 'Fichier trop volumineux: ' . $fileName]);
        exit;
    }

    // Générer un nom de fichier sécurisé avec le pattern folderName + numéro
    $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $newFileName = 'photos-' . $albumId . ($i + 1) . '.' . $extension;
    $destination = $albumFolder . '/' . $newFileName;

    // Déplacer le fichier
    if (!move_uploaded_file($fileTmpName, $destination)) {
        cleanupFolder($albumFolder);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement du fichier: ' . $fileName]);
        exit;
    }

    $uploadedFiles[] = $newFileName;
}

// Mettre à jour le fichier JSON
if (!updateGalleryJson($albumId, $albumTitle, $albumDate, $albumIcon, 'photos-' . $albumId, count($uploadedFiles))) {
    echo json_encode(['success' => false, 'message' => 'Album créé mais erreur lors de la mise à jour du fichier JSON']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Album créé avec succès',
    'albumId' => $albumId,
    'photoCount' => count($uploadedFiles)
]);

// Fonction pour nettoyer un dossier
function cleanupFolder($folder) {
    if (is_dir($folder)) {
        $files = glob($folder . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        rmdir($folder);
    }
}

// Fonction pour mettre à jour le fichier JSON
function updateGalleryJson($albumId, $title, $date, $icon, $folderName, $photoCount) {
    global $galleryDataFile;

    // Lire ou créer les données
    $galleryData = ['albums' => []];
    if (file_exists($galleryDataFile)) {
        $existingData = json_decode(file_get_contents($galleryDataFile), true);
        if ($existingData !== null && isset($existingData['albums'])) {
            $galleryData = $existingData;
        }
    }

    // Ajouter le nouvel album
    $galleryData['albums'][] = [
        'id' => $albumId,
        'title' => $title,
        'date' => $date,
        'icon' => $icon,
        'folderName' => $folderName,
        'photoCount' => $photoCount,
        'timestamp' => time()
    ];

    // Sauvegarder
    return file_put_contents($galleryDataFile, json_encode($galleryData, JSON_PRETTY_PRINT)) !== false;
}
?>
