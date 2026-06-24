<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

// Security check
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    $user_id = $_SESSION['user_id'];
    $id = intval($data['id']);

    // Check if we are updating a Hotel Reservation or a Trip Plan
    if ($data['target'] === 'reservation') {
        $stmt = $conn->prepare("UPDATE reservations SET check_in=?, check_out=?, guests=? WHERE id=? AND user_id=?");
        $stmt->bind_param("sssii", $data['checkIn'], $data['checkOut'], $data['guests'], $id, $user_id);
    } else {
        $stmt = $conn->prepare("UPDATE trip_plans SET travel_date=?, duration=?, travelers=? WHERE id=? AND user_id=?");
        $stmt->bind_param("sssii", $data['travelDate'], $data['duration'], $data['travelers'], $id, $user_id);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Update failed."]);
    }
    $stmt->close();
}
$conn->close();
?>