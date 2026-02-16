<?php
header('Content-Type: application/json');
$partiesFile = __DIR__ . '/parties.json';

$data = json_decode(file_get_contents('php://input'), true);
$partyId = $data['partyId'] ?? null;
$userId = $data['userId'] ?? null;

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

// No permitir remover al creador
if ($userId === $parties[$partyIndex]['creatorId']) {
    echo json_encode(['success' => false, 'message' => 'No se puede remover al creador']);
    exit;
}

// Remover miembro
$members = $parties[$partyIndex]['members'];
$members = array_filter($members, fn($m) => $m['userId'] !== $userId);
$parties[$partyIndex]['members'] = array_values($members);

file_put_contents($partiesFile, json_encode($parties, JSON_PRETTY_PRINT));

echo json_encode(['success' => true, 'message' => 'Miembro removido correctamente']);
