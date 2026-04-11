import Image from "next/image";

export default function TituloCatalogo() {
    return (
        // {/* titulo y apartado de filtro */}
        <div className="flex w-full justify-between mb-4">
        <div className="text-3xl font-medium">
            <p>Chamarras para Hombre (10) </p>
        </div>

        <div className="flex items-center space-x-1">
            <div className="text-xl">
            <p>Mostrar Filtros</p>
            </div>

            <div>
            <Image
                src="/assets/images/filter.svg"
                alt="Filtros"
                width={27}
                height={27}
            />
            </div>
        </div>
        </div>
    );
}