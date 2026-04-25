//parametros
//showBoton, que sea dinamico el card 
/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 9 de Abril de 2026
 */
"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { ListaDeDeseos } from "@/types/listadedeseos/ListaDeDeseos";
import { Producto } from "@/types/producto/Producto";

export default function ProductCard(
  { 
    product, 
    showToCart = true,  //mostrar boton de agregar al carrito
    showIcon = true,    //mostrar icono de favorito
    onRemoveFavorite,     //funcion para eliminar de favoritos
    onUndo,
    onViewTallas,
    onSetView,
    pendingDelete,
    item,
  }
  : 
  { 
    product?: ListaDeDeseos,
    showToCart?: boolean, 
    showIcon?: boolean,
    onRemoveFavorite?: (productId: number) => void,
    onUndo?: () => void,
    onViewTallas?: (productId: number) => void,
    onSetView?: (view: "none" | "selector" | "modal") => void;
    pendingDelete?: boolean,
    item?: Producto
  }
) {

  return (
    // Quitamos alturas fijas del contenedor principal
    <div className="border border-gray-200 flex flex-col h-full">
      
      <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden">
        
        <div className="relative h-full w-full">
          <Image
            src={product?.imagenes?.[0] || item?.imagen_url || "/assets/images/bag.svg"}
            fill
            alt={product?.nombre || item?.nombre || "Producto"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        {showIcon && (
          <button
            onClick={() => onRemoveFavorite?.(product!.id)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-100 transition"
            >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={"black"}
              stroke="black"
              strokeWidth="2"
            >
              <path d="M12 21s-6.5-4.35-9.5-8.5C-0.2 8.4 2.2 3.5 6.5 3.5c2.1 0 3.5 1.3 5.5 3.5 2-2.2 3.4-3.5 5.5-3.5 4.3 0 6.7 4.9 4 9C18.5 16.65 12 21 12 21z"/>
            </svg>
          </button>
        ) }
        {pendingDelete && (
          <div className="absolute inset-0 bg-white/30">
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center justify-center text-white bg-black rounded-md">
              <div className="flex items-center pr-4">
                <p className="text-base font-semibold tracking-tight">
                  Eliminando de favoritos...
                </p>
              </div>

            <button
              onClick={onUndo}
              className="text-white hover:text-gray-300 transition-colors 
                        underline underline-offset-4 text-sm font-medium
                        flex items-center gap-1.5"
            >
              Deshacer
            </button>

          </div>
        </div>
        )} 

      </div>

      <div className="p-4 flex flex-col">
        <h2 className="text-black font-semibold">{product?.marca || item?.marca}</h2>

        <p className="text-black font-regular mb-4">
          {product?.nombre || item?.nombre}
        </p>

        <div className="mt-auto">
          <p className="text-black font-medium">
            {Number(product?.precio || item?.precio).toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
              })}
          </p>
          
          {showToCart && (
            <button
            onClick={() => {
              onViewTallas?.(product!.id);
              onSetView?.("selector");
            }}
              className="bg-black text-white py-2 px-4 rounded-full w-full h-12 hover:opacity-60 transition-all duration-100 mt-5"
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}