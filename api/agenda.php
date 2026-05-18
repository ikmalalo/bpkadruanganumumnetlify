<?php
// api/agenda.php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && !isLoggedIn()) {
    sendResponse(["error" => "Unauthorized"], 401);
}

$method = $_SERVER['REQUEST_METHOD'];
$data = getInputData();

switch ($method) {
    case 'GET':
        try {
            $stmt = $pdo->query("SELECT * FROM agenda_ruangan ORDER BY id ASC");
            $agendas = $stmt->fetchAll();
            sendResponse($agendas);
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    case 'POST':
        // Insert or Update
        $id = $data['id'] ?? null;
        $fields = [
            'hari', 'tanggal', 'tempat', 'pukul', 'acara', 
            'pelaksana', 'dihadiri', 'status', 'type'
        ];
        
        $params = [];
        foreach ($fields as $field) {
            $params[$field] = $data[$field] ?? null;
        }

        try {
            if ($id) {
                // UPDATE
                $sql = "UPDATE agenda_ruangan SET 
                        hari = :hari, tanggal = :tanggal, tempat = :tempat, 
                        pukul = :pukul, acara = :acara, pelaksana = :pelaksana, 
                        dihadiri = :dihadiri, status = :status, type = :type 
                        WHERE id = :id";
                $params['id'] = $id;
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                sendResponse(["success" => true, "message" => "Agenda updated"]);
            } else {
                // INSERT
                $sql = "INSERT INTO agenda_ruangan (hari, tanggal, tempat, pukul, acara, pelaksana, dihadiri, status, type) 
                        VALUES (:hari, :tanggal, :tempat, :pukul, :acara, :pelaksana, :dihadiri, :status, :type)";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                sendResponse(["success" => true, "message" => "Agenda created", "id" => $pdo->lastInsertId()]);
            }
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
            $stmt = $pdo->prepare("DELETE FROM agenda_ruangan WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(["success" => true, "message" => "Agenda deleted"]);
        } catch (PDOException $e) {
            sendResponse(["error" => $e->getMessage()], 500);
        }
        break;

    default:
        sendResponse(["error" => "Method not allowed"], 405);
        break;
}
?>
