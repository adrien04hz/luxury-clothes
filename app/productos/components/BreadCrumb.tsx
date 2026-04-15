import Link from "next/link";

export default function BreadCrumb() {
    return (
        <div className="flex items-center justify-start space-x-2 w-fit mt-3 mb-10 text-md font-light">
            <div className="hover:underline w-fit">
            <Link
                href={"#"}
            >Ropa</Link>
            </div>
            <span>/</span>
            <div className="hover:underline w-fit">
            <Link href={"#"}>Hombre</Link>
            </div>
            <span>/</span>
            <div className="hover:underline w-fit">
            <Link href={"#"}>Chamarra</Link>
            </div>
        </div>
    );
}