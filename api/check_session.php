<?php
header('Content-Type: application/json');
require_once 'db.php';
session_start();

if (isset($_SESSION['user_id'])) {
    $stmt = $conn->prepare("SELECT first_name, last_name, email FROM users WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['user_id']);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($user = $res->fetch_assoc()) {
        echo json_encode([
            "loggedIn" => true,
            "user" => [
                "firstName" => $user["first_name"],
                "lastName" => $user["last_name"],
                "email" => $user["email"]
            ]
        ]);
        exit;
    }
    echo json_encode(["loggedIn" => true]);
    exit;
}
echo json_encode(["loggedIn" => false]);
?>