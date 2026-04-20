"use client";

import { useState } from "react";
import { Talla } from "@/types/producto/Producto";

export default function SelectorTalla({ tallas, onSelect, onClick, onSelectedTalla } : { tallas: Talla[], onSelect: (talla: number | null) => void, onClick: (notSelected: boolean) => void, onSelectedTalla: (tallaName: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-2 w-fit">
      {tallas.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (item.stock === 0) return;
            if (selected === item.talla) {
              setSelected(null);
              onSelect(null);
              onClick(false);
              onSelectedTalla("");
            } else {
              setSelected(item.talla);
              onSelect(item.id);
              onClick(false);
              onSelectedTalla(item.talla);
            }
          }}
          className={`
            w-30 h-12 border rounded-md flex items-center justify-center
            ${item.stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[#111111]"}
            ${selected === item.talla ? "border-black" : "border-[#E6E6E6]"}
          `}
        >
          {item.talla} ({item.stock})
        </div>
      ))}
    </div>
  );
}