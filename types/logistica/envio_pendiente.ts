export interface EnvioPendiente {
    id_pedido: number,
    cliente_nombre: string,
    cliente_apellido: string,
    fecha_estimada: string,
    numero_guia: string,
    estado_envio: string
}

export interface EstadoEnvioDetalle {
  id_pedido: number;
  estado: string;
  descripcion: string;
  fecha_envio: string;
  fecha_entrega_estimada: string;
}