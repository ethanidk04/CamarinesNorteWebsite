<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$response = ["success" => true, "reservations" => [], "tripplans" => []];

// Schema Update: JOIN the users table to retrieve first_name, last_name, and gov_id
$stmt = $conn->prepare("
    SELECT r.*, u.first_name, u.last_name, u.gov_id 
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    WHERE r.user_id = ? ORDER BY r.id DESC
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();
while ($row = $res->fetch_assoc()) {
    $response["reservations"][] = [
        "id" => $row["id"],
        "transactionId" => $row["transaction_id"],
        "firstName" => $row["first_name"], // Now coming from the JOINed users table
        "lastName" => $row["last_name"],   // Now coming from the JOINed users table
        "govId" => $row["gov_id"],         // Now coming from the JOINed users table
        "hotel" => $row["hotel"],
        "roomType" => $row["room_type"],
        "checkIn" => $row["check_in"],
        "checkOut" => $row["check_out"],
        "guests" => $row["guests"],
        "status" => $row["status"],
        "bookedOn" => $row["booked_on"]
    ];
}

// Do the same JOIN for trip plans
$stmt2 = $conn->prepare("
    SELECT t.*, u.first_name, u.last_name 
    FROM trip_plans t
    JOIN users u ON t.user_id = u.id
    WHERE t.user_id = ? ORDER BY t.id DESC
");
$stmt2->bind_param("i", $user_id);
$stmt2->execute();
$res2 = $stmt2->get_result();
while ($row = $res2->fetch_assoc()) {
    $response["tripplans"][] = [
        "id" => $row["id"],
        "transactionId" => $row["transaction_id"],
        "name" => $row["first_name"] . " " . $row["last_name"], 
        "tripName" => $row["trip_name"],
        "startDate" => $row["start_date"], // Updated to new schema
        "endDate" => $row["end_date"],     // Updated to new schema
        "travelers" => $row["travelers"],
        "destination" => $row["destination"],
        "transportMode" => $row["transport_mode"],
        "budget" => $row["budget"],
        "status" => $row["status"],
        "submittedOn" => $row["submitted_on"]
    ];
}

echo json_encode($response);
$stmt->close(); 
$stmt2->close(); 
$conn->close();
?>