# DISTRIBUCIÓN DE CARPETAS

1. `app/` para la capa de presentación.
2. `services/` para las reglas de negocio.
3. `repositories/` para la capa de persistencia.
4. `lib/` para la conexión a base de datos.
5. `database/` para archivos de la base de datos o levantamiento local de la misma.
6. `tests/` para las pruebas.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



detalles de formado de carpeta
LUXURY-CLOTHES
# ESTRUCUTURA 3 CAPAS PROPUESTA
```bash
│
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
│   └── api/                    # Endpoints
│       ├── cliente/
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
│
├── services/               # CAPA DE SERVICIO   
|   ├── cliente/                             # caso de usos implementados
│   │   └── cliente.service.ts              
|   |
|   ├── motordebusqueda/                     # caso de usos implementados
│   │   └── motordebusqueda.service.ts       #terminado
|   |
|   ├── producto/                            # caso de usos implementados
│   │   └── producto.service.ts              
|   |
|   ├── metododepago/                        # caso de usos implementados
│   │   └── metododepago.service.ts
|   |
|   ├── direcciondeenvio/                    # caso de usos implementados 
│   │   └── direcciondeenvio.service.ts              
|   |
|   ├── administrador/                       # caso de usos implementados 
│   │   └── administrador.service.ts
|   |
|   ├── comprobantedepago/                   # caso de usos implementados 
│   │   └── comprobantedepago.service.ts              
|   |
|   ├── carritodecompras/                    # caso de usos implementados  
│   │   └── carritodecompras.service.ts              
|   |
|   ├── listadedeseo/                        # caso de usos implementados
│   │   └── listadedeseo.service.ts
|   |
│   └── pedido                               # caso de usos implementados
│       └── pedido.service.ts
│
├── repositories/               # CAPA DE PERSISTENCIA
|   ├── cliente/                                # caso de usos implementados    
│   │   └── cliente.repository.ts              
|   |
|   ├── motordebusqueda/                        # caso de usos implementados  
│   │   └── motordebusqueda.repository.ts       #terminado
|   |
|   ├── producto/                               # caso de usos implementados  
│   │   └── producto.repository.ts              
|   |
|   ├── metododepago/                           # caso de usos implementados 
│   │   └── metododepago.repository.ts
|   |
|   ├── direcciondeenvio/                       # caso de usos implementados 
│   │   └── direcciondeenvio.repository.ts              
|   |
|   ├── administrador/                          # caso de usos implementados 
│   │   └── administrador.repository.ts
|   |
|   ├── comprobantedepago/                      # caso de usos implementados         
│   │   └── comprobantedepago.repository.ts              
|   |
|   ├── carritodecompras/                       # caso de usos implementados 
│   │   └── carritodecompras.repository.ts              
|   |
|   ├── listadedeseo/                           # caso de usos implementados  
│   │   └── listadedeseo.repository.ts
|   |
│   └── pedido                                  # caso de usos implementados  
│       └── pedido.repository.ts
|
├── lib/                        # conexión a base de datos
|   ├── auth.ts
│   └── db.ts
│
├── database/                   # scripts de base de datos
│   ├── docker-compose.yml
│   └── init.sql
│
├── tests/                      # PRUEBAS
│   ├── services/
|   |   ├── cliente/
|   |   |   └── cliente.test.ts
|   |   |
|   |   └── motordebusqueda/
|   |       └── motordebusqueda.test.ts
|   |   
│   └── endpointTest/
|       ├── cliente/
|       |   └── cliente.endpoint.http
|       |
|       └── motordebusqueda/
|           └── motordebusqueda.endpoint.http
│
├── .env                        # variables de entorno
├── package.json
│   jest.config.js
└── tsconfig.json
```