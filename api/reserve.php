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
    // We added user_id as the first column to insert
    $stmt = $conn->prepare("INSERT INTO reservations (user_id, transaction_id, first_name, last_name, email, phone, gov_id, guests, nationality, hotel, room_type, check_in, check_out, destinations, message, booked_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // "i" stands for integer (user_id), followed by the string parameters
    $stmt->bind_param("issssssissssssss", $_SESSION['user_id'], $data['transactionId'], $data['firstName'], $data['lastName'], $data['email'], $data['phone'], $data['govId'], $data['guests'], $data['nationality'], $data['hotel'], $data['roomType'], $data['checkIn'], $data['checkOut'], $data['destinations'], $data['message'], $data['bookedOn']);
    
    if ($stmt->execute()) { 
        echo json_encode(["success" => true, "id" => $data['transactionId']]); 
    } else { 
        echo json_encode(["success" => false, "message" => $stmt->error]); 
    }
    $stmt->close();
}
$conn->close();
?>