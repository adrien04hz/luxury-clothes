import { NextResponse } from "next/server";
import { AuthService } from "@/services/AuthService";

export async function POST(req: Request) {
  try {
    const { correo, contrasena } = await req.json();

    const token = await AuthService.login(correo, contrasena);

    return NextResponse.json({ token });

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}
