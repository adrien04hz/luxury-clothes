├── app/                        # CAPA DE PRESENTACION se mantiene nombre por estructura y forma de trabajar de next
│   ├── page.tsx                # Pagina prinicpal (Inicio de pagina puede estar logueado o no)
│   │
│   ├── cliente/                # Carpeta de modulo, varia segun la necesidad, puede tener o no carpetas dentro de modulo (dinamicas o estaticas)
│   │   ├── page.tsx            # Pagina(interfaz del modulo, vista previa) 
│   │   ├── login/              # Inicio de sesión de cliente
│   │   │   └── page.tsx                
│   │   ├── registro/           # Registrar cuenta de cliente
│   │   │   └── page.tsx                
|   |   ├── eliminar/           # Eliminación de cuenta de cliente
│   │   │   └── page.tsx 
│   │   └── modificar/          # Módificación de información de cliente
│   │       └── page.tsx
|   |
│   ├── Motordebusqueda/
│   │
│   ├── producto/ 
|   |
│   ├── components/             # Componentes reutilizables (Pueden depender a las necesidades correspondiente, es opcional)
│   │   ├── Navbar.tsx
│   │   ├── nose.tsx
│   │   └── nose.tsx
│   │
│   └── api/                    # Endpoints necesarios para cada modulo, recomendable que el nombre se sus carpeta sea el nombre de modulo y ya otras carpetas adentro o ninguna en el caso
│       |   ├── añadir
|       |   |   └── route.ts
│       |   |
|       |   └── eliminar
|       |       └── route.ts
|       |
|       ├── busqueda/
|       |   └── route.ts
|       |
|       ├── filtro/
|       |   └── route.ts
|       |
│       └── motordebusqueda/
│           ├── buscar
|           |   └── route.ts
│           |
|           └── flitro
|               └── route.ts