<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_auth();
$pdo = database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        'SELECT p.id_prestamo, p.id_socio, s.nombre AS socio, p.monto, p.interes, p.cuotas, p.fecha, p.estado
         FROM prestamos p
         INNER JOIN socios s ON s.id_socio = p.id_socio
         ORDER BY p.id_prestamo DESC'
    );

    json_response([
        'success' => true,
        'prestamos' => $stmt->fetchAll(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $idSocio = (int) ($data['id_socio'] ?? 0);
    $monto = money_value($data['monto'] ?? 0);
    $interes = money_value($data['interes'] ?? 0);
    $cuotas = (int) ($data['cuotas'] ?? 0);
    $fecha = trim((string) ($data['fecha'] ?? date('Y-m-d')));
    $estado = trim((string) ($data['estado'] ?? 'Pendiente'));

    if ($idSocio <= 0 || $monto <= 0 || $cuotas <= 0) {
        json_response([
            'success' => false,
            'message' => 'Socio, monto y cuotas son requeridos.',
        ], 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO prestamos (id_socio, monto, interes, cuotas, fecha, estado) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$idSocio, $monto, $interes, $cuotas, $fecha, $estado]);

    json_response([
        'success' => true,
        'id_prestamo' => (int) $pdo->lastInsertId(),
    ], 201);
}

json_response([
    'success' => false,
    'message' => 'Método no permitido.',
], 405);
