<?php
// api/kgb_pegawai.php
require_once 'config.php';

if (!isLoggedIn()) {
    sendResponse(["error" => "Unauthorized"], 401);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            $id = $_GET['id'] ?? null;
            if ($id) {
                $stmt = $pdo->prepare("SELECT id, nip, nama, golongan, mkg, jabatan, tahun_awal as tahunAwal, tahun_akhir as tahunAkhir, gaji, unit FROM kgb_pegawai WHERE id = ?");
                $stmt->execute([$id]);
                $emp = $stmt->fetch();
                sendResponse($emp);
            } else {
                $stmt = $pdo->query("SELECT id, nip, nama, golongan, mkg, jabatan, tahun_awal as tahunAwal, tahun_akhir as tahunAkhir, gaji, unit FROM kgb_pegawai ORDER BY nama ASC");
                $employees = $stmt->fetchAll();
                sendResponse($employees);
            }
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $nip = $data['nip'] ?? '';
        $nama = $data['nama'] ?? '';
        $golongan = $data['golongan'] ?? '';
        $mkg = $data['mkg'] ?? '';
        $jabatan = $data['jabatan'] ?? '';
        $tahun_awal = $data['tahunAwal'] ?? '';
        $tahun_akhir = $data['tahunAkhir'] ?? '';
        $gaji = $data['gaji'] ?? '';
        $unit = $data['unit'] ?? '';

        try {
            if (isset($data['id']) && !empty($data['id'])) {
                // Update
                $stmt = $pdo->prepare("UPDATE kgb_pegawai SET nip=?, nama=?, golongan=?, mkg=?, jabatan=?, tahun_awal=?, tahun_akhir=?, gaji=?, unit=? WHERE id=?");
                $stmt->execute([$nip, $nama, $golongan, $mkg, $jabatan, $tahun_awal, $tahun_akhir, $gaji, $unit, $data['id']]);
                sendResponse(["success" => true, "message" => "Employee updated"]);
            } else {
                // Create
                $stmt = $pdo->prepare("INSERT INTO kgb_pegawai (nip, nama, golongan, mkg, jabatan, tahun_awal, tahun_akhir, gaji, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$nip, $nama, $golongan, $mkg, $jabatan, $tahun_awal, $tahun_akhir, $gaji, $unit]);
                sendResponse(["success" => true, "message" => "Employee added", "id" => $pdo->lastInsertId()]);
            }
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    case 'PATCH':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['records']) || !is_array($data['records'])) {
            sendResponse(["error" => "Records required"], 400);
        }

        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare("UPDATE kgb_pegawai SET mkg=?, gaji=?, tahun_awal=?, tahun_akhir=? WHERE id=?");
            
            foreach ($data['records'] as $r) {
                $stmt->execute([
                    $r['mkg'], 
                    $r['gaji'], 
                    $r['tahunAwal'], 
                    $r['tahunAkhir'], 
                    $r['id']
                ]);
            }
            
            $pdo->commit();
            sendResponse(["success" => true, "message" => "Master data updated"]);
        } catch (PDOException $e) {
            $pdo->rollBack();
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) sendResponse(["error" => "ID required"], 400);

        try {
            $stmt = $pdo->prepare("DELETE FROM kgb_pegawai WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(["success" => true, "message" => "Employee deleted"]);
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    default:
        sendResponse(["error" => "Method not allowed"], 405);
        break;
}
?>
