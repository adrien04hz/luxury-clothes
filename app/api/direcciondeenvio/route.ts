/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 19 de febrero de 2026
 */

import { NextResponse } from "next/server";
import { DireccionesEnvio } from "@/services/direcciondeenvio/direcciondeenvio.service";
import { count } from "console";

//endpoint que permite obtener las direcciones de envío de un cliente, recibe el id del cliente como query parameter
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const clientId = searchParams.get("clientId");
    const addressId = searchParams.get("addressId");

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }

    // Si viene addressId → traer una sola dirección
    if (addressId) {
      const address = await DireccionesEnvio.getAddress(
        Number(clientId),
        Number(addressId)
      );

      return NextResponse.json(address, { status: 200 });
    }

    // Si no viene → traer todas
    const addresses = await DireccionesEnvio.getAddresses(
      Number(clientId)
    );

    return NextResponse.json(addresses, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}


//endpoint que permite agregar una dirección de envío de un cliente, recibe el id del cliente como query parameter
export async function POST(req: Request) {
  try {
    const { clientId, data } = await req.json();

    if (!clientId || !data) {
      return NextResponse.json(
        { error: "Faltan datos (clientId, addressId o data)" },
        { status: 400 }
      );
    }

    const address = await DireccionesEnvio.addAddress(clientId, data);

    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

//endpoint que permite modficar una dirección de envío de un cliente, recibe el id del cliente como query parameter

export async function PUT(req: Request) {
  try {
    const { clientId, addressId, data } = await req.json();

    if (!clientId || !addressId || !data) {
      return NextResponse.json(
        { error: "Faltan datos (clientId, addressId o data)" },
        { status: 400 }
      );
    }

    const updatedAddress = await DireccionesEnvio.updateAddress(
      Number(clientId),
      Number(addressId),
      data
    );

    return NextResponse.json(updatedAddress, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

//endpoint que permite eliminar una dirección de envío de un cliente
export async function DELETE(req: Request) {
  try {
    const { clientId, addressId } = await req.json();

    if (!clientId || !addressId) {
      return NextResponse.json(
        { error: "Faltan datos (clientId o addressId)" },
        { status: 400 }
      );
    }

    await DireccionesEnvio.deleteAddress(
      Number(clientId),
      Number(addressId)
    );

    return NextResponse.json(
      { message: "Dirección eliminada correctamente" },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
