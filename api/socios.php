<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_auth();
$pdo = database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        'SELECT id_socio, nombre, cedula, telefono, direccion, activo, creado_en FROM socios ORDER BY id_socio DESC'
    );

    json_response([
        'success' => true,
        'socios' => $stmt->fetchAll(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $nombre = trim((string) ($data['nombre'] ?? ''));
    $cedula = trim((string) ($data['cedula'] ?? ''));
    $telefono = trim((string) ($data['telefono'] ?? ''));
    $direccion = trim((string) ($data['direccion'] ?? ''));

    if ($nombre === '' || $cedula === '' || $telefono === '') {
        json_response([
            'success' => false,
            'message' => 'Nombre, cédula y teléfono son requeridos.',
        ], 400);
    }

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO socios (nombre, cedula, telefono, direccion) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$nombre, $cedula, $telefono, $direccion ?: null]);

        json_response([
            'success' => true,
            'id_socio' => (int) $pdo->lastInsertId(),
        ], 201);
    } catch (PDOException $error) {
        $message = $error->getCode() === '23000'
            ? 'Ya existe un socio con esa cédula.'
            : 'No fue posible registrar el socio.';

        json_response([
            'success' => false,
            'message' => $message,
        ], 400);
    }
}

json_response([
    'success' => false,
    'message' => 'Método no permitido.',
], 405);
