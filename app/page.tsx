import { getProveedoresBancarios } from "@/client/proveedor.client";
import Image from "next/image";

export default async function Home() {
  const { data } = await getProveedoresBancarios();

  return (
    <div>
      {data.map( proovedor  => (
        <div key={proovedor.id}>
          <h2>{proovedor.nombre}</h2>
          <Image src={proovedor.url} alt={proovedor.nombre} width={200} height={200} />
        </div>
      ))}
    </div>
  );
}
