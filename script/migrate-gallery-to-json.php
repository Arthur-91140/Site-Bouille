<?php
// Script de migration des données de galerie vers JSON
// À exécuter une seule fois

$galleryJsFile = './gallery.js';
$outputJsonFile = '../assets/gallery/gallery-data.json';

// Créer le dossier si nécessaire
if (!file_exists('../assets/gallery/')) {
    mkdir('../assets/gallery/', 0755, true);
}

// Lire le fichier gallery.js
if (!file_exists($galleryJsFile)) {
    die(json_encode(['success' => false, 'message' => 'Fichier gallery.js introuvable']));
}

$jsContent = file_get_contents($galleryJsFile);

// Extraire le contenu de albumsData
preg_match('/const albumsData = \{(.*?)\};/s', $jsContent, $matches);

if (!isset($matches[1])) {
    die(json_encode(['success' => false, 'message' => 'Impossible de parser gallery.js']));
}

$albumsContent = $matches[1];
$albums = [];

// Parser ligne par ligne
$lines = explode("\n", $albumsContent);
$currentAlbum = null;
$albumData = [];

foreach ($lines as $line) {
    $line = trim($line);

    // Détecter le début d'un nouvel album
    if (preg_match('/"([^"]+)":\s*\{/', $line, $idMatch)) {
        if ($currentAlbum !== null && isset($albumData['title']) && isset($albumData['date']) && isset($albumData['icon']) && isset($albumData['photoCount'])) {
            $albums[] = [
                'id' => $currentAlbum,
                'title' => $albumData['title'],
                'date' => $albumData['date'],
                'icon' => $albumData['icon'],
                'folderName' => $albumData['folderName'],
                'photoCount' => $albumData['photoCount'],
                'timestamp' => time()
            ];
        }
        $currentAlbum = $idMatch[1];
        $albumData = [];
    }

    // Extraire les propriétés
    if (preg_match('/title:\s*"([^"]+)"/', $line, $titleMatch)) {
        $albumData['title'] = $titleMatch[1];
    }
    if (preg_match('/date:\s*"([^"]+)"/', $line, $dateMatch)) {
        $albumData['date'] = $dateMatch[1];
    }
    if (preg_match('/icon:\s*"([^"]+)"/', $line, $iconMatch)) {
        $albumData['icon'] = $iconMatch[1];
    }
    if (preg_match('/generatePhotos\("([^"]+)",\s*(\d+)/', $line, $photosMatch)) {
        $albumData['folderName'] = $photosMatch[1];
        $albumData['photoCount'] = (int)$photosMatch[2];
    }
}

// Ajouter le dernier album
if ($currentAlbum !== null && isset($albumData['title']) && isset($albumData['date']) && isset($albumData['icon']) && isset($albumData['photoCount'])) {
    $albums[] = [
        'id' => $currentAlbum,
        'title' => $albumData['title'],
        'date' => $albumData['date'],
        'icon' => $albumData['icon'],
        'folderName' => $albumData['folderName'],
        'photoCount' => $albumData['photoCount'],
        'timestamp' => time()
    ];
}

// Créer le fichier JSON
$jsonData = [
    'albums' => $albums,
    'migrated_at' => date('Y-m-d H:i:s'),
    'total' => count($albums)
];

if (file_put_contents($outputJsonFile, json_encode($jsonData, JSON_PRETTY_PRINT))) {
    echo json_encode([
        'success' => true,
        'message' => 'Migration réussie',
        'albums_count' => count($albums),
        'albums' => $albums
    ], JSON_PRETTY_PRINT);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'écriture du fichier JSON']);
}
?>
