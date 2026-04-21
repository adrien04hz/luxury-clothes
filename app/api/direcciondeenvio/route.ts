/**
 * Equipo #1
 * Valeriano López Magali Natividad
 * 19 de febrero de 2026
 */

import { NextResponse } from "next/server";
import { DireccionesEnvio } from "@/services/direcciondeenvio/direcciondeenvio.service";
import { getUserFromToken } from "@/lib/auth";

//endpoint que permite obtener las direcciones de envío de un cliente, recibe el id del cliente como query parameter
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // const clientId = searchParams.get("clientId");
    const user = getUserFromToken(req);
    const addressId = searchParams.get("addressId");

    if (!user) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }
    // console.log(req.headers.get("authorization"));
    
    const clientId = user.id;
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

    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }
    const clientId = user.id;
    const data = await req.json();

    // console.log("USER:", user);
    // console.log("CLIENT_ID:", clientId);
    // console.log("DATA:", data);

    if (!data) {
      return NextResponse.json(
        { error: "Faltan datos (clientId, addressId o data)" },
        { status: 400 },
      );
    }

    const address = await DireccionesEnvio.addAddress(clientId, data);

    

    return NextResponse.json({direccion: address}, { status: 201 });
  } catch (error: any) {
    console.log("❌ ERROR POST:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

//endpoint que permite modficar una dirección de envío de un cliente, recibe el id del cliente como query parameter

export async function PUT(req: Request) {
  try {

    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 401 }
      );
    }
    const clientId = user.id;

    const { addressId, data } = await req.json();

    if (!clientId) {
      return NextResponse.json({ error: "No hay token válido" }, { status: 401 });
    }

    if (!addressId) {
      return NextResponse.json({ error: "Falta addressId" }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "Falta data" }, { status: 400 });
    }

    const updatedAddress = await DireccionesEnvio.updateAddress(
      Number(clientId),
      Number(addressId),
      data
    );

    return NextResponse.json(updatedAddress, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: "DUPLICATE_ADDRESS",
        message: "Esta dirección ya está registrada."
      },
      { status: 409 } 
    );
  }
}

//endpoint que permite eliminar una dirección de envío de un cliente
export async function DELETE(req: Request) {
  try {
    
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }
    const clientId = user.id;
    
    const { addressId } = await req.json();

    if (!addressId) {
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
