<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

// Obtener JSON enviado desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['user_id'])) {
    echo json_encode(["status" => "error", "message" => "No se recibió el user_id"]);
    exit;
}

$user_id = $data['user_id'];

// Verificar si el miembro existe
$check = $conexion->prepare("SELECT user_id FROM guild_members WHERE user_id = ?");
$check->bind_param("s", $user_id);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "El miembro no existe"]);
    exit;
}

// Eliminar miembro
$sql = $conexion->prepare("DELETE FROM guild_members WHERE user_id = ?");
$sql->bind_param("s", $user_id);

if ($sql->execute()) {
    echo json_encode(["status" => "success", "message" => "Miembro eliminado correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al eliminar el miembro"]);
}
