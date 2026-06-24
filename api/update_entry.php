<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if ($data) {
    $user_id = $_SESSION['user_id'];
    $id = intval($data['id']);

    if ($data['target'] === 'reservation') {
        $stmt = $conn->prepare("UPDATE reservations SET check_in=?, check_out=?, guests=? WHERE id=? AND user_id=?");
        $stmt->bind_param("sssii", $data['checkIn'], $data['checkOut'], $data['guests'], $id, $user_id);
    } else {
        // Schema update: changed to start_date and end_date
        $stmt = $conn->prepare("UPDATE trip_plans SET start_date=?, end_date=?, travelers=? WHERE id=? AND user_id=?");
        $stmt->bind_param("sssii", $data['startDate'], $data['endDate'], $data['travelers'], $id, $user_id);
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