<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

// Security Check: If there is no active session, kick them out
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Please login first."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    // Determine which table they are trying to delete from based on the frontend payload
    $table = ($data['target'] === 'reservation') ? 'reservations' : 'trip_plans';
    
    // The query specifically checks if the user_id matches the logged-in person
    $stmt = $conn->prepare("DELETE FROM $table WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $data['id'], $_SESSION['user_id']);
    
    if ($stmt->execute() && $conn->affected_rows > 0) { 
        echo json_encode(["success" => true]); 
    } else { 
        echo json_encode(["success" => false, "message" => "Failed to cancel. You may not have permission."]); 
    }
    $stmt->close();
}
$conn->close();
?>