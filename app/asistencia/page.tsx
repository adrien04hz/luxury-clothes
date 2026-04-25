export default function Asistencia() {
    const col1 = [
        {
            tema: "LuxuryClub",
            preguntas: [
                "Términos y condiciones",
                "Política de privacidad",
                "Política de cookies",
                "Conoce más sobre LuxuryClub",
            ],
        },
        {
            tema: "Entregas",
            preguntas: [
                "¿A cuánto ascienden los gastos de envío?",
                "¿Cuánto tardará en llegar mi pedido?",
                "¿Cómo puedo dar seguimiento a la entrega de mi pedido?",
                "¿Puedo hacer cambios en el domicilio de entrega de mi pedido?",
                "¿Qué debo hacer si mi pedido viene con signos de manipulación?",
            ],
        },
        {
            tema: "Proceso de pago",
            preguntas: [
                "¿Es seguro pagar en adidas?",
                "¿Qué opciones de pago ofrece adidas para comprar?",
                "¿Cómo funciona el pago en mensualidades CON INTERESES?",
                "¿Cómo funciona el pago en mensualidades SIN INTERESES?",
            ],
        },
        {
            tema: "Pedidos",
            preguntas: [
                "¿Puedo cancelar mi orden de compra?",
                "¿Mi pedido puede ser cancelado por adidas?",
                "¿Qué tipo de correos electrónicos puedo recibir en relación con mi pedido?",
                "¿Es necesario crear una cuenta para comprar en adidas.mx?",
                "¿Cómo puedo gestionar el contenido de mi carrito?",
            ],
        },
        {
            tema: "Productos",
            preguntas: [
                "Personalización de producto en línea",
                "Productos fabricados con una menor huella de carbono",
                "¿Qué garantías tienen mis productos?",
                "¿Cuál es mi talla adidas?",
                "¿Cómo puedo saber si un producto adidas es auténtico?",
            ],
        },
        {
            tema: "Información de la empresa",
            preguntas: [
                "Sobre LuxuryClothes",
                "¿Cómo puedo encontrar una tienda en mi zona?",
                "¿Cómo puedo trabajar o hacer prácticas en LuxuryClothes?",
                "¿Puedo hacer un trabajo para clase o proyecto de investigación sobre el grupo LuxuryClothes?",
                "¿Cómo usar el sitio?",
            ],
        },
        {
            tema: "Devoluciones y reembolsos",
            preguntas: [
                "¿Cuál es el plazo para solicitar una devolución?",
                "¿Cómo inicio una devolución desde mi cuenta?",
                "¿Cuánto tiempo tarda en reflejarse mi reembolso?",
                "¿Puedo cambiar un producto por otra talla o color?",
                "¿Qué productos no aplican para devolución?",
            ]
        },
    ];

    const col2 = [
        {
            tema: "Recoger en tienda",
            preguntas: [
                "¿Cómo puedo hacer un pedido para recoger en tienda?",
                "¿Están todos los productos disponibles para retirar en tienda?",
                "¿Cómo puedo pagar por mi pedido para recoger en tienda?",
                "¿Cuándo puedo recoger mi pedido en tienda?",
                "¿Qué necesito llevar para recoger mi pedido en tienda?",
            ],
        },

        {
            tema: "Tarjetas de Regalo",
            preguntas: [
                "Tarjeta de regalo",
            ],
        },

        {
            tema: "Vouchers y promociones",
            preguntas: [
                "¿Cómo puedo utilizar mi código promocional?",
                "¿Mi código de descuento tiene restricciones?",
                "¿Por qué mi código promocional no funciona con productos en rebajas?",
                "¿Puedo solicitar la reposición de un cupón de descuento?",
                "¿Por qué no funciona mi cupón de descuento?",
            ],
        },

        {
            tema: "Cuentas y suscripciones",
            preguntas: [
                "¿Cómo me suscribo a las newsletters de adidas?",
                "¿Cómo puedo crear una cuenta?",
                "¿Cómo puedo cambiar la contraseña de mi cuenta?",
                "¿Cómo modificar mi información personal en Mi Cuenta?",
                "¿Cómo puedo eliminar mi cuenta?",
            ],
        },

        {
            tema: "MAPA DEL SITIO",
            preguntas: [
                "Mapa del sitio",
            ],
        },
    ];
    return (
        <div className="w-full flex items-center justify-center p-24">
            <div className="flex flex-col items-start justify-start  h-full w-full gap-8">
                <div className=" w-full">
                    <p className="text-4xl font-bold">Preguntas frecuentes</p>
                </div>

                <div className="pl-12 w-full h-full flex items-start justify-start gap-12">
                    <div className="h-full ">
                        {col1.map((col) => (
                            <div key={col.tema} className="mb-8">
                                <p className="text-2xl font-bold mb-4">{col.tema}</p>
                                <ul className="list-disc list-inside">
                                    {col.preguntas.map((pregunta, index) => (
                                        <li key={index} className="mb-2 list-none hover:underline hover:cursor-pointer">{pregunta}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className=" h-full">
                        {col2.map((col) => (
                            <div key={col.tema} className="mb-8">
                                <p className="text-2xl font-bold mb-4">{col.tema}</p>
                                <ul className="list-disc list-inside">
                                    {col.preguntas.map((pregunta, index) => (
                                        <li key={index} className="mb-2 list-none hover:underline hover:cursor-pointer">{pregunta}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}