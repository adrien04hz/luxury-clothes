import Image from "next/image";
import { getCatalogo } from "@/client/producto.client";

export default async function Home() {
  const {productos} = await getCatalogo({ id_genero: 1, id_categoria: 2 });
  return (
    <div>
      {
        productos?.map((producto) => (
          <div key={producto.id}>
            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p>Precio: {producto.precio}</p>
            <p>Marca: {producto.marca}</p>
            {producto.imagen_url && (
              <Image
                src={producto.imagen_url}
                alt={producto.nombre}
                width={200}
                height={200}
              />
            )}
          </div>
        ))
      }
    </div>
  );
}
