<?php
header('Content-Type: application/json');

// Configuration
$galleryDir = '../assets/';
$galleryDataFile = '../assets/gallery/gallery-data.json';

// Vérifier la méthode de requête
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données JSON
$inputData = json_decode(file_get_contents('php://input'), true);

if (!isset($inputData['albumId']) || empty($inputData['albumId'])) {
    echo json_encode(['success' => false, 'message' => 'ID d\'album manquant']);
    exit;
}

$albumId = trim($inputData['albumId']);

// Valider le format de l'ID
if (!preg_match('/^[a-z0-9-]+$/', $albumId)) {
    echo json_encode(['success' => false, 'message' => 'Format d\'ID invalide']);
    exit;
}

// Chemin du dossier de l'album
$albumFolder = $galleryDir . 'photos-' . $albumId;

// Vérifier que le dossier existe
if (!is_dir($albumFolder)) {
    echo json_encode(['success' => false, 'message' => 'Album introuvable']);
    exit;
}

// Supprimer tous les fichiers du dossier
$files = glob($albumFolder . '/*');
foreach ($files as $file) {
    if (is_file($file)) {
        if (!unlink($file)) {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression des fichiers']);
            exit;
        }
    }
}

// Supprimer le dossier
if (!rmdir($albumFolder)) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression du dossier']);
    exit;
}

// Mettre à jour le fichier JSON
if (!removeFromGalleryJson($albumId)) {
    echo json_encode(['success' => false, 'message' => 'Dossier supprimé mais erreur lors de la mise à jour du fichier JSON']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Album supprimé avec succès'
]);

// Fonction pour retirer un album du JSON
function removeFromGalleryJson($albumId) {
    global $galleryDataFile;

    if (!file_exists($galleryDataFile)) {
        return false;
    }

    $galleryData = json_decode(file_get_contents($galleryDataFile), true);

    if ($galleryData === null || !isset($galleryData['albums'])) {
        return false;
    }

    // Filtrer pour retirer l'album
    $galleryData['albums'] = array_values(array_filter($galleryData['albums'], function($album) use ($albumId) {
        return $album['id'] !== $albumId;
    }));

    // Sauvegarder
    return file_put_contents($galleryDataFile, json_encode($galleryData, JSON_PRETTY_PRINT)) !== false;
}
?>
