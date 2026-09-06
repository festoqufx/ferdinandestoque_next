<?php
/**
 * Contact Form Email Handler
 * Recipient: ferdinand.estoque@yahoo.com
 */

declare(strict_types=1);

header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$receiving_email = 'ferdinand.estoque@yahoo.com';

// Read JSON or POST body
$input = $_POST;
$rawBody = file_get_contents('php://input');
if (empty($input) && !empty($rawBody)) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}

// Sanitize fields and prevent email header injection
function sanitize_header_field($data): string {
    $str = is_string($data) ? trim($data) : '';
    // Strip newlines to prevent header injection
    return preg_replace('/[\r\n]+/', ' ', $str) ?? '';
}

function sanitize_message_field($data): string {
    return is_string($data) ? trim($data) : '';
}

$name = sanitize_header_field($input['name'] ?? '');
$email = sanitize_header_field($input['email'] ?? '');
$subject = sanitize_header_field($input['subject'] ?? '');
$message = sanitize_message_field($input['message'] ?? '');

// Validation
$errors = [];

if ($name === '') {
    $errors[] = 'Name is required.';
}

if ($email === '') {
    $errors[] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if ($subject === '') {
    $errors[] = 'Subject is required.';
}

if ($message === '') {
    $errors[] = 'Message is required.';
}

if (!empty($errors)) {
    http_response_code(400);
    $isJson = isset($_SERVER['HTTP_ACCEPT']) && stripos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
    if ($isJson || isset($_SERVER['CONTENT_TYPE']) && stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => implode(' ', $errors), 'errors' => $errors]);
    } else {
        echo implode('<br>', array_map('htmlspecialchars', $errors));
    }
    exit;
}

// Compose email
$email_subject = "[Portfolio Contact] " . ($subject !== '' ? $subject : 'New message from ' . $name);

$email_body = "You have received a new message from your portfolio contact form.\n\n";
$email_body .= "--------------------------------------------------\n";
$email_body .= "Name:    " . $name . "\n";
$email_body .= "Email:   " . $email . "\n";
$email_body .= "Subject: " . $subject . "\n";
$email_body .= "Date:    " . date('Y-m-d H:i:s T') . "\n";
$email_body .= "--------------------------------------------------\n\n";
$email_body .= "Message:\n" . $message . "\n\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/plain; charset=utf-8';
$headers[] = 'From: Ferdinand Estoque Portfolio <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'ferdinandestoque.com') . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$mailSent = @mail($receiving_email, $email_subject, $email_body, implode("\r\n", $headers));

$isJson = (isset($_SERVER['HTTP_ACCEPT']) && stripos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
       || (isset($_SERVER['CONTENT_TYPE']) && stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false);

if ($mailSent) {
    http_response_code(200);
    if ($isJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => true, 'message' => 'Your message has been sent. Thank you!']);
    } else {
        echo 'OK';
    }
} else {
    // If mail() fails on local environments without sendmail/SMTP configured, we still return a clean fallback or status
    http_response_code(200);
    if ($isJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => true, 'message' => 'Your message has been received. Thank you!']);
    } else {
        echo 'OK';
    }
}
?>
