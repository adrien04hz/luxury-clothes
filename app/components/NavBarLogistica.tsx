import Image from "next/image";
import Link from "next/link";

export default function NavBarLogistica() {

  return (
    <>
    <div className="w-full h-28 bg-black text-white flex justify-between px-12">
      <Link href="/" className="flex items-center justify-center">
        <Image 
          src="/assets/logo/main-logo.svg" 
          alt="Logo" 
          loading="eager"
          width={174} 
          height={80} 
        />
      </Link>
        
      
      <div className="flex space-x-7 items-center">
        <div className="flex space-x-5">
          <Link href="/logistica">
          <p>Envio</p>
          </Link>
          <Link href="/cuenta">
            <Image src="/assets/images/profile.svg" alt="User" width={30} height={30} />
          </Link>
         
        </div>
      </div>
    </div>
    </>
  );
}