import Image from "next/image";

interface Marca {
  id: number;
  nombre: string;
  imagen_url: string;
}

async function getMarcas(): Promise<Marca[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/marcas`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener marcas");
    }

    const json = await res.json();

    return json.data ?? [];
  } catch (error) {
    console.error("Error cargando marcas:", error);
    return [];
  }

}

export default async function Page() {
  const marcas = await getMarcas();

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 md:px-16 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Marcas
        </h1>
        <p className="text-gray-500 mt-2">
          Lista de marcas registradas
        </p>
      </div>

      {marcas.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

          {marcas.map((marca) => (
            <div
              key={marca.id}
              className="group bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 relative mb-3">
                <Image
                  src={marca.imagen_url || "/assets/no-image.png"}
                  alt={marca.nombre}
                  fill
                  className="object-contain group-hover:scale-105 transition"
                />
              </div>
            </div>
          ))}

        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          No hay marcas registradas
        </div>
      )}
    </div>
  );
}