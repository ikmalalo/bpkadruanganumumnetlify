<?php
// api/kgb_riwayat.php
require_once 'config.php';

if (!isLoggedIn()) {
    sendResponse(["error" => "Unauthorized"], 401);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT id, pegawai_id, nip, nama, golongan, mkg, jabatan, gaji_lama as gajiLama, gaji_baru as gajiBaru, periode_awal as periodeAwal, periode_akhir as periodeAkhir, tanggal_proses as tanggalProses FROM kgb_riwayat ORDER BY tanggal_proses DESC");
            $history = $stmt->fetchAll();
            sendResponse($history);
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        // This handles multiple records at once (from Dashboard batch process)
        if (isset($data['records']) && is_array($data['records'])) {
            try {
                $pdo->beginTransaction();
                $stmt = $pdo->prepare("INSERT INTO kgb_riwayat (pegawai_id, nip, nama, golongan, mkg, jabatan, gaji_lama, gaji_baru, periode_awal, periode_akhir) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                foreach ($data['records'] as $r) {
                    $stmt->execute([
                        $r['pegawai_id'], $r['nip'], $r['nama'], $r['golongan'], $r['mkg'], 
                        $r['jabatan'], $r['gajiLama'], $r['gajiBaru'], $r['periodeAwal'], $r['periodeAkhir']
                    ]);
                }
                
                $pdo->commit();
                sendResponse(["success" => true, "message" => count($data['records']) . " records processed"]);
            } catch (PDOException $e) {
                $pdo->rollBack();
                sendResponse(["error" => $e->getMessage()], 500);
            }
        } else {
            // Single record
            try {
                $stmt = $pdo->prepare("INSERT INTO kgb_riwayat (pegawai_id, nip, nama, golongan, mkg, jabatan, gaji_lama, gaji_baru, periode_awal, periode_akhir) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['pegawai_id'], $data['nip'], $data['nama'], $data['golongan'], $data['mkg'], 
                    $data['jabatan'], $data['gajiLama'], $data['gajiBaru'], $data['periodeAwal'], $data['periodeAkhir']
                ]);
                sendResponse(["success" => true, "message" => "Record added"]);
            } catch (PDOException $e) {
                sendResponse(["error" => $e->getMessage()], 500);
            }
        }
        break;

    case 'DELETE':
        $ids = $_GET['ids'] ?? '';
        if ($ids) {
            $idArray = explode(',', $ids);
            $placeholders = implode(',', array_fill(0, count($idArray), '?'));
            try {
                $stmt = $pdo->prepare("DELETE FROM kgb_riwayat WHERE id IN ($placeholders)");
                $stmt->execute($idArray);
                sendResponse(["success" => true, "message" => "Riwayat berhasil dibatalkan"]);
            } catch (PDOException $e) {
                sendResponse(["error" => $e->getMessage()], 500);
            }
        } else {
            sendResponse(["error" => "No IDs provided"], 400);
        }
        break;

    default:
        sendResponse(["error" => "Method not allowed"], 405);
        break;
}
?>
