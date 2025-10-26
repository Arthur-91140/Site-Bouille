<?php
header('Content-Type: application/json');

$galleryDataFile = '../assets/gallery/gallery-data.json';

// Vérifier si le fichier JSON existe
if (!file_exists($galleryDataFile)) {
    echo json_encode(['success' => true, 'albums' => []]);
    exit;
}

// Lire les données JSON
$jsonData = json_decode(file_get_contents($galleryDataFile), true);

if ($jsonData === null || !isset($jsonData['albums'])) {
    echo json_encode(['success' => true, 'albums' => []]);
    exit;
}

// Retourner les albums
echo json_encode([
    'success' => true,
    'albums' => $jsonData['albums']
]);
?>
