<?php
// api/config.php

// Secure Session Settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    ini_set('session.cookie_secure', 1);
}
session_start(); 

// Detect environment
$is_localhost = ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['REMOTE_ADDR'] === '127.0.0.1');

// Suppress errors in production
if (!$is_localhost) {
    error_reporting(0);
    ini_set('display_errors', 0);
}

if ($is_localhost) {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    $host = 'localhost';
    $db_name = 'bpkadumum';
    $username = 'root';
    $password = '';
} else {
    // Dynamic origin to handle HTTP/HTTPS mismatches on InfinityFree
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : (isset($_SERVER['HTTPS']) ? "https://" : "http://") . $_SERVER['HTTP_HOST'];
    header("Access-Control-Allow-Origin: $origin");
    
    $host = 'sql303.infinityfree.com'; 
    $db_name = 'if0_41949154_bpkadumum';
    $username = 'if0_41949154';
    $password = '1RQpSwP0ZzR';
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS requests immediately to bypass security system checks if possible
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    if ($is_localhost) {
        echo json_encode(["error" => "Connection failed: " . $e->getMessage()]);
    } else {
        echo json_encode(["error" => "Database connection failed"]);
    }
    exit();
}


/**
 * Fungsi ini WAJIB ada agar file lain tidak Error 500
 */
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

function getInputData() {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    if ($data === null) {
        return $_POST;
    }
    return $data;
}


