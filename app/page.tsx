import { getProveedoresBancarios } from "@/client/proveedor.client";
import Image from "next/image";

export default async function Home() {
  const { data } = await getProveedoresBancarios();

  return (
    <div>
      En ploceso
    </div>
  );
}
