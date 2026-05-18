<?php
// api/sertifikat.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !isLoggedIn()) {
    sendResponse(["error" => "Unauthorized"], 401);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM sertifikat ORDER BY tanggal_upload DESC");
            $certs = $stmt->fetchAll();
            sendResponse($certs);
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    case 'POST':
        // Handling Upload
        $nama_penerima = $_POST['nama_penerima'] ?? '';
        $penghargaan = $_POST['penghargaan'] ?? '';
        $tanggal = $_POST['tanggal'] ?? date('Y-m-d');
        
        $file_path = null;
        
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
            $allowed_extensions = ['jpg', 'jpeg', 'png', 'pdf'];
            $file_extension = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
            
            if (!in_array($file_extension, $allowed_extensions)) {
                sendResponse(["error" => "Tipe file tidak diizinkan! Hanya JPG, PNG, dan PDF."], 400);
            }

            // Check MIME type for extra security
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $_FILES['foto']['tmp_name']);
            finfo_close($finfo);
            
            $allowed_mimes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!in_array($mime, $allowed_mimes)) {
                sendResponse(["error" => "Isi file tidak valid!"], 400);
            }

            $upload_dir = 'uploads/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $file_name = uniqid() . '.' . $file_extension;
            $target_file = $upload_dir . $file_name;
            
            if (move_uploaded_file($_FILES['foto']['tmp_name'], $target_file)) {
                $file_path = $target_file;
            } else {
                sendResponse(["error" => "Failed to move uploaded file"], 500);
            }
        } else if (isset($_POST['foto_base64'])) {
            // Fallback for base64 if needed, though we prefer file upload
            $base64_string = $_POST['foto_base64'];
            $data = explode(',', $base64_string);
            $content = base64_decode(end($data));
            $file_name = uniqid() . '.png'; // Default to png
            $target_file = 'uploads/' . $file_name;
            file_put_contents($target_file, $content);
            $file_path = $target_file;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO sertifikat (nama_penerima, penghargaan, foto, tanggal_upload) VALUES (?, ?, ?, ?)");
            $stmt->execute([$nama_penerima, $penghargaan, $file_path, $tanggal]);
            sendResponse(["success" => true, "message" => "Sertifikat uploaded", "id" => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            sendResponse(["error" => "ID is required"], 400);
        }
        try {
            // Get file path first to delete the file
            $stmt = $pdo->prepare("SELECT foto FROM sertifikat WHERE id = ?");
            $stmt->execute([$id]);
            $cert = $stmt->fetch();
            
            if ($cert && $cert['foto'] && file_exists($cert['foto'])) {
                unlink($cert['foto']);
            }
            
            $stmt = $pdo->prepare("DELETE FROM sertifikat WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(["success" => true, "message" => "Sertifikat deleted"]);
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    default:
        sendResponse(["error" => "Method not allowed"], 405);
        break;
}
?>
