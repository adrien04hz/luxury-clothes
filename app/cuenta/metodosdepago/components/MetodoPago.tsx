//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 21/04/2026 */
//**********/
"use client";

import { Dispatch, SetStateAction } from "react";
import { detectarDatosTarjeta, formatearTarjeta } from "../utils/tarjetas";

type Props = {
    open: boolean;
    modo: "crear" | "editar";
    form: any;
    setForm: Dispatch<SetStateAction<any>>;
    onClose: () => void;
    onSave: () => void;
};

export default function MetodoPagoModal({
    open,
    modo,
    form,
    setForm,
    onClose,
    onSave
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-xl">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-6">
                    {modo === "editar" ? "Modificar tarjeta" : "Agregar tarjeta"}
                </h2>

                <form className="space-y-5">

                    <select
                        value={form.id_tipo_metodo}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                id_tipo_metodo: Number(e.target.value)
                            })
                        }
                        className="w-full border rounded-md px-3 py-2 bg-gray-100"
                    >
                        <option value={1}>Crédito</option>
                        <option value={2}>Débito</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Nombre del titular"
                        value={form.nombre_titular}
                        onChange={(e) =>
                            setForm({ ...form, nombre_titular: e.target.value })
                        }
                        className="w-full border rounded-md px-3 py-2 bg-gray-100"
                    />

                    <input
                        type="text"
                        placeholder="Número de tarjeta"
                        value={formatearTarjeta(form.numero_cuenta)}
                        onChange={(e) => {
                            const limpio = e.target.value.replace(/\D/g, "")

                            const { banco, id_proveedor } =
                                detectarDatosTarjeta(limpio);

                            setForm({
                                ...form,
                                numero_cuenta: limpio,
                                banco,
                                id_proveedor
                            });
                        }}
                        className="w-full border rounded-md px-3 py-2 bg-gray-100"
                    />

                    <input
                        type="date"
                        value={form.fecha_vencimiento}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                fecha_vencimiento: e.target.value
                            })
                        }
                        className="w-full border rounded-md px-3 py-2 bg-gray-100"
                    />

                    <button
                        type="button"
                        onClick={onSave}
                        className="w-full bg-black text-white py-3 rounded-full hover:opacity-90"
                    >
                        {modo === "editar"
                            ? "Guardar cambios"
                            : "Agregar tarjeta"}
                    </button>
                </form>
            </div>
        </div>
    );
}