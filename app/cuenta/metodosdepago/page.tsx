//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 21/04/2026 */
//**********/
"use client";

import { useState, useEffect } from "react";
import MetodoPagoModal from "./components/MetodoPago";
import SidebarCuenta from "@/app/components/SidebarCuenta";

export default function MetododePagoPage() {
    const [metodos, setMetodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        nombre_titular: "",
        numero_cuenta: "",
        fecha_vencimiento: "",
        banco: "",
        correo: "",
        id_tipo_metodo: 1,
        id_proveedor: 1
    });

    const [modal, setModal] = useState<{
        open: boolean;
        modo: "crear" | "editar";
        metodo?: any;
    }>({
        open: false,
        modo: "crear"
    });

    // Cargar los metodos 
    useEffect(() => {
        cargarMetodos();
    }, []);

    const cargarMetodos = async () => {
        const userID = localStorage.getItem("userID");

        const res = await fetch(`/api/metodosdepago/vermetodos?clienteId=${userID}`);
        const data = await res.json();

        if (data.ok) setMetodos(data.data);
        setLoading(false);
    };

    // Abrir el modal en formato de agregar
    const abrirCrear = () => {
        setForm({
            nombre_titular: "",
            numero_cuenta: "",
            fecha_vencimiento: "",
            banco: "",
            correo: "",
            id_tipo_metodo: 1,
            id_proveedor: 1
        });

        setModal({ open: true, modo: "crear" });
    };

    //Abrir elmodal en formato de modificar
    const abrirEditar = (m: any) => {
        setForm({
            nombre_titular: m.nombre_titular,
            numero_cuenta: m.numero_cuenta,
            fecha_vencimiento: m.fecha_vencimiento?.split("T")[0],
            banco: m.banco,
            correo: "",
            id_tipo_metodo: m.id_tipo_metodo,
            id_proveedor: m.id_proveedor
        });

        setModal({ open: true, modo: "editar", metodo: m });
    };

    // Regresar a forma base
    const cerrarModal = () => {
        setModal({ open: false, modo: "crear" });
    };

    // Agregar metodo
    const agregarMetodo = async () => {
        const userID = localStorage.getItem("userID");

        await fetch("/api/metodosdepago/agregar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, id_usuario: userID })
        });

        cerrarModal();
        cargarMetodos();
    };

    // Modificar el metodo
    const modificarMetodo = async (id: number) => {
        const userID = localStorage.getItem("userID");

        await fetch("/api/metodosdepago/modificar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                id_usuario: userID,
                id_metodo: id
            })
        });

        cerrarModal();
        cargarMetodos();
    };

    // Eliminar el metodo
    const eliminarMetodo = async (id: number) => {
        const userID = localStorage.getItem("userID");

        await fetch("/api/metodosdepago/eliminar", {
            method: "DELETE",
            body: JSON.stringify({
                id_usuario: userID,
                id_metodo: id
            })
        });

        cargarMetodos();
    };

    // definir la situacion de modificar o agregar
    const handleGuardar = () => {
        if (modal.modo === "editar" && modal.metodo) {
            modificarMetodo(modal.metodo.id);
        } else {
            agregarMetodo();
        }
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-7xl mx-auto px-8 py-6">
                <h1 className="text-2xl font-bold mb-6">
                    Métodos de pago
                </h1>
                <p className="text-gray-500 mb-8">
                    Métodos de pago disponibles ({metodos.length})
                </p>
            </div>
            <div className="flex flex-1 w-full max-w-7xl px-50">
                <SidebarCuenta />
                <div className="flex-1 p-10">

                    {/* diseño de la tarjeta */}
                    <div className="flex flex-col gap-4">
                        {metodos.map((m) => (
                            <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-5 w-full max-w-md">

                                <h2 className="text-lg font-semibold mb-1">
                                    {m.banco || "Tarjeta"}
                                </h2>

                                <p className="text-gray-700 text-sm">
                                    {m.nombre_titular}
                                </p>

                                <p className="text-gray-500 text-sm mb-3">
                                    **** {m.numero_cuenta?.slice(-4)}
                                </p>

                                <div className="flex gap-2">
                                    <button onClick={() => abrirEditar(m)} className="px-3 py-1 text-sm bg-gray-200 rounded-md">
                                        Editar
                                    </button>

                                    <button onClick={() => eliminarMetodo(m.id)} className="px-3 py-1 text-sm bg-gray-100 text-red-600 rounded-md">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={abrirCrear} className="bg-black text-white px-6 py-3 rounded-full mt-6">
                        + Agregar tarjeta
                    </button>

                    {/* Agregar el modal */}
                    <MetodoPagoModal
                        open={modal.open}
                        modo={modal.modo}
                        form={form}
                        setForm={setForm}
                        onClose={cerrarModal}
                        onSave={handleGuardar}
                    />
                </div>
            </div>

        </div>
    );
}
