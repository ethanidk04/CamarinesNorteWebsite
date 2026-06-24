<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Please log in to plan a trip."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    // Schema update: Completely revamped columns
    $stmt = $conn->prepare("INSERT INTO trip_plans (user_id, transaction_id, trip_name, start_date, end_date, travelers, destination, tourist_spots, transport_mode, budget, notes, submitted_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // "i" for integer (user_id & travelers), "s" for strings
    $stmt->bind_param("issssissssss", $_SESSION['user_id'], $data['transactionId'], $data['tripName'], $data['startDate'], $data['endDate'], $data['travelers'], $data['destination'], $data['touristSpots'], $data['transportMode'], $data['budget'], $data['notes'], $data['submittedOn']);
    
    if ($stmt->execute()) { 
        echo json_encode(["success" => true, "id" => $data['transactionId']]); 
    } else { 
        echo json_encode(["success" => false, "message" => $stmt->error]); 
    }
    $stmt->close();
}
$conn->close();
?>