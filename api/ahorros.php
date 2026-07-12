<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_auth();
$pdo = database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        'SELECT a.id_ahorro, a.id_socio, s.nombre AS socio, s.cedula, a.monto, a.fecha
         FROM ahorros a
         INNER JOIN socios s ON s.id_socio = a.id_socio
         ORDER BY a.id_ahorro DESC'
    );

    json_response([
        'success' => true,
        'ahorros' => $stmt->fetchAll(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $idSocio = (int) ($data['id_socio'] ?? 0);
    $monto = money_value($data['monto'] ?? 0);
    $fecha = trim((string) ($data['fecha'] ?? date('Y-m-d')));

    if ($idSocio <= 0 || $monto <= 0) {
        json_response([
            'success' => false,
            'message' => 'Socio y monto son requeridos.',
        ], 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO ahorros (id_socio, monto, fecha) VALUES (?, ?, ?)'
    );
    $stmt->execute([$idSocio, $monto, $fecha]);

    json_response([
        'success' => true,
        'id_ahorro' => (int) $pdo->lastInsertId(),
    ], 201);
}

json_response([
    'success' => false,
    'message' => 'Método no permitido.',
], 405);
