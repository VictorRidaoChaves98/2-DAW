<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include "db.php"; // Conexión a la base de datos

$sql = "SELECT * FROM guild_members";
$result = $conexion->query($sql);

$members = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['notify_email'] = boolval($row['notify_email']); 
        $members[] = $row;
    }
}

echo json_encode($members);
?>
