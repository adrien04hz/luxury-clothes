import ProductCardCart from "./Components/ProductCardCart";

export default function CarritoPage() {
  const name = 'Zapatillas Speedrock de piel y malla';
  const price = 184830000.00;
  const image = 'https://www.prada.com/content/dam/pradabkg_products/2/2EE/2EE468/3ZM0F0002/2EE468_3ZM0_F0002_F_G000_SLR.jpg/_jcr_content/renditions/cq5dam.web.hebebed.1000.1000.jpg';
  const color = 'Negro';
  const talla = '30';
  const genero = 'Tenis para hombre';

  return (
    <div className="w-full h-full p-24 flex justify-center gap-8">
      {/* Contenedor para la bolsa */}
      <div className="flex flex-col gap-4 items-start w-fit">
        <p className="text-3xl font-medium">Carrito de compra</p>

        <div className="w-full">
          <ProductCardCart
            name={name}
            price={price}
            image={image}
            color={color}
            talla={talla}
            genero={genero}
            id={1}
          />
        </div>
      </div>

      {/* Contenedor para el resumen de compra */}
      <div className="w-90 flex flex-col gap-4">
        <p className="text-3xl font-medium">Resumen</p>

        {/* gastos y subtotal */}
        <div className="font-medium opacity-80 flex flex-col gap-4">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>${Number(price).toLocaleString()}</p>
          </div>

          <div className="flex justify-between">
            <p>Gastos de envío estimados</p>
            <p>Gratis</p>
          </div>
          <div className="border border-gray-200 w-full"></div>
        </div>

        {/* total */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between font-semibold">
            <p>Total</p>
            <p>${Number(price).toLocaleString()}</p>
          </div>
          <div className="border border-gray-200 w-full"></div>
        </div>

        {/* Boton */}
        <div className="w-full mt-4">
          <button className="bg-black text-white py-2 px-4 rounded-full w-full h-16 hover:opacity-60 font-semibold">
              Realizar compra
          </button>
        </div>

      </div>
    </div>
  );
}