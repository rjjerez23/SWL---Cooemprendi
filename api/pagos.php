<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_auth();
$pdo = database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        'SELECT pg.id_pago, pg.id_prestamo, s.nombre AS socio, pg.monto, pg.fecha, pg.metodo, pg.estado
         FROM pagos pg
         INNER JOIN prestamos p ON p.id_prestamo = pg.id_prestamo
         INNER JOIN socios s ON s.id_socio = p.id_socio
         ORDER BY pg.id_pago DESC'
    );

    json_response([
        'success' => true,
        'pagos' => $stmt->fetchAll(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $idPrestamo = (int) ($data['id_prestamo'] ?? 0);
    $monto = money_value($data['monto'] ?? 0);
    $fecha = trim((string) ($data['fecha'] ?? date('Y-m-d')));
    $metodo = trim((string) ($data['metodo'] ?? 'Efectivo'));
    $estado = trim((string) ($data['estado'] ?? 'Completado'));

    if ($idPrestamo <= 0 || $monto <= 0) {
        json_response([
            'success' => false,
            'message' => 'Préstamo y monto son requeridos.',
        ], 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO pagos (id_prestamo, monto, fecha, metodo, estado) VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([$idPrestamo, $monto, $fecha, $metodo, $estado]);

    json_response([
        'success' => true,
        'id_pago' => (int) $pdo->lastInsertId(),
    ], 201);
}

json_response([
    'success' => false,
    'message' => 'Método no permitido.',
], 405);
