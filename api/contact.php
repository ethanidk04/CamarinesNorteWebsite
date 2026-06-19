<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $stmt = $conn->prepare("INSERT INTO contacts (transaction_id, name, email, subject, message, sent_on) VALUES (?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("ssssss", $data['transactionId'], $data['name'], $data['email'], $data['subject'], $data['message'], $data['sentOn']);
    
    $stmt->execute();
    echo json_encode(["success" => true]);
    $stmt->close();
}
$conn->close();
?>