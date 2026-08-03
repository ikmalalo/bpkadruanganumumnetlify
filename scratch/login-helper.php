<?php
// scratch/login-helper.php
require_once __DIR__ . '/../api/config.php';
$_SESSION['user_id'] = 1;
$_SESSION['username'] = 'umumadmin';
$_SESSION['role'] = 'admin';
echo json_encode(["success" => true, "message" => "Logged in programmatically for testing"]);
?>
