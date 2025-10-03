<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $service = $_POST['service'];
    $message = $_POST['message'];
    $recaptcha = $_POST['g-recaptcha-response'];

    // reCAPTCHA secret key
    $secret = 'YOUR_RECAPTCHA_SECRET_KEY'; // Replace with your secret key

    // Verify reCAPTCHA
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$recaptcha");
    $responseKeys = json_decode($response, true);

    if (intval($responseKeys["success"]) !== 1) {
        echo 'reCAPTCHA verification failed.';
        exit;
    }

    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        echo 'Please fill in all required fields.';
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Invalid email format.';
        exit;
    }

    // Email details
    $to = 'recipient@example.com'; // Replace with recipient email
    $subject = 'Contact Form Submission';
    $body = "Name: $name\nEmail: $email\nService: $service\nMessage: $message";
    $headers = "From: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo 'Email sent successfully.';
    } else {
        echo 'Error sending email.';
    }
} else {
    echo 'Invalid request.';
}
?>
