CREATE DATABASE IF NOT EXISTS coopemprendi
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE coopemprendi;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    usuario VARCHAR(60) NOT NULL UNIQUE,
    clave_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(40) NOT NULL DEFAULT 'administrador',
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS socios (
    id_socio INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(160) NOT NULL,
    cedula VARCHAR(30) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL,
    direccion VARCHAR(255) NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ahorros (
    id_ahorro INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_socio INT UNSIGNED NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ahorros_socios
        FOREIGN KEY (id_socio) REFERENCES socios(id_socio)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prestamos (
    id_prestamo INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_socio INT UNSIGNED NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    interes DECIMAL(5,2) NOT NULL,
    cuotas INT UNSIGNED NOT NULL,
    fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado', 'Pagado') NOT NULL DEFAULT 'Pendiente',
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prestamos_socios
        FOREIGN KEY (id_socio) REFERENCES socios(id_socio)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pagos (
    id_pago INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_prestamo INT UNSIGNED NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
    metodo VARCHAR(60) NOT NULL DEFAULT 'Efectivo',
    estado ENUM('Pendiente', 'Completado') NOT NULL DEFAULT 'Completado',
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pagos_prestamos
        FOREIGN KEY (id_prestamo) REFERENCES prestamos(id_prestamo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

INSERT INTO usuarios (nombre, usuario, clave_hash, rol, activo)
VALUES ('Administrador General', 'admin', SHA2('1234', 256), 'administrador', 1)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    rol = VALUES(rol),
    activo = VALUES(activo);
