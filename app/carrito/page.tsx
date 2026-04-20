'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCardCart from "./Components/ProductCardCart";
import { CarritoItem } from "@/types/carrito/carrito";
import { Loader } from "lucide-react";

export default function CarritoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CarritoItem[]>([]);

  const getCart = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/carrito", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Error al obtener el carrito');
      }

      const { data } = await res.json();
      setCartItems(data);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    getCart();
  }, [] );

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  const handleDisminuirCantidad = async (id: number, cantidad: number, id_talla: number)  => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/carrito`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: id,
          cantidad: cantidad,
          id_talla: id_talla,
          flag: "decrease",
        }),
      });

      if (!res.ok) {
        setLoading(false);
        throw new Error('Error al disminuir la cantidad');
      }

      await getCart();
    } catch (error) {
      throw new Error('Error al disminuir la cantidad');
    }
  }

  const handleAumentarCantidad = async (id: number, cantidad: number, id_talla: number)  => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/carrito`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: id,
          cantidad: cantidad,
          id_talla: id_talla,
          flag: "increase",
        }),
      });

      if (!res.ok) {
        setLoading(false);
        throw new Error('Error al aumentar la cantidad');
      }

      await getCart();
    } catch (error) {
      throw new Error('Error al aumentar la cantidad');
    }
  }


    const handleEliminarProducto = async (id: number, id_talla: number)  => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/carrito`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: id,
          id_talla: id_talla,
        }),
      });

      if (!res.ok) {
        setLoading(false);
        throw new Error('Error al eliminar el producto del carrito');
      }

      await getCart();
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito');
    }
  }


  const handleVaciarCarrito = async ()  => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/carrito/drop`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setLoading(false);
        throw new Error('Error al vaciar el carrito');
      }

      await getCart();
    } catch (error) {
      throw new Error('Error al vaciar el carrito');
    }
  }

  return (
    <div className="w-full h-full p-24 flex justify-center gap-8">
      {/* Contenedor para la bolsa */}
      <div className="flex flex-col gap-4 items-start w-fit">
        <p className="text-3xl font-medium">Carrito de compra</p>

        <div className="w-180 flex flex-col space-y-7">
          {
            loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Loader className="animate-spin" size={48} />
              </div>
            ) : (
              cartItems.length === 0 ? (
                <p className="text-xl font-medium opacity-70">Aquí aparecerán los productos que agregues al carrito</p>
              ) : (
                cartItems.map((item) => (
                  <ProductCardCart
                    key={`${item.id_producto}-${item.id_talla}`}
                    name={item.nombre}
                    price={item.precio}
                    image={item.imagen}
                    color={item.color}
                    talla={item.talla}
                    genero={"Para " + item.genero}
                    id={item.id_producto}
                    cantidad={item.cantidad}
                    id_talla={item.id_talla}
                    onDecrease={handleDisminuirCantidad}
                    onIncrease={handleAumentarCantidad}
                    onDelete={handleEliminarProducto}
                  />
                ))
              )
            )
          }
        </div>
      </div>

      {/* Contenedor para el resumen de compra */}
      <div className="w-90 flex flex-col gap-4 sticky top-24 h-fit">
        <p className="text-3xl font-medium">Resumen</p>

        {/* gastos y subtotal */}
        <div className="font-medium opacity-80 flex flex-col gap-4">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>$ {Number(getTotal()).toLocaleString()}</p>
          </div>

          <div className="flex justify-between">
            <p>Gastos de envío estimados</p>
            <p>Gratis</p>
          </div>
          <div className="border border-gray-200 w-full"></div>
        </div>

        {/* total */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>$ {Number(getTotal()).toLocaleString()}</p>
          </div>
          <div className="border border-gray-200 w-full"></div>
        </div>

        {/* Boton */}
        <div className="w-full mt-4">
          <button 
          disabled={cartItems.length === 0}
          className="bg-black text-white py-2 px-4 rounded-full w-full h-16 hover:opacity-60 font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
              Realizar compra
          </button>
        </div>

        <div className="w-full">
          <button 
          onClick={() => handleVaciarCarrito()}
          disabled={cartItems.length === 0}
          className="text-black bg-white py-2 px-4 rounded-full w-full h-16 border border-[#E6E6E6] hover:border-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
            Vaciar carrito
          </button>
        </div>

      </div>
    </div>
  );
}