<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_auth();
$pdo = database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query(
        'SELECT id_usuario, nombre, usuario, rol, activo, creado_en FROM usuarios ORDER BY id_usuario DESC'
    );

    json_response([
        'success' => true,
        'usuarios' => $stmt->fetchAll(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = read_json_body();
    $nombre = trim((string) ($data['nombre'] ?? ''));
    $usuario = trim((string) ($data['usuario'] ?? ''));
    $clave = (string) ($data['clave'] ?? '');
    $rol = trim((string) ($data['rol'] ?? 'administrador'));
    $activo = (int) ($data['activo'] ?? 1);

    if ($nombre === '' || $usuario === '' || $clave === '') {
        json_response([
            'success' => false,
            'message' => 'Nombre, usuario y contraseña son requeridos.',
        ], 400);
    }

    try {
        $stmt = $pdo->prepare(
            'INSERT INTO usuarios (nombre, usuario, clave_hash, rol, activo) VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $nombre,
            $usuario,
            password_hash($clave, PASSWORD_DEFAULT),
            $rol ?: 'administrador',
            $activo === 1 ? 1 : 0,
        ]);

        json_response([
            'success' => true,
            'id_usuario' => (int) $pdo->lastInsertId(),
        ], 201);
    } catch (PDOException $error) {
        $message = $error->getCode() === '23000'
            ? 'Ya existe un usuario con ese nombre de acceso.'
            : 'No fue posible registrar el usuario.';

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
