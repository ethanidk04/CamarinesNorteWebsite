<?php
header('Content-Type: application/json');
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    // Hash the password securely using PHP's built-in bcrypt
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $data['firstName'], $data['lastName'], $data['email'], $hashedPassword);
    
    // If successful, return true. If it fails (likely due to a duplicate email), return an error.
    if ($stmt->execute()) { 
        echo json_encode(["success" => true]); 
    } else { 
        echo json_encode(["success" => false, "message" => "Email already registered."]); 
    }
    $stmt->close();
}
$conn->close();
?>