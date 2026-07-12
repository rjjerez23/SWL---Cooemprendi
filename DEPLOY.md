# Despliegue en 100.65.110.64

## Requisitos del servidor

- PHP 8.1 o superior con extensiones `pdo` y `pdo_mysql`.
- MariaDB activo.
- Apache con `mod_rewrite` o Nginx configurado para servir la SPA.
- Base de datos `coopemprendi`.

## Base de datos

Ejecutar en el servidor:

```bash
mysql -u root -p < database/coopemprendi.sql
```

Usuario inicial:

```text
Usuario: admin
Contraseña: 1234
```

## Variables de entorno para PHP

Configurar en Apache, Nginx/PHP-FPM o el entorno del sistema:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=coopemprendi
DB_USER=usuario_de_mariadb
DB_PASS=clave_de_mariadb
```

En Apache se pueden declarar dentro del VirtualHost:

```apache
SetEnv DB_HOST 127.0.0.1
SetEnv DB_PORT 3306
SetEnv DB_NAME coopemprendi
SetEnv DB_USER usuario_de_mariadb
SetEnv DB_PASS clave_de_mariadb
```

## Build del frontend

```bash
cd frontend
npm install
npm run build
```

Subir al directorio público del servidor:

- Todo el contenido de `frontend/dist/`
- La carpeta `api/`
- El archivo `.htaccess` si se usa Apache

Ejemplo con `scp`, cambiando `usuario` y la ruta pública según el servidor:

```bash
scp -r frontend/dist/* usuario@100.65.110.64:/var/www/html/
scp -r api usuario@100.65.110.64:/var/www/html/
scp .htaccess usuario@100.65.110.64:/var/www/html/
scp database/coopemprendi.sql usuario@100.65.110.64:/tmp/coopemprendi.sql
ssh usuario@100.65.110.64 "mysql -u usuario_de_mariadb -p coopemprendi < /tmp/coopemprendi.sql"
```

Si el servidor usa Nginx, la ubicación debe enviar todo lo que no exista a `index.html` y pasar `/api/*.php` a PHP-FPM.

La URL final queda:

```text
http://100.65.110.64/
```
whi
