<?php
header('Content-Type: application/json');
require_once 'db.php';

// Start the session engine
session_start();
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        // Verify the provided password matches the hashed database password
        if (password_verify($data['password'], $row['password'])) {
            
            // Generate the secure session using the user's database ID
            $_SESSION['user_id'] = $row['id'];
            
            echo json_encode(["success" => true]);
            exit;
        }
    }
    echo json_encode(["success" => false, "message" => "Invalid email or password."]);
    $stmt->close();
}
$conn->close();
?>