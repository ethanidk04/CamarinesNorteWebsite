<?php
header('Content-Type: application/json');
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    // Hash the password securely using PHP's built-in bcrypt
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
    
    // Schema update: Included phone, gov_id, and nationality
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, phone, gov_id, nationality) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Default to 'Filipino' if nationality isn't provided by the frontend
    $nationality = isset($data['nationality']) ? $data['nationality'] : 'Filipino';
    
    $stmt->bind_param("sssssss", $data['firstName'], $data['lastName'], $data['email'], $hashedPassword, $data['phone'], $data['govId'], $nationality);
    
    if ($stmt->execute()) { 
        echo json_encode(["success" => true]); 
    } else { 
        echo json_encode(["success" => false, "message" => "Email already registered or missing data."]); 
    }
    $stmt->close();
}
$conn->close();
?>