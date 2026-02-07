import { NextResponse } from "next/server";
import { AuthService } from "@/services/AuthService";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await AuthService.register(body);

    return NextResponse.json({
      message: "Usuario creado correctamente"
    });

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
