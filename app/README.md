# CARPETA PARA PRESENTACION
```bash
├── app/                        # CAPA DE PRESENTACION se mantiene nombre por estructura y forma de trabajar de next
│   ├── page.tsx                # Pagina prinicpal (Inicio de pagina puede estar logueado o no)
|   |
│   ├── layout.tsx              # Pagina donde se define el navbar, footer
│   │
│   ├── productos/              # carpeta para mostrar los articulos
│   │   ├── page.tsx            # pagina de inicio principal, listado de todos los productos haciendo uso de filtrado
|   |   |
|   |   ├──[id]/
|   |   |   └── page.tsx        # detalle de un producto seleccionado en la principal
|   |   |
│   │   ├── buscar/             # Busqueda por separado 
│   │   │   └── page.tsx
|   |   |        
│   │   ├── components/         # componentes especificos para mostrar productos
|   |   |   ├── ProductCard.tsx # vista de un solo producto (representa un solo producto)
|   |   |   ├── ProductGrid.tsx # lista de varios productos (representa muchos productos), usa productcard 
│   │   │   └── Filtros.tsx     # generacion de filtros genero, categoria, subcategoria, talla, color, precio incluso marca
|   |   |
|   |   ├── hooks/              # logica de fonted, llamado a los cliente ya definidos (Pueden depender de las necesidades), es decir utilizacion de los fetch. Esta parte va depender de que se vaya ocupando, se pueden ir agregando mas cosas
│   │   │   └── useProducto.ts
|   |   |
│   │   └── types/               # Tipos de datos que se usaran (Pueden depender de las necesidases). Esta parte va depender de que se vaya ocupando, se pueden ir agregando mas cosas
│   │       └── producto.ts
|   |
|   ├── carrito/                # carrito de compra
|   |   └── page.tsx            # se presenta la interfaz del carrito, muestra los productos
|   |
|   ├── checkout/               # proceso de compra
|   |   ├── page.tsx            # detalles de pago
|   |   ├── direccion/          # seleccion de direccion
|   |   ├── pago/               # seleccion de pago
|   |   └── confirmacion/       # confirmacion de pago final, creacion de comprobante de pago
|   |
|   ├── cuenta/                 # area de usuario (cliente)
|   |   ├── page.tsx            # detalles de usuario
|   |   ├── pedidos/            # historial de pedidos
|   |   |   └── [id]/
|   |   |       └── page.tsx    # detalle de pedido especifico
|   |   ├── direcciones/        # Gestion de direcciones (Agregar, Modificar, Eliminar)
|   |   ├── metodosdepago/      # Gestion de metodos de pago (Ver, Agregar, Modificar, Eliminar)
|   |   ├── listadedeseos/      # Gestion de productos guardados (Ver, aumentar, agregar a carrito, comprar, eliminar)
|   |   └── configuracion/      # Gestion de la cuenta como los datos personales
|   |
|   ├── auth/                   # Autenticacion
|   |   ├── login/              # Inicio de sesion
|   |   └── registro/           # Registro de nuevo usuario (cliente)
|   |
|   ├── admin/                  # panel del administrador
|   |   ├── page.tsx            # pantalla principal del administrador
|   |   ├── productos/          # CRUD de productos 
|   |   ├── categorias/         # CRUD de categorias
|   |   ├── marcas/             # CRUD de marcas
|   |   ├── pedidos/            # Gestion de pedidos
|   |   └── clientes/           # Gestion de clientes
|   |
│   ├── components/             # Componentes reutilizables (Pueden depender a las necesidades correspondiente, es opcional)
│   │   ├── Navbar.tsx          # Barra superior de navegacion ya implementada
│   │   ├── Footer.tsx          # Barra inferior de navegacion ya implementada
│   │   └── carousel.tsx        # Vista de imagenes en forma de carrusel ya implementada
|   |
│   ├── hooks/                  # logica de fronted, llamadas a las apis. Esta parte va depender de que se vaya ocupando, se pueden ir agregando mas cosas
│   │   ├── useAuth.ts          # Manejo de autenticacion
│   │   ├── useCarrito.ts       # Estado global del carro
│   │   └── usePedidos.ts       # Manejo general de pedidos
│   │
│   └── api/                    # Endpoints necesarios para cada modulo, recomendable que el nombre se sus carpeta sea el nombre de modulo y ya otras carpetas adentro o ninguna en el caso
|       ├── administrador/
|       ├── auth/
|       ├── carrito
|       ├── metodosdepago/
|       ├── motordebusqueda/
|       ├── pedido/
│       └── producto/
```