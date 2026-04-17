import { Package, Truck, CheckCircle2, Box } from "lucide-react";

export default function SeguimientoPedido() {
  // Simulación de estado: 1: Confirmado, 2: Preparando, 3: En camino, 4: Entregado
  const pasoActual = 3; 

  const pasos = [
    { id: 1, nombre: "Confirmado", icono: <CheckCircle2 size={20} /> },
    { id: 2, nombre: "Preparando", icono: <Box size={20} /> },
    { id: 3, nombre: "En camino", icono: <Truck size={20} /> },
    { id: 4, nombre: "Entregado", icono: <Package size={20} /> },
  ];

  return (
    <div className="w-full max-w-3xl bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-black">Pedido #NIKE-992834</h3>
          <p className="text-sm text-gray-500">Llegada estimada: 20 de Abril, 2026</p>
        </div>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
          {pasos[pasoActual - 1].nombre}
        </span>
      </div>

      {/* Contenedor de la Barra de Progreso */}
      <div className="relative">
        {/* Línea de fondo (gris) */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10" />
        
        {/* Línea de progreso (negra) dinámica */}
        <div 
          className="absolute top-5 left-0 h-1 bg-black transition-all duration-700 -z-10" 
          style={{ width: `${((pasoActual - 1) / (pasos.length - 1)) * 100}%` }}
        />

        {/* Círculos de los Pasos */}
        <div className="flex justify-between">
          {pasos.map((paso) => (
            <div key={paso.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  paso.id <= pasoActual 
                    ? "bg-black border-black text-white" 
                    : "bg-white border-gray-300 text-gray-300"
                }`}
              >
                {paso.icono}
              </div>
              <p className={`mt-3 text-xs font-semibold ${
                paso.id <= pasoActual ? "text-black" : "text-gray-400"
              }`}>
                {paso.nombre}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detalle adicional */}
      <div className="mt-10 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
        <div className="bg-white p-2 rounded-md shadow-sm">
          <Truck className="text-black" />
        </div>
        <div>
          <p className="text-sm font-bold">Última actualización</p>
          <p className="text-xs text-gray-600">Tu paquete salió del centro de distribución en CDMX.</p>
        </div>
      </div>
    </div>
  );
}