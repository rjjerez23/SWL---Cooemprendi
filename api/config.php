<?php
declare(strict_types=1);

const SESSION_NAME = 'coopemprendi_session';

function env_value(string $key, string $default = ''): string
{
    $value = getenv($key);

    if ($value === false || $value === '') {
        return $default;
    }

    return $value;
}

function database(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = env_value('DB_HOST', '127.0.0.1');
    $port = env_value('DB_PORT', '3306');
    $name = env_value('DB_NAME', 'coopemprendi');
    $user = env_value('DB_USER', 'root');
    $pass = env_value('DB_PASS', '');
    $charset = 'utf8mb4';
    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset={$charset}";

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function start_app_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name(SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    ]);
    session_start();
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        json_response([
            'success' => false,
            'message' => 'Método no permitido.',
        ], 405);
    }
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);

    if (!is_array($data)) {
        json_response([
            'success' => false,
            'message' => 'JSON inválido.',
        ], 400);
    }

    return $data;
}

function public_user(array $usuario): array
{
    return [
        'id_usuario' => (int) $usuario['id_usuario'],
        'nombre' => $usuario['nombre'],
        'usuario' => $usuario['usuario'],
        'rol' => $usuario['rol'],
    ];
}

function require_auth(): array
{
    start_app_session();

    if (!isset($_SESSION['usuario']) || !is_array($_SESSION['usuario'])) {
        json_response([
            'success' => false,
            'message' => 'Sesión requerida.',
        ], 401);
    }

    return $_SESSION['usuario'];
}

function verify_password(string $clave, string $hash): bool
{
    if (password_get_info($hash)['algoName'] !== 'unknown') {
        return password_verify($clave, $hash);
    }

    return hash_equals($hash, hash('sha256', $clave));
}

function money_value(mixed $value): float
{
    return round((float) $value, 2);
}
