'use client';
import { Producto } from "@/types/producto/Producto";
import GalleryDetails from "./GalleryDetails";
import SelectorTalla from "./SelectorTalla";
import AddToCartButton from "./AddToCartBtn";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DetallesProductoCuerpo({ data }: { data: Producto }) {
    const [talla, setTalla] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
		const [notSelected, setNotSelected] = useState(false);
    const router = useRouter();

    const handleAddToCart = async () => {
			setLoading(true);
			if (!talla) {
				setLoading(false);
				setNotSelected(true);
				return;
			}

			const token = localStorage.getItem("token");

			console.log("Token:", token);
			if (!token) {
				setLoading(false);
				router.push("/auth/login");
				return;
			}

			try {
				await fetch("/api/carrito", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id_producto: data.id,
						id_talla: talla,
						cantidad: 1,
					}),
				});

				console.log("Producto agregado");
			} catch (error) {
				console.error(error);
			}

			setLoading(false);
		};

    return (
        <div className="p-24 w-full h-full flex gap-8 justify-center">
            {/* Div para la galeria de imagenes */}
            <GalleryDetails data={data} />

            {/* Div para la informacion del producto */}
            <div>
                <div className="font-semibold text-2xl w-100 h-fit mt-6">
                    <p>{data.nombre}</p>
                </div>
                <div className="w-100 h-fit font-regular text-[14px] opacity-50 mt-2">
                    <p>{data.descripcion}</p>
                </div>
                <div className="font-semibold text-[16px] mt-6">
                    <p>${Number(data.precio).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4 text-[16px] mt-8">
                    <p className="font-bold">Color: </p>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: getColor(data.color || "lightgray") }}></div>
                        <p>{data.color}</p>
                    </div>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                    <p className={`font-semibold ${notSelected ? 'text-red-500' : ''}`}>Selecciona tu talla:</p>
                    <div className={`w-fit ${notSelected ? 'border border-red-500' : ''} py-2 rounded-md`}>
											<SelectorTalla
													tallas={data.stock_por_talla || []}
													onSelect={setTalla}
													onClick={setNotSelected}
											/>
										</div>
                </div>
                <div className="mt-12 w-full">
                    <AddToCartButton 
											onClick={handleAddToCart}
											loading={loading}
                    />
                </div>

                <div className="mt-6 w-full">
                    <button className="text-black bg-white py-2 px-4 rounded-[28px] w-full h-16 border border-[#E6E6E6] hover:border-black">
                        Añadir a lista de deseos
                    </button>
                </div>
            </div>
        </div>
    );
}

function getColor(nombre: string) {
    switch (nombre.toLowerCase()) {
        case "negro":
            return "#111111";
        case "blanco":
            return "#F2F1ED";
        case "rojo":
            return "#7A1E1E";
        case "azul":
            return "#0F1A2B";
        case "verde":
            return "#0F3D2E";
        case "amarillo":
            return "#C6A75E";
        case "gris":
            return "#4A4F55";
        case "naranja":
            return "#A65A3A";
        case "rosa":
            return "#B76E79";
        case "morado":
            return "#4B2E3F";
        case "café":
            return "#3B241C";
        case "cafe":
            return "#3B241C";
        case "beige":
            return "#C8B69C";
        default:
            return "lightgray";
    }
}