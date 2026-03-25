import { getCatalogo } from "@/client/producto.client";
import Carousel from "@/components/Carousel";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Image from "next/image";
export default async function Home() {
  const productos = await getCatalogo({id_genero: 1, id_subcategoria: 4});

  return (
    <>

      {
        productos.productos?.map((producto) => (
          <div key={producto.id}>
            <h2>{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <Image src={producto.imagen_url || "/default-image.jpg"} alt={producto.nombre} width={200} height={200}/>
          </div>
        ))

      }
      
      <Footer />
    </>
  )
}
