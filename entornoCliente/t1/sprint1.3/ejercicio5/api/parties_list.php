<?php
header('Content-Type: application/json');
$partiesFile = __DIR__ . '/parties.json';

if (file_exists($partiesFile)) {
    $json = file_get_contents($partiesFile);
    echo $json;
} else {
    echo json_encode([]);
}
