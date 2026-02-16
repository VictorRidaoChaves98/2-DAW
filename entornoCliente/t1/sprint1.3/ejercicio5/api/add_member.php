<?php
header('Content-Type: application/json');
$partiesFile = __DIR__ . '/parties.json';

$data = json_decode(file_get_contents('php://input'), true);
$partyId = $data['partyId'] ?? null;
$userId = $data['userId'] ?? null;
$role = $data['role'] ?? null;

if (!file_exists($partiesFile)) {
    echo json_encode(['success' => false, 'message' => 'Archivo de parties no encontrado']);
    exit;
}

$parties = json_decode(file_get_contents($partiesFile), true);

$partyIndex = null;
foreach ($parties as $index => $p) {
    if ($p['partyId'] == $partyId) {
        $partyIndex = $index;
        break;
    }
}

if ($partyIndex === null) {
    echo json_encode(['success' => false, 'message' => 'Party no encontrada']);
    exit;
}

// Validar miembro duplicado
foreach ($parties[$partyIndex]['members'] as $m) {
    if ($m['userId'] === $userId) {
        echo json_encode(['success' => false, 'message' => 'El miembro ya está en la party']);
        exit;
    }
}

// Validar rol disponible
$roles = array_column($parties[$partyIndex]['members'], 'role');
if (in_array($role, $roles)) {
    echo json_encode(['success' => false, 'message' => 'El rol ya está ocupado']);
    exit;
}

// Validar tamaño de party
$maxMembers = $parties[$partyIndex]['partySize'] ?? 5;
if (count($parties[$partyIndex]['members']) >= $maxMembers) {
    echo json_encode(['success' => false, 'message' => 'La party está llena']);
    exit;
}

// Añadir miembro
$parties[$partyIndex]['members'][] = ['userId' => $userId, 'role' => $role];
file_put_contents($partiesFile, json_encode($parties, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'Miembro añadido correctamente']);
