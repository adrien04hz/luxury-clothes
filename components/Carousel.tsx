"use client"

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";
import { Producto } from "@/types/Producto";
import Image from "next/image";

export default function Carousel(
    {
        slides,
    } : {
        slides: Producto[] | undefined
    }
) {
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  // autoplay
  useEffect(() => {
    if (!emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 4000)

    return () => clearInterval(interval)
  }, [emblaApi])

  // detectar slide actual
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi])

  return (
    <div className="relative overflow-hidden h-150 border border-amber-600">
      <div ref={emblaRef}>
        <div className="flex">
          {slides?.map((slide) => (
            <div key={slide.id} className="min-w-full relative">
                
              <Image
                src={slide?.imagen_url || ''}
                alt={slide?.nombre}
                className="w-full h-full object-cover"
                width={300}
                height={300}
                loading="lazy"
              />

              {/* Texto */}
              <div className="absolute left-16 bottom-16 text-white">
                <p className="text-sm mb-2">{''}</p>
                <h2 className="text-3xl font-semibold mb-4">
                  {slide?.nombre}
                </h2>
                <button className="bg-white text-black px-4 py-2 rounded-full text-sm">
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full"
      >
        ‹
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white w-10 h-10 rounded-full"
      >
        ›
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides?.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full ${
              index === selectedIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
