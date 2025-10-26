<?php
header('Content-Type: application/json');

$newsDir = '../assets/news/';
$newsDataFile = '../assets/news/news-data.json';

// Vérifier la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données JSON
$inputData = json_decode(file_get_contents('php://input'), true);

if (!isset($inputData['newsId']) || empty($inputData['newsId'])) {
    echo json_encode(['success' => false, 'message' => 'ID d\'actualité manquant']);
    exit;
}

$newsId = trim($inputData['newsId']);

// Lire les données
if (!file_exists($newsDataFile)) {
    echo json_encode(['success' => false, 'message' => 'Fichier de données introuvable']);
    exit;
}

$newsData = json_decode(file_get_contents($newsDataFile), true);

if ($newsData === null || !isset($newsData['news'])) {
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
    exit;
}

// Trouver et supprimer l'actualité
$found = false;
$filename = null;

foreach ($newsData['news'] as $index => $news) {
    if ($news['id'] === $newsId) {
        $filename = $news['filename'];
        array_splice($newsData['news'], $index, 1);
        $found = true;
        break;
    }
}

if (!$found) {
    echo json_encode(['success' => false, 'message' => 'Actualité introuvable']);
    exit;
}

// Supprimer le fichier image
if ($filename && file_exists($newsDir . $filename)) {
    if (!unlink($newsDir . $filename)) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression du fichier']);
        exit;
    }
}

// Sauvegarder les données mises à jour
if (!file_put_contents($newsDataFile, json_encode($newsData, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la sauvegarde des données']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Actualité supprimée avec succès'
]);
?>
