<?php
header('Content-Type: application/json');

// Configuration
$maxFileSize = 5 * 1024 * 1024; // 5 Mo
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$newsDir = '../assets/news/';
$newsDataFile = '../assets/news/news-data.json';

// Créer le dossier s'il n'existe pas
if (!file_exists($newsDir)) {
    mkdir($newsDir, 0755, true);
}

// Vérifier la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données
$title = isset($_POST['title']) ? trim($_POST['title']) : '';

// Validation
if (empty($title)) {
    echo json_encode(['success' => false, 'message' => 'Le titre est requis']);
    exit;
}

// Vérifier le fichier
if (!isset($_FILES['newsFile']) || $_FILES['newsFile']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Aucun fichier uploadé ou erreur d\'upload']);
    exit;
}

$file = $_FILES['newsFile'];
$fileType = $file['type'];
$fileSize = $file['size'];
$fileTmpName = $file['tmp_name'];

// Vérifier le type
if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Type de fichier non autorisé']);
    exit;
}

// Vérifier la taille
if ($fileSize > $maxFileSize) {
    echo json_encode(['success' => false, 'message' => 'Fichier trop volumineux (max 5 Mo)']);
    exit;
}

// Générer un nom de fichier unique
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$filename = 'news-' . time() . '-' . uniqid() . '.' . $extension;
$destination = $newsDir . $filename;

// Déplacer le fichier
if (!move_uploaded_file($fileTmpName, $destination)) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement du fichier']);
    exit;
}

// Lire ou créer le fichier de données
$newsData = ['news' => []];
if (file_exists($newsDataFile)) {
    $existingData = json_decode(file_get_contents($newsDataFile), true);
    if ($existingData !== null) {
        $newsData = $existingData;
    }
}

// Ajouter la nouvelle actualité
$newsData['news'][] = [
    'id' => uniqid(),
    'title' => $title,
    'filename' => $filename,
    'timestamp' => time(),
    'date' => date('Y-m-d H:i:s')
];

// Sauvegarder
if (!file_put_contents($newsDataFile, json_encode($newsData, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde des données']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Actualité ajoutée avec succès',
    'filename' => $filename
]);
?>
