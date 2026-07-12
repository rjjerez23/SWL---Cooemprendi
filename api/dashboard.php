<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_method('GET');
require_auth();

$pdo = database();

$resumen = [
    'socios' => (int) $pdo->query('SELECT COUNT(*) FROM socios WHERE activo = 1')->fetchColumn(),
    'ahorros' => money_value($pdo->query('SELECT COALESCE(SUM(monto), 0) FROM ahorros')->fetchColumn()),
    'prestamos' => (int) $pdo->query("SELECT COUNT(*) FROM prestamos WHERE estado IN ('Pendiente', 'Aprobado')")->fetchColumn(),
    'pagos' => (int) $pdo->query('SELECT COUNT(*) FROM pagos')->fetchColumn(),
];

$stmt = $pdo->query(
    "SELECT s.nombre AS socio, 'Depósito de ahorro' AS tipo, a.monto, a.fecha, 'Completado' AS estado
     FROM ahorros a
     INNER JOIN socios s ON s.id_socio = a.id_socio
     UNION ALL
     SELECT s.nombre AS socio, 'Solicitud de préstamo' AS tipo, p.monto, p.fecha, p.estado
     FROM prestamos p
     INNER JOIN socios s ON s.id_socio = p.id_socio
     UNION ALL
     SELECT s.nombre AS socio, 'Pago de préstamo' AS tipo, pg.monto, pg.fecha, pg.estado
     FROM pagos pg
     INNER JOIN prestamos p ON p.id_prestamo = pg.id_prestamo
     INNER JOIN socios s ON s.id_socio = p.id_socio
     ORDER BY fecha DESC
     LIMIT 8"
);

json_response([
    'success' => true,
    'resumen' => $resumen,
    'movimientos' => $stmt->fetchAll(),
]);
