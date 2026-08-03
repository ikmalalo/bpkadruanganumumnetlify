<?php
// scratch/db-test.php
require_once __DIR__ . '/../api/config.php';
try {
    $stmt = $pdo->query("SELECT id, username, password, role FROM users");
    $users = $stmt->fetchAll();
    echo json_encode($users, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
