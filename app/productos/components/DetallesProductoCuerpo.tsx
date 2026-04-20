'use client';
import { Producto } from "@/types/producto/Producto";
import GalleryDetails from "./GalleryDetails";
import SelectorTalla from "./SelectorTalla";
import AddToCartButton from "./AddToCartBtn";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import Image from "next/image";


export default function DetallesProductoCuerpo({ data }: { data: Producto }) {
    const [talla, setTalla] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
	const [notSelected, setNotSelected] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isWishList, setIsWishList] = useState(false);
	const [tallaName, setTallaName] = useState<string>("");
	const [inWishlist, setInWishlist] = useState(false);
    const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			if (showModal) setShowModal(false);
		}, 8000);
	}, [showModal]);

	useEffect(() => {
		checkProduct();
	}, []);

	const checkProduct = async () => {
		const token = localStorage.getItem("token");

		if (!token) return;

		try {
			const res = await fetch(`/api/listadeseos/check?id_producto=${data.id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const json = await res.json();
			setInWishlist(json.exists);
		} catch (error) {
			console.error(error);
		}
	};


    const handleAddToCart = async () => {
		setLoading(true);
		if (!talla) {
			setLoading(false);
			setNotSelected(true);
			return;
		}

		const token = localStorage.getItem("token");

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

			setShowModal(true);
		} catch (error) {
			console.error(error);
		}

		setLoading(false);
	};

    const handleAddToWishList = async (id_producto: number) => {
		setLoading(true);
		const token = localStorage.getItem("token");

		if (!token) {
			setLoading(false);
			router.push("/auth/login");
			return;
		}

		try {
			await fetch("/api/listadeseos", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					productId: id_producto,
				}),
			});

			setIsWishList(true);
			setInWishlist(true);
			setShowModal(true);
		} catch (error) {
			console.error(error);
		}

		setLoading(false);
	};

	const handleDeleteFromWishList = async (id_producto: number) => {
		setLoading(true);
		const token = localStorage.getItem("token");

		if (!token) {
			setLoading(false);
			router.push("/auth/login");
			return;
		}

		try {
			const res = await fetch("/api/listadeseos", {
				method: "DELETE",
				headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ 	productId: id_producto }),
			});

			if (!res.ok) {
				throw new Error("Error al eliminar el producto de la lista de deseos");
			}

			setIsWishList(true);
			setInWishlist(false);
			setShowModal(true);
		} catch (error) {
			console.error(error);
		}

		setLoading(false);
	};

    return (
			<>
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
                    <p>$ {Number(data.precio).toLocaleString()}</p>
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
								onSelectedTalla={setTallaName}
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
                    <button 
					onClick={() => {
						if (inWishlist) {
							handleDeleteFromWishList(data.id);
						} else {
							handleAddToWishList(data.id);
						}
					}}
					className="text-black bg-white py-2 px-4 rounded-[28px] w-full h-16 border border-[#E6E6E6] hover:border-black">
                        {inWishlist ? "Eliminar de lista de deseos" : "Añadir a lista de deseos"}
                    </button>
                </div>
            </div>
        </div>

				
				<div className={`  fixed inset-0 z-50 flex justify-end
				transition-all duration-300
				${showModal 
					? "visible opacity-100 pointer-events-auto" 
					: "invisible opacity-0 pointer-events-none"}
				`}>
					
					{/* OVERLAY */}
					<div 
						className={`
							absolute inset-0 bg-black/30
							transition-opacity duration-300
							${showModal ? "opacity-100" : "opacity-0"}
						`}
						onClick={() => setShowModal(false)}
					/>

					{/* PANEL DERECHO */}
					<div className={`
						relative w-100 h-fit bg-black shadow-xl
						mt-26 mr-12
						transform transition-all duration-300 ease-in-out
						rounded-xl
						${showModal 
							? "translate-y-0 opacity-100" 
							: "-translate-y-10 opacity-0"}`}
					>

						{/* HEADER */}
						<div className="flex justify-between items-center p-4">
							
							<div className="flex gap-2 items-center">
								<CheckCircle2Icon className="text-green-500" />
								<p className="font-semibold text-lg text-white">
								{isWishList ? (!inWishlist ? "Eliminado de la lista de deseos" : "Agregado a la lista de deseos" ): "Agregado al carrito"}
								</p>
							</div>

							<div className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors duration-200 flex items-center justify-center">
								<button onClick={() => setShowModal(false)}>
									✕
								</button>
							</div>
						</div>

						{/* PRODUCTO */}
						<div className="p-4 flex gap-4 w-full h-full">
							<div className="relative h-20 w-20 overflow-hidden">
								<Image src={data.imagenes?.[0] || ""} alt={data.nombre} className="object-cover rounded" fill/>
							</div>

							<div className="flex flex-col gap-1 w-3/4">
								<p className="font-medium text-white">{data.nombre}</p>
								{!isWishList && <p className="text-sm text-white opacity-70">
									Talla: {tallaName}
								</p>}
								<p className="font-semibold text-white">
									${Number(data.precio).toLocaleString()}
								</p>
							</div>
						</div>

						{/* BOTONES */}
						<div className="p-4 flex flex-col gap-3">
							<button
								onClick={() => {
									isWishList ? router.push("/cuenta/listadedeseos") :
									router.push("/carrito")
								}}
								className="border border-white text-white rounded-full py-3 hover:opacity-60 transition-colors duration-100"
							>
								{isWishList ? "Ver lista de deseos" : "Ver carrito"}
							</button>

							<button
							onClick={() => setShowModal(false)}
								className="bg-white text-black rounded-full py-3 hover:opacity-60 transition-opacity duration-100"
							>
								Seguir comprando
							</button>
						</div>
					</div>
				</div>
				
			</>
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