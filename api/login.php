<?php
// api/login.php
require_once 'config.php';

$data = getInputData();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        sendResponse(["error" => "Username and password are required"], 400);
    }

    try {
        $stmt = $pdo->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user) {
            $isValid = false;
            
            // Check if password is already hashed (Bcrypt usually starts with $2y$)
            if (strpos($user['password'], '$2y$') === 0) {
                $isValid = password_verify($password, $user['password']);
            } else {
                // If still plaintext, check directly
                if ($password === $user['password']) {
                    $isValid = true;
                    // AUTOMATIC MIGRATION TO HASH
                    $newHash = password_hash($password, PASSWORD_BCRYPT);
                    $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                    $updateStmt->execute([$newHash, $user['id']]);
                }
            }

            if ($isValid) {
                session_regenerate_id(true); // Prevent Session Fixation
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = $user['role'];
                
                sendResponse([
                    "success" => true,
                    "user" => [
                        "id" => $user['id'],
                        "username" => $user['username'],
                        "role" => $user['role']
                    ]
                ]);
            } else {
                sendResponse(["error" => "Username atau password salah"], 401);
            }
        } else {
            sendResponse(["error" => "Username atau password salah"], 401);
        }
    } catch (PDOException $e) {
        sendResponse(["error" => "Database error"], 500);
    }
} else {
    sendResponse(["error" => "Invalid request method"], 405);
}

