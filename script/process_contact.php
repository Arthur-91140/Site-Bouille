<?php
// process_contact.php
// Script pour traiter le formulaire de contact avec reCAPTCHA v3

// Configuration
$recaptcha_secret_key = '6LcM_KGrAAAAAIa22V-SDoELcpQpgOfaGK7u0Z1U';
$min_score = 0.5; // Score minimum pour considérer l'utilisateur comme humain

// Configuration email
$to_email = 'nounou.villebon.les.bouilles@gmail.com';
$from_email = 'noreply@ptitesbouilles.fr'; // Changez selon votre domaine

// Fonction pour vérifier le token reCAPTCHA
function verify_recaptcha($token, $secret_key) {
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = array(
        'secret' => $secret_key,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    );
    
    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        )
    );
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return json_decode($result);
}

// Fonction pour nettoyer les données d'entrée
function clean_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Fonction pour valider l'email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Headers pour JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Vérifier que c'est une requête POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Méthode non autorisée');
    }
    
    // Récupérer et nettoyer les données
    $nom = isset($_POST['nom']) ? clean_input($_POST['nom']) : '';
    $prenom = isset($_POST['prenom']) ? clean_input($_POST['prenom']) : '';
    $email = isset($_POST['email']) ? clean_input($_POST['email']) : '';
    $sujet = isset($_POST['sujet']) ? clean_input($_POST['sujet']) : '';
    $message = isset($_POST['message']) ? clean_input($_POST['message']) : '';
    $recaptcha_token = isset($_POST['recaptcha_token']) ? $_POST['recaptcha_token'] : '';
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    // Validation des champs obligatoires
    if (empty($nom)) {
        throw new Exception('Le nom est obligatoire');
    }
    
    if (empty($prenom)) {
        throw new Exception('Le prénom est obligatoire');
    }
    
    if (empty($email)) {
        throw new Exception('L\'email est obligatoire');
    }
    
    if (!validate_email($email)) {
        throw new Exception('Format d\'email invalide');
    }
    
    if (empty($sujet)) {
        throw new Exception('Le sujet est obligatoire');
    }
    
    if (empty($message)) {
        throw new Exception('Le message est obligatoire');
    }
    
    if (empty($recaptcha_token)) {
        throw new Exception('Token reCAPTCHA manquant');
    }
    
    // Vérifier le token reCAPTCHA
    $recaptcha_result = verify_recaptcha($recaptcha_token, $recaptcha_secret_key);
    
    if (!$recaptcha_result->success) {
        throw new Exception('Échec de la vérification reCAPTCHA');
    }
    
    // Vérifier le score (pour reCAPTCHA v3)
    if (isset($recaptcha_result->score) && $recaptcha_result->score < $min_score) {
        // Log pour analyse (optionnel)
        error_log("Score reCAPTCHA faible: " . $recaptcha_result->score . " pour IP: " . $_SERVER['REMOTE_ADDR']);
        throw new Exception('Score de sécurité insuffisant');
    }
    
    // Vérifier l'action (optionnel mais recommandé)
    if (isset($recaptcha_result->action) && $recaptcha_result->action !== $action) {
        throw new Exception('Action reCAPTCHA invalide');
    }
    
    // Préparer l'email
    $subject = 'Nouveau message depuis le site - ' . htmlspecialchars($sujet);
    
    $email_body = "
    <html>
    <head>
        <title>Nouveau message de contact</title>
    </head>
    <body>
        <h2>Nouveau message de contact</h2>
        <table style='border-collapse: collapse; width: 100%; max-width: 600px;'>
            <tr>
                <td style='padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold; width: 120px;'>Nom :</td>
                <td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($nom) . "</td>
            </tr>
            <tr>
                <td style='padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;'>Prénom :</td>
                <td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($prenom) . "</td>
            </tr>
            <tr>
                <td style='padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;'>Email :</td>
                <td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($email) . "</td>
            </tr>
            <tr>
                <td style='padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; font-weight: bold;'>Sujet :</td>
                <td style='padding: 8px; border: 1px solid #ddd;'>" . htmlspecialchars($sujet) . "</td>
            </tr>
        </table>
        
        <h3>Message :</h3>
        <div style='background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;'>
            " . nl2br(htmlspecialchars($message)) . "
        </div>
        
        <hr style='margin: 20px 0;'>
        <p><small style='color: #666;'>
            Message envoyé le " . date('d/m/Y à H:i:s') . "<br>
            IP: " . $_SERVER['REMOTE_ADDR'] . "<br>
            Score reCAPTCHA: " . (isset($recaptcha_result->score) ? $recaptcha_result->score : 'N/A') . "
        </small></p>
    </body>
    </html>
    ";
    
    // Headers pour email HTML
    $headers = array(
        'MIME-Version' => '1.0',
        'Content-type' => 'text/html; charset=UTF-8',
        'From' => $from_email,
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion()
    );
    
    $headers_string = '';
    foreach ($headers as $key => $value) {
        $headers_string .= $key . ': ' . $value . "\r\n";
    }
    
    // Envoyer l'email
    if (mail($to_email, $subject, $email_body, $headers_string)) {
        // Succès
        echo json_encode(array(
            'success' => true,
            'message' => 'Message envoyé avec succès'
        ));
    } else {
        throw new Exception('Échec de l\'envoi de l\'email');
    }
    
} catch (Exception $e) {
    // Erreur
    echo json_encode(array(
        'success' => false,
        'message' => $e->getMessage()
    ));
}

// Fonction alternative pour l'envoi d'email avec PHPMailer (plus robuste)
/*
// Si vous préférez utiliser PHPMailer (recommandé pour la production)
function send_email_with_phpmailer($to, $subject, $body, $reply_to) {
    require_once 'vendor/autoload.php'; // Charger PHPMailer via Composer
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Configuration SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; // Ou votre serveur SMTP
        $mail->SMTPAuth = true;
        $mail->Username = 'votre-email@gmail.com';
        $mail->Password = 'votre-mot-de-passe-app';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;
        
        // Destinataires
        $mail->setFrom('noreply@ptitesbouilles.fr', 'Les P\'tites Bouilles');
        $mail->addAddress($to);
        $mail->addReplyTo($reply_to);
        
        // Contenu
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Erreur PHPMailer: " . $mail->ErrorInfo);
        return false;
    }
}
*/
?>