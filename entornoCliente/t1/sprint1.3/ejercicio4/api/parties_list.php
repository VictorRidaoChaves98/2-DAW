<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$file = __DIR__ . '/../parties.json';
if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}

$parties = json_decode(file_get_contents($file), true);
if (!is_array($parties)) $parties = [];

echo json_encode($parties);
