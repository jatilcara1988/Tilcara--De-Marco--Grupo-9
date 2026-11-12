SET NAMES utf8mb4;

DROP DATABASE IF EXISTS inksumosapp;
CREATE DATABASE inksumosapp;
USE inksumosapp;

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    categoryType VARCHAR(50) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_category_type (categoryType)
) ENGINE=InnoDB;

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE products (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    productName VARCHAR(100) NOT NULL,
    productDescription TEXT NULL,
    productImage VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    stock INT NULL,
    isActive TINYINT(1) NOT NULL DEFAULT 1,
    categoryId BIGINT(20) UNSIGNED NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_products_categories FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY uk_product_name (productName)
) ENGINE=InnoDB;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    userName VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL,
    passwordLocal VARCHAR(200) NOT NULL,
    phone VARCHAR(200) NULL,
    jobTitle VARCHAR(50) NOT NULL,
    isActive TINYINT(1) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_email (email)
) ENGINE=InnoDB;

-- =========================
-- SALES 
-- =========================
CREATE TABLE sales (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    clientName VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    sellDate DATETIME NOT NULL,
    saleMethod VARCHAR(50) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)

) ENGINE=InnoDB;

-- =========================
-- DETAIL OF SALES
-- =========================
CREATE TABLE sales_details (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    saleId BIGINT(20) UNSIGNED NOT NULL,
    productId BIGINT(20) UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_detalle_ventas_ventas FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_ventas_productos FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =========================
-- INSERT CATEGORIES
-- =========================
INSERT INTO categories (id, categoryType) VALUES
(1, 'Insumos'),
(2, 'Repuestos');

-- =========================
-- INSERT PRODUCTS
-- =========================
INSERT INTO products (productName, productDescription, productImage, price, stock, isActive, categoryId, createdAt, updatedAt) VALUES
('Toner Alternativo HP 85A CE285A', 'Toner alternativo laser negro compatible con impresoras HP LaserJet Pro P1102w M1132 M1212nf rendimiento aproximado 2000 paginas', '/images/products/Toner_Alternativo_HP_85A_CE285A.png', 16080.09, 14, 1, 1, NOW(), NOW()),
('Botella de Tinta Epson 544 Negro Original', 'Botella de tinta original Epson T544120 color negro de 65ml para impresoras EcoTank L3110 L3150 L5190', '/images/products/Botella_de_Tinta_Epson_544_Negro_Original.png', 24640.00, 42, 1, 1, NOW(), NOW()),
('Cartucho de Tinta HP 667 Negro Original', 'Cartucho original de inyeccion termica de tinta HP 3YM79AL rendimiento aproximado de 120 paginas', '/images/products/Cartucho_de_Tinta_HP_667_Negro_Original.png', 24999.00, 35, 1, 1, NOW(), NOW()),
('Cabezal de Impresion de Repuesto L4150 L4160', 'Cabezal termico de repuesto para impresoras de inyeccion continua Epson compatible con modelos L4150 L4160', '/images/products/Cabezal_de_Impresion_de_Repuesto_L4150_L4160.png', 29795.00, 3, 1, 2, NOW(), NOW()),
('Cilindro Drum Alternativo DR-2340 Brother', 'Unidad de tambor fotoconductor alternativo rendimiento estimado de 12000 copias para impresoras HL-L2320D DCP-L2540DW', '/images/products/Cilindro_Drum_Alternativo_DR-2340_Brother.png', 17472.40, 19, 1, 1, NOW(), NOW()),
('Compitt Limpiador de Cabezales Epson 1000CC', 'Liquido limpiador Delta DTI de 1 litro diseñado para remover tinta seca y suciedad en inyectores inkjet', '/images/products/Compitt_Limpiador_de_Cabezales_Epson_1000CC.png', 14490.00, 48, 1, 2, NOW(), NOW()),
('Cartucho de Tinta HP 667 XL Negro High Yield', 'Cartucho de tinta negra original de alta capacidad HP 667XL para mayor rendimiento de paginas impresas', '/images/products/Cartucho_de_Tinta_HP_667_XL_Negro_High_Yield.png', 28999.00, 31, 1, 1, NOW(), NOW()),
('Toner Alternativo HP Universal 35A 36A 85A', 'Cartucho de toner laser monocromatico universal de alto rendimiento compatible con impresoras de oficina HP P1102w', '/images/products/Toner_Alternativo_HP_Universal_35A_36A_85A.png', 11800.00, 12, 1, 1, NOW(), NOW()),
('Botella de Tinta Epson 544 Cyan Original', 'Botella de repuesto de tinta liquida color cian original para recarga de tanques de impresion continuos EcoTank', '/images/products/Botella_de_Tinta_Epson_544_Cyan_Original.png', 25700.00, 27, 1, 1, NOW(), NOW()),
('Kit de Cartuchos HP 667 Originales Negro y Color', 'Combo pack de cartuchos originales de tinta HP 667 que incluye un cartucho negro y un cartucho tricolor', '/images/products/Kit_de_Cartuchos_HP_667_Originales_Negro_y_Color.png', 58999.00, 21, 1, 1, NOW(), NOW()),
('Toner Alternativo Premium CE285A 85A', 'Toner laser compatible nuevo caja cerrada negros intensos optimo para documentos comerciales cotidianos', '/images/products/Toner_Alternativo_Premium_CE285A_85A.png', 11500.00, 50, 1, 1, NOW(), NOW()),
('Kit Limpiador de Cabezales OCP Aleman 100ml', 'Kit de limpieza intensiva con jeringa adaptador y liquido aleman OCP para desatascar inyectores piezoeléctricos', '/images/products/Kit_Limpiador_de_Cabezales_OCP_Aleman_100ml.png', 18427.00, 40, 1, 2, NOW(), NOW()),
('Toner Compatible HP 85A Delivery Cartuchos', 'Cartucho laser compatible negro fabricado bajo normas ISO facil instalacion plug and play para oficina', '/images/products/Toner_Compatible_HP_85A_Delivery_Cartuchos.png', 24900.00, 9, 1, 1, NOW(), NOW()),
('Unidad de Tambor Brother DR-2340 Original', 'Componente fotoconductor original Brother para transferencia exacta de imagen laser durabilidad de 12000 paginas', '/images/products/Unidad_de_Tambor_Brother_DR-2340_Original.png', 191530.00, 14, 1, 1, NOW(), NOW()),
('Kit de Almohadillas de Deposito de Tinta Residual Epson EcoTank', 'Almohadillas de esponja para retencion de tinta residual compatibles con impresoras Epson EcoTank L3110 L3150 L3210 L3250 L5190', '/images/products/Kit_de_Almohadillas_Epson_L3110.png', 9997.00, 25, 1, 2, NOW(), NOW()),
('Kit Rodillo Toma de Papel Pickup Roller Epson L3110 L3150', 'Juego de gomas de arrastre y rodillo alimentador de papel pickup roller para impresoras multifuncion Epson EcoTank L3110 L3150 L3250', '/images/products/Kit_Rodillo_Toma_Papel_Epson_L3110.png', 8531.00, 18, 1, 2, NOW(), NOW()),
('Cinta Encoder Lineal Strip Epson EcoTank L3110 L3150 L5190', 'Cinta transparente graduada encoder strip para posicionamiento y control de movimiento del carro de impresion Epson', '/images/products/Cinta_Encoder_Lineal_Epson_L3110.png', 21999.00, 15, 1, 2, NOW(), NOW()),
('Engranaje Toma de Papel Clutch Gear Epson L3110 L3150 L4150', 'Engranaje plastico de sistema de alimentacion de papel para reparacion de atascos y traccion en impresoras Epson', '/images/products/Engranaje_Toma_Papel_Epson_L3110.png', 5780.00, 30, 1, 2, NOW(), NOW()),
('Rodillo de Presion de Fusor Laser HP LaserJet P1102w M1212nf', 'Rodillo inferior de presion termica para ensamble fusor de impresoras laser HP LaserJet Pro P1102 M1132 M1212', '/images/products/Rodillo_Presion_Fusor_HP_P1102.png', 16500.00, 10, 1, 2, NOW(), NOW());

-- =========================
-- INSERT ADMIN USER
-- =========================
INSERT INTO users (userName, email, passwordLocal, phone, jobTitle, isActive) VALUES 
("John Doe Primero", "jdPrimero@test.com", '$2b$10$tII9vvH4OPmM2mpqFkz/WOCtXHPKkJXcgk/1fp7yXBpuQ7UM1BwHq', "0303456", 'administrador', 1);

-- =========================
-- INSERT SALES
-- =========================
INSERT INTO sales (clientName, total, sellDate, saleMethod) VALUES
('Gabriel Pio', 104400, '2026-02-12 12:14:00', 'Tarjeta'),
('Pedro Gomez', 637700, '2025-02-03 17:26:00', 'Efectivo'),
('Javier Diaz', 107000, '2025-03-28 19:17:00', 'Transferencia'),
('Lautaro Martinez', 57000, '2025-04-14 18:40:00', 'Efectivo'),
('Gerardo Diaz', 177800, '2025-05-30 14:38:00', 'Tarjeta'),
('Omar Perez', 97000, '2025-06-10 21:04:00', 'Transferencia'),
('Pablo Gimenez', 144840, '2025-07-25 16:21:00', 'Tarjeta'),
('Tadeo Gimenez', 123000, '2025-08-06 20:45:00', 'Efectivo'),
('Daniel Rios', 77700, '2025-09-18 11:18:00', 'Tarjeta'),
('Margarita Ortiz', 65000, '2025-10-02 15:20:00', 'Efectivo'),
('Mariano Herrero', 367730, '2025-11-15 18:55:00', 'Transferencia'),
('Carolina Gonzalez', 56600, '2025-12-01 09:24:00', 'Tarjeta'),
('Francisco Cuevas', 134279, '2026-01-20 22:43:00', 'Efectivo'),
('Andrea Perez', 87000, '2026-02-05 10:33:00', 'Tarjeta'),
('Tamara Becerra', 27130, '2026-02-25 19:11:00', 'Transferencia'),
('Juana Romero', 86500, '2026-03-12 14:59:00', 'Tarjeta'),
('Miguel Costas', 173300, '2026-03-28 16:12:00', 'Transferencia'),
('Barbara Ortiz', 478000, '2026-04-09 11:25:00', 'Efectivo'),
('Leandro Godoy', 266900, '2026-04-26 18:55:00', 'Tarjeta'),
('Felicitas Valero', 96500, '2026-01-03 18:45:00', 'Transferencia'),
('Javier Valor', 68900, '2026-05-12 20:39:00', 'Efectivo'),
('Merlina Addams', 144000, '2026-05-29 17:10:00', 'Tarjeta'),
('Gerardo Uno', 54000, '2026-06-02 09:55:00', 'Efectivo'),
('Pricila Segundo', 98000, '2026-06-12 21:32:00', 'Transferencia'),
('Ernesto Caido', 18700, '2026-07-14 16:23:00', 'Tarjeta');



-- =========================
-- INSERT SALES DETAILS
-- =========================
INSERT INTO sales_details (saleId, productId, quantity) VALUES
(1, 2, 1),
(1, 5, 2),
(2, 7, 1),
(3, 1, 1),
(3, 10, 1),
(4, 3, 2),
(5, 8, 1),
(5, 12, 1),
(5, 14, 2),
(6, 6, 1),
(7, 2, 2),
(7, 11, 1),
(8, 14, 1),
(9, 4, 1),
(9, 9, 2),
(10, 5, 1),
(11, 1, 2),
(11, 7, 1),
(11, 11, 1),
(12, 13, 1),
(13, 3, 1),
(13, 8, 2),
(14, 6, 1),
(15, 12, 1),
(15, 13, 1),
(16, 4, 2),
(16, 9, 1),
(17, 2, 1),
(17, 10, 1),
(17, 14, 2),
(18, 5, 1),
(19, 1, 1),
(19, 7, 2),
(19, 11, 1),
(20, 11, 1),
(21, 3, 1),
(21, 6, 1),
(22, 8, 2),
(22, 13, 1),
(23, 14, 1),
(24, 2, 1),
(24, 4, 1),
(25, 1, 2),
(25, 12, 1),
(25, 14, 1);