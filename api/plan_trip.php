<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $stmt = $conn->prepare("INSERT INTO trip_plans (transaction_id, name, email, travel_date, travelers, duration, budget, destinations, notes, submitted_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("ssssisssss", $data['transactionId'], $data['name'], $data['email'], $data['travelDate'], $data['travelers'], $data['duration'], $data['budget'], $data['destinations'], $data['notes'], $data['submittedOn']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $data['transactionId']]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    $stmt->close();
}
$conn->close();
?>