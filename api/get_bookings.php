<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
// Added a success flag so the frontend knows it was authorized
$response = ["success" => true, "reservations" => [], "tripplans" => []];

// Only fetch reservations belonging to this specific user
$stmt = $conn->prepare("SELECT * FROM reservations WHERE user_id = ? ORDER BY id DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();
while ($row = $res->fetch_assoc()) {
    $response["reservations"][] = [
        "id" => $row["id"], // The crucial database ID needed for the Delete function
        "transactionId" => $row["transaction_id"],
        "firstName" => $row["first_name"],
        "lastName" => $row["last_name"],
        "govId" => $row["gov_id"],
        "hotel" => $row["hotel"],
        "roomType" => $row["room_type"],
        "checkIn" => $row["check_in"],
        "checkOut" => $row["check_out"],
        "guests" => $row["guests"],
        "status" => $row["status"],
        "bookedOn" => $row["booked_on"]
    ];
}

// Only fetch trip plans belonging to this specific user
$stmt2 = $conn->prepare("SELECT * FROM trip_plans WHERE user_id = ? ORDER BY id DESC");
$stmt2->bind_param("i", $user_id);
$stmt2->execute();
$res2 = $stmt2->get_result();
while ($row = $res2->fetch_assoc()) {
    $response["tripplans"][] = [
        "id" => $row["id"], // The crucial database ID needed for the Delete function
        "transactionId" => $row["transaction_id"],
        "name" => $row["name"],
        "travelDate" => $row["travel_date"],
        "travelers" => $row["travelers"],
        "duration" => $row["duration"],
        "budget" => $row["budget"],
        "destinations" => $row["destinations"],
        "status" => $row["status"],
        "submittedOn" => $row["submitted_on"]
    ];
}

echo json_encode($response);
$stmt->close(); 
$stmt2->close(); 
$conn->close();
?>