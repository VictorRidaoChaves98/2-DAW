<?php
$host = "localhost";
$user = "root";  // Usuario por defecto de XAMPP
$pass = "";      // Contraseña vacía por defecto
$db   = "guild_db";

$conexion = new mysqli($host, $user, $pass, $db);

if ($conexion->connect_error) {
    die("❌ Error de conexión: " . $conexion->connect_error);
}
?>
