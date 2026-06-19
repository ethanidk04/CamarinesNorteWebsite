<?php
header('Content-Type: application/json');
require_once 'db.php';

$response = ["reservations" => [], "tripplans" => []];

// Fetch Hotel Reservations
$res = $conn->query("SELECT * FROM reservations ORDER BY id DESC");
while ($row = $res->fetch_assoc()) {
    $response["reservations"][] = [
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

// Fetch Trip Plans
$res2 = $conn->query("SELECT * FROM trip_plans ORDER BY id DESC");
while ($row = $res2->fetch_assoc()) {
    $response["tripplans"][] = [
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
$conn->close();
?>