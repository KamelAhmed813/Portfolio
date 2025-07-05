<?php
// Simple PHP Email Form Handler
// Replace with your actual email address
$receiving_email_address = 'kamelahmed395@gmail.com';

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';
    
    // Basic validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all fields.']);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter a valid email address.']);
        exit;
    }
    
    // Prepare email content
    $email_subject = "New Contact Form Submission: " . $subject;
    $email_body = "You have received a new message from your website contact form.\n\n";
    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Subject: " . $subject . "\n";
    $email_body .= "Message:\n" . $message . "\n";
    
    // Email headers
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($receiving_email_address, $email_subject, $email_body, $headers)) {
        echo json_encode(['status' => 'success', 'message' => 'I recieved your message, Thank you for contacting me.<br>I will get back to you as soon as possible.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
    }
    
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
