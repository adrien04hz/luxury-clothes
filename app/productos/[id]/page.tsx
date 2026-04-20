import { getProducto } from "@/client/producto.client";
import { Loader } from "lucide-react";
import DetallesProductoCuerpo from "../components/DetallesProductoCuerpo";

type Props = {
  params: { id: number };
};

export default async function ProductoPage({ params }: Props) {
    const { id } = await params;
    const { data } = await getProducto(id);


    if (!data) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Loader className="animate-spin" size={48} />
            </div>
        );
    }

    return (
        <DetallesProductoCuerpo data={data} />
    );
}