import { getCatalogo } from "@/client/producto.client";
import Carousel from "@/components/Carousel";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
export default async function Home() {
  const productos = await getCatalogo({});

  return (
    <>
      <Carousel slides={productos.productos?.slice(10,40)} />
    </>
  )
}
