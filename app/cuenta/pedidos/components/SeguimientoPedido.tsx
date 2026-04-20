import {
  Clock,
  PackageCheck,
  Box,
  Truck,
  CheckCircle2
} from "lucide-react";

type HistorialItem = {
  estado_pedido?: string;
  estado_envio?: string;
  fecha: string;
};

export default function SeguimientoPedido({
  historial = [],
}: {
  historial: HistorialItem[];
}) {

  const formatearFecha = (fecha: string) => {
    const d = new Date(fecha);

    const dia = d.getDate();
    const mes = d.toLocaleString("es-MX", { month: "short" });
    const año = d.getFullYear();
    const hora = d.getHours();
    const min = d.getMinutes().toString().padStart(2, "0");

    return `${dia} ${mes} ${año}, ${hora}:${min}`;
  };

  // Estado pedido (solo toma el último que tenga valor)
  const estadoPedido =
    [...historial].reverse().find(h => h.estado_pedido)?.estado_pedido || "Pendiente";

  // Estado envío (solo toma el último que tenga valor)
  const estadoEnvio =
    [...historial].reverse().find(h => h.estado_envio)?.estado_envio || "Preparando";

  const pasosEnvio = [
    { id: 1, nombre: "Pendiente", icono: <Clock size={20} /> },
    { id: 2, nombre: "Preparando", icono: <Box size={20} /> },
    { id: 3, nombre: "Enviado", icono: <PackageCheck size={20} /> },
    { id: 4, nombre: "En camino", icono: <Truck size={20} /> },
    { id: 5, nombre: "Entregado", icono: <CheckCircle2 size={20} /> },
  ];

  const pasoActual =
    pasosEnvio.findIndex(
      (p) => p.nombre.toLowerCase() === estadoEnvio.toLowerCase()
    ) + 1;

  return (
    <div className="w-full max-w-8xl bg-white p-8  space-y-8">

      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h3 className="text-lg font-bold">Estado del pedido</h3>
          <p className="text-sm text-gray-500">
            Última actualización:{" "}
            {historial.length > 0
              ? formatearFecha(historial.at(-1)!.fecha)
              : "Sin datos"}
          </p>
        </div>

        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
          {estadoPedido}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-6">Seguimiento del envío</h3>

        <div className="relative">
          {/* Línea base */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-800 -z-10" />

          {/* Línea progreso */}
          <div
            className="absolute top-5 left-0 h-1 bg-black transition-all duration-700 -z-10"
            style={{
              width: `${
                pasoActual > 0
                  ? ((pasoActual - 1) / (pasosEnvio.length - 1)) * 100
                  : 0
              }%`,
            }}
          />

          {/* Círculos */}
          <div className="flex justify-between">
            {pasosEnvio.map((paso) => (
              <div key={paso.id} className="flex flex-col items-center">

                <div
                 className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    paso.id < pasoActual
                      ? "bg-green-500 text-white border-green-500"
                      : paso.id === pasoActual
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-300 border-gray-300"
                  }`}
                >
                  {paso.icono}
                </div>

                <p
                  className={`mt-3 text-xs font-semibold ${
                    paso.id <= pasoActual ? "text-black" : "text-gray-400"
                  }`}
                >
                  {paso.nombre}
                </p>

              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-bold mb-2">Historial</h4>

        {historial.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay historial disponible</p>
        ) : (
          historial.map((h, i) => (
            <p key={i} className="text-sm text-gray-600">
              • {h.estado_pedido && `Pedido: ${h.estado_pedido}`}
              {h.estado_envio && ` | Envío: ${h.estado_envio}`} — {formatearFecha(h.fecha)}
            </p>
          ))
        )}
      </div>
    </div>
  );
}