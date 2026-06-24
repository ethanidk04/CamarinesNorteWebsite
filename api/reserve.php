<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

// Security Check: Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Please log in to book a hotel."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    // Schema update: Removed personal info fields. Relying solely on user_id.
    $stmt = $conn->prepare("INSERT INTO reservations (user_id, transaction_id, hotel, room_type, check_in, check_out, guests, destinations, message, booked_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // "i" for integer (user_id & guests), "s" for strings
    $stmt->bind_param("isssssisss", $_SESSION['user_id'], $data['transactionId'], $data['hotel'], $data['roomType'], $data['checkIn'], $data['checkOut'], $data['guests'], $data['destinations'], $data['message'], $data['bookedOn']);
    
    if ($stmt->execute()) { 
        echo json_encode(["success" => true, "id" => $data['transactionId']]); 
    } else { 
        echo json_encode(["success" => false, "message" => $stmt->error]); 
    }
    $stmt->close();
}
$conn->close();
?>