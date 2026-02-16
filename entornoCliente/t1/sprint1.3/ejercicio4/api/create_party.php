<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$requiredFields = ['partySize', 'creatorId', 'levelCap', 'ilvlCap', 'partyRole', 'plannedStart'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "El campo $field es obligatorio"]);
        exit;
    }
}

if ($data['levelCap'] <= 0 || $data['ilvlCap'] <= 0) {
    echo json_encode(['success' => false, 'message' => "Level Cap y Item Level Cap deben ser positivos"]);
    exit;
}

if (!preg_match('/^\d{2}\/\d{2}\/\d{4}_\d{2}:\d{2}$/', $data['plannedStart'])) {
    echo json_encode(['success' => false, 'message' => "Planned Start debe tener formato DD/MM/YYYY_HH:mm"]);
    exit;
}

list($day, $month, $year_hour) = explode('/', $data['plannedStart']);
list($year, $hour) = explode('_', $year_hour);
list($hh, $mm) = explode(':', $hour);
$plannedDate = strtotime("$year-$month-$day $hh:$mm");
if ($plannedDate <= time()) {
    echo json_encode(['success' => false, 'message' => "Planned Start debe ser una fecha futura"]);
    exit;
}

$file = __DIR__ . '/parties.json';
if (!file_exists($file)) file_put_contents($file, json_encode([]));

$parties = json_decode(file_get_contents($file), true);
if (!is_array($parties)) $parties = [];
$parties[] = $data;

if (file_put_contents($file, json_encode($parties, JSON_PRETTY_PRINT)) === false) {
    echo json_encode(['success' => false, 'message' => "No se pudo guardar la party"]);
    exit;
}

echo json_encode(['success' => true]);
