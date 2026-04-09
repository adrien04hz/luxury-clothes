// # pagina de inicio principal, listado de todos los productos haciendo uso de filtrado
import { getCatalogo } from "@/client/producto.client";
import Image from "next/image";
export default async function Home() {
  const {productos} = await getCatalogo({id_categoria: 1});

  return (
    <>

      <h1>Soy solo el contenido</h1>
      {
        // productos?.map((producto) => (
        //   <div key={producto.id}>
        //     <h2>{producto.nombre}</h2>
        //     <p>{producto.descripcion}</p>
        //     <Image src={producto.imagen_url || "/default-image.jpg"} alt={producto.nombre} width={200} height={200}/>
        //   </div>
        // ))
      }
      
    </>
  )
}
