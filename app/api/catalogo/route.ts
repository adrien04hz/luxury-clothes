/**
 * Equipo #1
 * Hernández Sánchez Adrien
 * 6 de febrero de 2026
 */
import { NextResponse } from 'next/server';
import { Producto } from '@/services/producto/producto.service';

export async function GET ( request: Request ) {
  try {
    const { searchParams } = new URL(request.url);
    const id_genero = searchParams.get('id_genero') ? parseInt(searchParams.get('id_genero')!) : undefined;
    const id_categoria = searchParams.get('id_categoria') ? parseInt(searchParams.get('id_categoria')!) : undefined;
    const id_subcategoria = searchParams.get('id_subcategoria') ? parseInt(searchParams.get('id_subcategoria')!) : undefined;
    const id_marca = searchParams.get('id_marca') ? parseInt(searchParams.get('id_marca')!) : undefined;
    const id_color = searchParams.get('id_color') ? parseInt(searchParams.get('id_color')!) : undefined;

    const productos = await Producto.getCatalog({
      id_genero,
      id_categoria,
      id_subcategoria,
      id_marca,
      id_color
    });

    return NextResponse.json({
      ok: true,
      count: productos.length,
      productos
    });
  } catch (error) {
    console.error('Error api/catalogo/:', error);
    return NextResponse.json({
      ok: false,
      message: 'Error al obtener el catálogo de productos'
    });
  }
}

