<?php
// Configuration des en-têtes pour éviter les erreurs CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Vérifier que la requête est bien en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer les données du formulaire
$nom = isset($_POST['nom']) ? trim($_POST['nom']) : '';
$prenom = isset($_POST['prenom']) ? trim($_POST['prenom']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telephone = isset($_POST['telephone']) ? trim($_POST['telephone']) : '';
$sujet = isset($_POST['sujet']) ? trim($_POST['sujet']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$consentement = isset($_POST['consentement']) ? $_POST['consentement'] : '';
$offre = isset($_POST['offre']) ? $_POST['offre'] : '';
$situations = isset($_POST['situation']) ? $_POST['situation'] : [];

// Validation des données
$erreurs = [];

if (empty($nom)) {
    $erreurs[] = 'Le nom est requis';
}

if (empty($prenom)) {
    $erreurs[] = 'Le prénom est requis';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs[] = 'Email invalide';
}

if (empty($sujet)) {
    $erreurs[] = 'Le sujet est requis';
}

if (empty($message)) {
    $erreurs[] = 'Le message est requis';
}

if (empty($consentement)) {
    $erreurs[] = 'Le consentement est requis';
}

if (empty($offre)) {
    $erreurs[] = 'Veuillez sélectionner une offre';
}

if (empty($situations)) {
    $erreurs[] = 'Veuillez sélectionner au moins une situation';
}

// Si il y a des erreurs, les retourner
if (!empty($erreurs)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $erreurs)]);
    exit;
}

// Configuration SMTP Gmail
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587;
$smtp_username = 'arthurpruvost91140@gmail.com';
$smtp_password = 'dmwj huku axir lfnv'; // Mot de passe d'application
$destinataire = 'nounou.villebon.les.bouilles@gmail.com';

// Traitement des données pour l'affichage
$situations_text = '';
foreach ($situations as $situation) {
    switch ($situation) {
        case 'parent_activite':
            $situations_text .= "- Parent à la recherche d'une activité pour votre bout'chou\n";
            break;
        case 'parent_employeur':
            $situations_text .= "- Parent employeur d'un(e) professionnel(le)\n";
            break;
        case 'assistante_maternelle':
            $situations_text .= "- Assistant(e) maternel(le)\n";
            break;
        case 'auxiliaire_parental':
            $situations_text .= "- Auxiliaire parental(e)\n";
            break;
    }
}

$offre_text = '';
switch ($offre) {
    case 'decouverte':
        $offre_text = 'Offre découverte (35€/trimestre)';
        break;
    case 'engagee':
        $offre_text = 'Offre engagée (95€/an)';
        break;
}

// Préparer le contenu de l'email
$sujet_email = '[Demande d\'adhésion] ' . $sujet;
$contenu_email = "
Nouvelle demande d'adhésion depuis le site web

INFORMATIONS PERSONNELLES:
Nom: $nom
Prénom: $prenom
Email: $email
Téléphone: " . ($telephone ?: 'Non renseigné') . "

SITUATION:
$situations_text

OFFRE CHOISIE:
$offre_text

SUJET:
$sujet

MESSAGE:
$message

---
Cette demande d'adhésion a été envoyée depuis le formulaire du site web.
Adresse IP: " . $_SERVER['REMOTE_ADDR'] . "
Date (GMT +0): " . date('Y-m-d H:i:s');

// Fonction pour envoyer l'email via SMTP (réutilisation de la fonction existante)
function envoyerEmailSMTP($smtp_host, $smtp_port, $smtp_username, $smtp_password, $destinataire, $expediteur, $nom_expediteur, $sujet, $message) {
    // Créer la connexion SMTP
    $smtp = fsockopen($smtp_host, $smtp_port, $errno, $errstr, 30);
    
    if (!$smtp) {
        return false;
    }
    
    // Fonction pour lire la réponse du serveur
    function lireReponse($smtp) {
        $response = '';
        while ($line = fgets($smtp, 4096)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $response;
    }
    
    // Fonction pour envoyer une commande
    function envoyerCommande($smtp, $commande) {
        fputs($smtp, $commande . "\r\n");
        return lireReponse($smtp);
    }
    
    try {
        // Salutation initiale
        lireReponse($smtp);
        
        // EHLO
        envoyerCommande($smtp, "EHLO localhost");
        
        // STARTTLS
        envoyerCommande($smtp, "STARTTLS");
        
        // Activer le chiffrement TLS
        stream_socket_enable_crypto($smtp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        
        // EHLO après TLS
        envoyerCommande($smtp, "EHLO localhost");
        
        // Authentification
        envoyerCommande($smtp, "AUTH LOGIN");
        envoyerCommande($smtp, base64_encode($smtp_username));
        envoyerCommande($smtp, base64_encode($smtp_password));
        
        // Expéditeur
        envoyerCommande($smtp, "MAIL FROM: <$expediteur>");
        
        // Destinataire
        envoyerCommande($smtp, "RCPT TO: <$destinataire>");
        
        // Début des données
        envoyerCommande($smtp, "DATA");
        
        // En-têtes et corps du message
        $headers = "From: $nom_expediteur <$expediteur>\r\n";
        $headers .= "Reply-To: $expediteur\r\n";
        $headers .= "Subject: $sujet\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "Content-Transfer-Encoding: 8bit\r\n";
        $headers .= "\r\n";
        
        fputs($smtp, $headers . $message . "\r\n.\r\n");
        lireReponse($smtp);
        
        // Fermeture
        envoyerCommande($smtp, "QUIT");
        fclose($smtp);
        
        return true;
        
    } catch (Exception $e) {
        fclose($smtp);
        return false;
    }
}

// Tentative d'envoi de l'email
$nom_expediteur = "$prenom $nom";
$resultat = envoyerEmailSMTP(
    $smtp_host, 
    $smtp_port, 
    $smtp_username, 
    $smtp_password, 
    $destinataire, 
    $email, 
    $nom_expediteur, 
    $sujet_email, 
    $contenu_email
);

if ($resultat) {
    echo json_encode([
        'success' => true, 
        'message' => 'Votre demande d\'adhésion a été envoyée avec succès ! Nous vous contacterons rapidement pour finaliser votre inscription.'
    ]);
} else {
    // Fallback avec la fonction mail() native de PHP
    $headers = "From: $nom_expediteur <$smtp_username>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if (mail($destinataire, $sujet_email, $contenu_email, $headers)) {
        echo json_encode([
            'success' => true, 
            'message' => 'Votre demande d\'adhésion a été envoyée avec succès ! Nous vous contacterons rapidement pour finaliser votre inscription.'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Erreur lors de l\'envoi de votre demande. Veuillez réessayer ou nous contacter directement par téléphone.'
        ]);
    }
}
?>