//***********/
//* Nombre del equipo: Equipo 1 */
//* Autor : Diaz Antonio Luis Pedro*/
//* Fecha: 21/04/2026 */
//**********/
// Declaracion de bancos conocidos
export const BIN_BANCOS: Record<string, string> = {
    "415231": "BBVA",
    "455555": "BBVA",
    "411111": "Santander",
    "520416": "Banamex",
    "525498": "Banamex",
    "555555": "Santander",
};

// provedor
export const detectarProveedor = (num: string) => {
    if (/^4/.test(num)) return { proveedor: "Visa", id: 1 };
    if (/^5[1-5]/.test(num)) return { proveedor: "Mastercard", id: 2 };
    if (/^3[47]/.test(num)) return { proveedor: "Amex", id: 3 };

    return { proveedor: "Desconocido", id: 0 };
};

// banco
export const detectarBanco = (num: string) => {
    const bin = num.slice(0, 6);
    return BIN_BANCOS[bin] || "Banco desconocido";
};

//formateo de tarjeta
export const formatearTarjeta = (valor: string) => {
    return valor
        .replace(/\D/g, "")
        .slice(0, 16) 
        .replace(/(.{4})/g, "$1 ")
        .trim();
};

// detectar tarjeta
export const detectarDatosTarjeta = (numero: string) => {
    const limpio = numero.replace(/\s/g, "");

    if (limpio.length < 4) {
        return {
            banco: "",
            proveedor: "",
            id_proveedor: 0,
        };
    }

    const { proveedor, id } = detectarProveedor(limpio);
    const banco = detectarBanco(limpio);

    return {
        banco,
        proveedor,
        id_proveedor: id,
    };
};