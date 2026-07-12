<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

require_method('GET');
start_app_session();

if (!isset($_SESSION['usuario'])) {
    json_response([
        'authenticated' => false,
    ], 401);
}

json_response([
    'authenticated' => true,
    'usuario' => $_SESSION['usuario'],
]);
