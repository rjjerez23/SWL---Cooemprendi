<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_method('POST');
start_app_session();

$data = read_json_body();
$usuario = trim((string) ($data['usuario'] ?? ''));
$clave = (string) ($data['clave'] ?? '');

if ($usuario === '' || $clave === '') {
    json_response([
        'success' => false,
        'message' => 'Usuario y contraseña son requeridos.',
    ], 400);
}

try {
    $stmt = database()->prepare(
        'SELECT id_usuario, nombre, usuario, clave_hash, rol, activo FROM usuarios WHERE usuario = ? LIMIT 1'
    );
    $stmt->execute([$usuario]);
    $registro = $stmt->fetch();

    if (!$registro || (int) $registro['activo'] !== 1 || !verify_password($clave, $registro['clave_hash'])) {
        json_response([
            'success' => false,
            'message' => 'Usuario o contraseña incorrectos.',
        ], 401);
    }

    $_SESSION['usuario'] = public_user($registro);

    json_response([
        'success' => true,
        'usuario' => $_SESSION['usuario'],
    ]);
} catch (Throwable) {
    json_response([
        'success' => false,
        'message' => 'No fue posible iniciar sesión.',
    ], 500);
}
