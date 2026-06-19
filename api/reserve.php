<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $stmt = $conn->prepare("INSERT INTO reservations (transaction_id, first_name, last_name, email, phone, gov_id, guests, nationality, hotel, room_type, check_in, check_out, destinations, message, booked_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param("ssssssissssssss", $data['transactionId'], $data['firstName'], $data['lastName'], $data['email'], $data['phone'], $data['govId'], $data['guests'], $data['nationality'], $data['hotel'], $data['roomType'], $data['checkIn'], $data['checkOut'], $data['destinations'], $data['message'], $data['bookedOn']);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "id" => $data['transactionId']]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    $stmt->close();
}
$conn->close();
?>