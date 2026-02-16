<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

// Obtener JSON enviado desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No se recibieron datos"]);
    exit;
}

$user_id = $data['user_id'];
$username = $data['username'];
$level = $data['level'];
$ilvl = $data['ilvl'];
$character_role = $data['character_role'];
$guild_role = $data['guild_role'];
$main_archetype = $data['main_archetype'];
$secondary_archetype = $data['secondary_archetype'];
$email = $data['email'];
$notify_email = $data['notify_email'] ? 1 : 0;

// Verificar si user_id ya existe
$check = $conexion->prepare("SELECT user_id FROM guild_members WHERE user_id = ?");
$check->bind_param("s", $user_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "El user_id ya existe"]);
    exit;
}

// Insertar datos nuevos
$sql = $conexion->prepare("
    INSERT INTO guild_members 
    (user_id, username, level, ilvl, character_role, guild_role, main_archetype, secondary_archetype, email, notify_email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$sql->bind_param("ssiiissssi", 
    $user_id, $username, $level, $ilvl, $character_role, $guild_role, 
    $main_archetype, $secondary_archetype, $email, $notify_email);

if ($sql->execute()) {
    echo json_encode(["status" => "success", "message" => "Miembro agregado correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al insertar"]);
}
?>
