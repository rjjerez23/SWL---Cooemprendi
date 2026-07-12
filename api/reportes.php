<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_method('GET');
require_auth();

$pdo = database();
$resumen = [
    'total_prestado' => money_value($pdo->query('SELECT COALESCE(SUM(monto), 0) FROM prestamos')->fetchColumn()),
    'total_pagado' => money_value($pdo->query('SELECT COALESCE(SUM(monto), 0) FROM pagos')->fetchColumn()),
    'prestamos_aprobados' => (int) $pdo->query("SELECT COUNT(*) FROM prestamos WHERE estado = 'Aprobado'")->fetchColumn(),
    'prestamos_pendientes' => (int) $pdo->query("SELECT COUNT(*) FROM prestamos WHERE estado = 'Pendiente'")->fetchColumn(),
    'socios_registrados' => (int) $pdo->query('SELECT COUNT(*) FROM socios')->fetchColumn(),
    'pagos_registrados' => (int) $pdo->query('SELECT COUNT(*) FROM pagos')->fetchColumn(),
];

$stmt = $pdo->query(
    "SELECT id_prestamo AS id, s.nombre AS socio, 'Préstamo' AS tipo, monto, fecha, estado
     FROM prestamos p
     INNER JOIN socios s ON s.id_socio = p.id_socio
     UNION ALL
     SELECT id_pago AS id, s.nombre AS socio, 'Pago' AS tipo, pg.monto, pg.fecha, pg.estado
     FROM pagos pg
     INNER JOIN prestamos p ON p.id_prestamo = pg.id_prestamo
     INNER JOIN socios s ON s.id_socio = p.id_socio
     ORDER BY fecha DESC
     LIMIT 20"
);

json_response([
    'success' => true,
    'resumen' => $resumen,
    'movimientos' => $stmt->fetchAll(),
]);
