INSERT INTO "Categoria" ("id", "nombre") VALUES 
(1, 'Ropa'),
(2, 'Calzado'),
(3, 'Accesorios');


INSERT INTO "Talla" ("id", "nombre", "id_categoria") VALUES 
(1, 'XS', 1),
(2, 'S', 1),
(3, 'M', 1),
(4, 'L', 1),
(5, 'XL', 1),
(6, 'XXL', 1),
(7, 'CM 22', 2),
(8, 'CM 23', 2),
(9, 'CM 24', 2),
(10, 'CM 25', 2),
(11, 'CM 26', 2),
(12, 'CM 27', 2),
(13, 'CM 28', 2),
(14, 'CM 29', 2),
(15, 'CM 30', 2),
(16, 'CM 31', 2),
(17, 'CM 32', 2),
(18, 'CM 33', 2),
(19, 'CM 34', 2),
(20, 'Unitalla', 3);


INSERT INTO "Color" ("id", "nombre") VALUES 
(1, 'Negro'),
(2, 'Blanco'),
(3, 'Rojo'),
(4, 'Azul'),
(5, 'Verde'),
(6, 'Amarillo'),
(7, 'Gris'),
(8, 'Naranja'),
(9, 'Rosa'),
(10, 'Morado'),
(11, 'Café'),
(12, 'Beige');


INSERT INTO "Genero" ("id", "nombre") VALUES 
(1, 'Hombre'),
(2, 'Mujer'),
(3, 'Niños'),
(4, 'Unisex');


INSERT INTO "Subcategoria" ("id", "nombre", "id_categoria") VALUES 
(1, 'Playera', 1),
(2, 'Pantalón', 1),
(3, 'Sudadera', 1),
(4, 'Chamarra', 1),
(5, 'Shorts', 1),
(6, 'Jersey', 1),
(7, 'Calcetines', 1),
(8, 'Camisa', 1),
(9, 'Top', 1),
(10, 'Tenis', 2),
(11, 'Botas', 2),
(12, 'Sandalias', 2),
(13, 'Tacones', 2),
(14, 'Gorra', 3),
(15, 'Mochila', 3),
(16, 'Bolso', 3),
(17, 'Reloj', 3),
(18, 'Lentes', 3);


INSERT INTO "Marca" ("id", "nombre", "imagen_url", "activo") VALUES 
(1, 'Adidas', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/adidas.svg', true),
(2, 'ArcTeryx', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/arcteryx.svg', true),
(3, 'Calvin Klein', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/calvin_klein.svg', true),
(4, 'Hugo Boss', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/hugoBoss.svg', true),
(5, 'Jordan', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/jordan.svg', true),
(6, 'Massimo Dutti', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/massimoDutti.svg', true),
(7, 'New Era', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/newEra.svg', true),
(8, 'Nike', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/nike.svg', true),
(9, 'The North Face', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/NorthFace.svg', true),
(10, 'Tommy Hilfiger', 'https://woryjvsnyyfuhrywvkeq.supabase.co/storage/v1/object/public/LuxuryClothes/MakesLogos/TommyHilfiger.svg', true);


INSERT INTO "Rol" ("id", "nombre") VALUES 
(1, 'Cliente'),
(2, 'Administrador'),
(3, 'Repartidor'),
(4, 'Empacador');


INSERT INTO "EstadoPedido" ("id", "nombre", "descripcion") VALUES 
(1, 'Pendiente', 'Pedido creado pero sin pagar.'),
(2, 'Pagado', 'Pago confirmado.'),
(3, 'En preparación', 'Pedido siendo preparado (empaquetando).'),
(4, 'Listo para envío', 'Listo para enviarse.'),
(5, 'Completado', 'Pedido finalizado.'),
(6, 'Cancelado', 'Pedido cancelado.');


INSERT INTO "EstadoPago" ("id", "nombre", "descripcion") VALUES 
(1, 'Pendiente', 'Pago iniciado.'),
(2, 'Aprobado', 'Pago confirmado.'),
(3, 'Rechazado', 'Pago fallido.'),
(4, 'Reembolsado', 'Dinero devuelto.'),
(5, 'Cancelado', 'Pago cancelado.');


INSERT INTO "TipoMetodoDePago" ("id", "nombre", "descripcion") VALUES 
(1, 'Tarjeta de crédito', 'Pago mediante tarjeta de crédito, financiación diferida.'),
(2, 'Tarjeta de débito', 'Pago inmediato desde tu cuenta bancaria.'),
(3, 'Transferencia', 'Transferencia bancaria directa entre cuentas.'),
(4, 'Paypal', 'Pago seguro a través de tu cuenta PayPal.'),
(5, 'Apple pay', 'Pago rápido y seguro con Apple Pay.'),
(6, 'Google pay', 'Pago conveniente mediante Google Pay.'),
(7, 'Mercado pago', 'Pago a través de la plataforma Mercado Pago.');


INSERT INTO "EstadoEnvio" ("id", "nombre", "descripcion") VALUES 
(1, 'Pendiente', 'Envío aun no preparado.'),
(2, 'Preparado', 'Paquete listo.'),
(3, 'Enviado', 'Sale de almacén.'),
(4, 'En camino', 'En camino.'),
(5, 'Entregado', 'Recibido por cliente.'),
(6, 'Fallido', 'Intento de entrega fallido.');


