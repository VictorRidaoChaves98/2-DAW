<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT");
header("Content-Type: application/json");

include "db.php";

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

// ✅ Actualiza solo si el user_id existe
$sql = $conexion->prepare("
    UPDATE guild_members SET 
        username = ?, 
        level = ?, 
        ilvl = ?, 
        character_role = ?, 
        guild_role = ?, 
        main_archetype = ?, 
        secondary_archetype = ?, 
        email = ?, 
        notify_email = ?
    WHERE user_id = ?
");
$sql->bind_param("siisssssis", $username, $level, $ilvl, $character_role, $guild_role, 
                 $main_archetype, $secondary_archetype, $email, $notify_email, $user_id);

if ($sql->execute()) {
    echo json_encode(["status" => "success", "message" => "Miembro actualizado correctamente"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar"]);
}
?>
