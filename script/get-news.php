<?php
header('Content-Type: application/json');

$newsDir = '../assets/news/';
$newsDataFile = '../assets/news/news-data.json';

// Vérifier si le dossier et le fichier existent
if (!file_exists($newsDataFile)) {
    echo json_encode(['success' => true, 'news' => []]);
    exit;
}

// Lire les données des actualités
$newsData = json_decode(file_get_contents($newsDataFile), true);

if ($newsData === null || !isset($newsData['news'])) {
    echo json_encode(['success' => true, 'news' => []]);
    exit;
}

// Trier par date (les plus récentes en premier)
usort($newsData['news'], function($a, $b) {
    return $b['timestamp'] - $a['timestamp'];
});

echo json_encode([
    'success' => true,
    'news' => $newsData['news']
]);
?>
